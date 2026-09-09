import * as cheerio from "cheerio";
import type { ScrapedListing } from "../pipeline/types";
import { parseArea, parsePrice } from "../pipeline/text";

/**
 * Otodom to aplikacja Next.js — dane wyników siedzą w <script id="__NEXT_DATA__">
 * pod ścieżką props.pageProps.data.searchAds.items (zweryfikowane 2026-09).
 *
 * Uwaga na semantykę cen (zweryfikowana na żywych danych):
 *  - totalPrice = czynsz najmu (główna cena oferty),
 *  - rentPrice  = czynsz administracyjny (dodatkowy!).
 */
export interface OtodomAd {
  id?: number | string;
  slug?: string;
  title?: string;
  estate?: string; // "FLAT"
  transaction?: string; // "RENT"
  totalPrice?: { value?: number } | null;
  rentPrice?: { value?: number } | null;
  areaInSquareMeters?: number;
  roomsNumber?: number | string; // enum: "ONE" | "TWO" | ... lub liczba
  shortDescription?: string;
  location?: {
    address?: {
      city?: { name?: string };
      district?: { name?: string };
    };
    reverseGeocoding?: {
      locations?: { name?: string; locationLevel?: string; fullName?: string }[];
    };
  };
  images?: { large?: string; medium?: string }[];
  description?: string;
}

/** Enum liczby pokoi Otodom → liczba. */
const ROOMS_WORD: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
};

function parseOtodomRooms(value: number | string | undefined): number | undefined {
  if (value == null) return undefined;
  if (typeof value === "number") return value;
  const mapped = ROOMS_WORD[value.toUpperCase()];
  if (mapped) return mapped;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

/** Wyciąga JSON z __NEXT_DATA__ danego HTML. */
export function extractNextData(html: string): unknown {
  const $ = cheerio.load(html);
  const raw = $("#__NEXT_DATA__").first().contents().text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Bezpieczne przejście po ścieżce w obiekcie. */
function dig(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

/** Znajduje listę ogłoszeń w strukturze __NEXT_DATA__ (kilka znanych ścieżek). */
export function findOtodomAds(nextData: unknown): OtodomAd[] {
  const candidates: (string | number)[][] = [
    ["props", "pageProps", "data", "searchAds", "items"],
    ["props", "pageProps", "data", "searchAdsResult", "items"],
    ["props", "pageProps", "searchAds", "items"],
  ];
  for (const path of candidates) {
    const found = dig(nextData, path);
    if (Array.isArray(found)) return found as OtodomAd[];
  }
  return [];
}

export function mapOtodomAd(ad: OtodomAd): ScrapedListing | null {
  if (ad.id == null) return null;
  const slug = ad.slug ?? String(ad.id);
  const url = `https://www.otodom.pl/pl/oferta/${slug}`;

  const geo = ad.location?.reverseGeocoding?.locations ?? [];
  const city =
    ad.location?.address?.city?.name ??
    geo.find((l) => l.locationLevel === "city_or_village")?.name;
  const district =
    ad.location?.address?.district?.name ??
    geo.find((l) => l.locationLevel === "district")?.name;

  return {
    source: "OTODOM",
    externalId: String(ad.id),
    url,
    title: ad.title ?? "(bez tytułu)",
    description: ad.description ?? ad.shortDescription,
    // totalPrice = czynsz najmu; rentPrice = czynsz administracyjny (dodatek)
    price: parsePrice(ad.totalPrice?.value ?? null),
    rentExtra: parsePrice(ad.rentPrice?.value ?? null),
    area: parseArea(ad.areaInSquareMeters ?? null),
    rooms: parseOtodomRooms(ad.roomsNumber),
    city,
    district,
    imageUrl: ad.images?.[0]?.large ?? ad.images?.[0]?.medium,
  };
}

export function mapOtodomHtml(html: string): ScrapedListing[] {
  const nextData = extractNextData(html);
  return findOtodomAds(nextData)
    .map(mapOtodomAd)
    .filter((x): x is ScrapedListing => x !== null);
}
