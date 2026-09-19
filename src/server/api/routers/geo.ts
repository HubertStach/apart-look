import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * Geokodowanie adresów przez Nominatim (OpenStreetMap) — na potrzeby mapki w karcie.
 *
 * Polityka Nominatim (https://operations.osmfoundation.org/policies/nominatim/):
 * max 1 żądanie/s, wymagany nagłówek User-Agent, brak masowego użycia. Dlatego:
 *  - wynik cache'ujemy w pamięci procesu (Map) — ta sama ulica pytana raz,
 *  - żądania SERIALIZUJEMY z odstępem ~1 s (kolejka), żeby nie przekroczyć limitu.
 * Dla aplikacji single-user to w zupełności wystarcza.
 */

interface GeoResult {
  lat: number;
  lon: number;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_INTERVAL_MS = 1100; // > 1 req/s z zapasem

// Cache: query (znormalizowane) -> wynik lub null (nie znaleziono). Żyje w procesie.
const cache = new Map<string, GeoResult | null>();

// Prosta kolejka: łańcuch obietnic gwarantujący odstęp między żądaniami sieciowymi.
let queue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

async function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequestAt = Date.now();
    return fn();
  };
  const result = queue.then(run, run);
  // Nie przerywaj łańcucha przy błędzie kolejnego żądania.
  queue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function geocode(street: string, city?: string | null): Promise<GeoResult | null> {
  // Nominatim nie rozpoznaje skróconych przedrostków ("ul. Długa" → brak wyniku),
  // a radzi sobie z samą nazwą ("Długa"). Usuwamy wiodący przedrostek.
  const cleanedStreet = street
    .replace(/^\s*(?:ul|ulica|ulicy|al|aleja|aleje|alei|os|osiedle|osiedla|pl|plac)\b\.?\s+/i, "")
    .trim();
  if (!cleanedStreet) return null;
  const cityTerm = (city ?? "").trim() === "null" ? "" : (city ?? "").trim();
  // Miasto OBOWIĄZKOWE: bez niego Nominatim trafiał w ulicę o tej samej nazwie
  // w innym mieście PL. Profil zawsze ma city (required), a persist je uzupełnia,
  // więc brak city = dane niekompletne → nie geokoduj (lepiej brak mapy niż zła).
  if (!cityTerm) return null;

  const key = `${cleanedStreet}|${cityTerm}`.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const result = await throttled(async () => {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    // ZAPYTANIE STRUKTURALNE (street/city) zamiast wolnego `q`: wolne `q` z numerem
    // domu potrafi dopasować POI ("Długa 12" → kawiarnia), przez co mapka pokazywała
    // szkołę/lokal zamiast adresu. Parametr `street` (z ewentualnym numerem domu)
    // ogranicza Nominatim do warstwy adresowej → zwraca ulicę/dom, nie POI.
    url.searchParams.set("street", cleanedStreet);
    if (cityTerm) url.searchParams.set("city", cityTerm);
    // Ograniczenie do Polski — ulica o tej samej nazwie istnieje w wielu krajach;
    // countrycodes=pl gwarantuje, że mapka nie wyskoczy poza PL (PLAN pkt 1).
    url.searchParams.set("countrycodes", "pl");
    url.searchParams.set("addressdetails", "0");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          // Wymagane przez politykę Nominatim.
          "User-Agent": "apart-look/1.0 (local single-user apartment finder)",
          "Accept-Language": "pl",
        },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { lat?: string; lon?: string }[];
      const first = data[0];
      if (!first?.lat || !first?.lon) return null;
      const lat = Number.parseFloat(first.lat);
      const lon = Number.parseFloat(first.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      return { lat, lon };
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  });

  cache.set(key, result);
  return result;
}

export const geoRouter = createTRPCRouter({
  /** Zwraca współrzędne dla ulicy (opcjonalnie w mieście) lub null. */
  geocode: publicProcedure
    .input(z.object({ street: z.string().min(2), city: z.string().nullish() }))
    .query(async ({ input }) => {
      return geocode(input.street, input.city);
    }),
});
