import { smartFetchJson, ScraperError } from "./smart-fetch";
import { mapOlxResponse, type OlxResponse } from "./olx-map";
import { normalizeText } from "../pipeline/text";
import type { ScrapedListing } from "../pipeline/types";

const OLX_API = "https://www.olx.pl/api/v1/offers/";
// Kategoria "Mieszkania - wynajem" w OLX.
const CATEGORY_RENT_FLATS = 15;

export interface OlxSearchParams {
  city: string;
  rooms?: number;
  priceMin?: number | null;
  priceMax?: number | null;
  areaMin?: number | null;
  areaMax?: number | null;
  maxPages?: number;
}

/** Enum liczby pokoi w filtrze OLX. */
const OLX_ROOMS_ENUM: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
};

interface OlxGeoResponse {
  data?: { id?: number; name?: string; type?: string }[];
}

/** Cache city_id per znormalizowana nazwa miasta (na czas procesu). */
const cityIdCache = new Map<string, number | null>();

/** Strona do rozgrzania sesji przeglądarkowej (cookies + fingerprint). */
function warmUrlFor(city: string): string {
  return `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${normalizeText(city).replace(/\s+/g, "-")}/`;
}

/**
 * Zamienia nazwę miasta na city_id przez geo-encoder OLX.
 * Filtr city_id daje dokładniejsze wyniki niż pełnotekstowe `query`.
 */
async function resolveCityId(city: string): Promise<number | null> {
  const key = normalizeText(city);
  if (cityIdCache.has(key)) return cityIdCache.get(key) ?? null;

  try {
    const u = new URL("https://www.olx.pl/api/v1/geo-encoder/regions/");
    u.searchParams.set("query", city);
    const res = await smartFetchJson<OlxGeoResponse>(u.toString(), {
      warmUrl: warmUrlFor(city),
      source: "OLX",
    });
    const match = res.data?.find(
      (r) => r.type === "city" && r.name && normalizeText(r.name) === key,
    ) ?? res.data?.find((r) => r.type === "city");
    const id = match?.id ?? null;
    cityIdCache.set(key, id);
    return id;
  } catch {
    cityIdCache.set(key, null);
    return null; // fallback: wyszukiwanie po query
  }
}

function buildUrl(params: OlxSearchParams, cityId: number | null, offset: number): string {
  const u = new URL(OLX_API);
  u.searchParams.set("offset", String(offset));
  u.searchParams.set("limit", "40");
  u.searchParams.set("category_id", String(CATEGORY_RENT_FLATS));
  if (cityId != null) {
    u.searchParams.set("city_id", String(cityId));
  } else {
    u.searchParams.set("query", params.city);
  }
  if (params.rooms && OLX_ROOMS_ENUM[params.rooms]) {
    u.searchParams.set("filter_enum_rooms[0]", OLX_ROOMS_ENUM[params.rooms]!);
  }
  if (params.priceMin != null) u.searchParams.set("filter_float_price:from", String(params.priceMin));
  if (params.priceMax != null) u.searchParams.set("filter_float_price:to", String(params.priceMax));
  if (params.areaMin != null) u.searchParams.set("filter_float_m:from", String(params.areaMin));
  if (params.areaMax != null) u.searchParams.set("filter_float_m:to", String(params.areaMax));
  return u.toString();
}

/**
 * Wyszukuje ogłoszenia najmu na OLX przez nieoficjalne API v1.
 * Pobieranie przez smart-fetch: HTTP z automatycznym fallbackiem na
 * headless Chromium przy blokadzie CloudFront (fingerprint TLS).
 */
export async function searchOlx(params: OlxSearchParams): Promise<ScrapedListing[]> {
  const maxPages = params.maxPages ?? 3;
  const warmUrl = warmUrlFor(params.city);
  const cityId = await resolveCityId(params.city);
  const results: ScrapedListing[] = [];

  for (let page = 0; page < maxPages; page++) {
    const url = buildUrl(params, cityId, page * 40);
    const res = await smartFetchJson<OlxResponse>(url, { warmUrl, source: "OLX" });

    const mapped = mapOlxResponse(res);
    results.push(...mapped);

    // brak kolejnej strony lub pusta odpowiedź → koniec
    if (mapped.length === 0 || !res.links?.next?.href) break;
  }

  if (results.length === 0) {
    // Nie traktujemy pustego wyniku jako twardego błędu, ale logujemy hint.
    console.warn("[OLX] 0 wyników — możliwa blokada lub brak ofert.");
  }

  return results;
}

export { ScraperError };
