import * as cheerio from "cheerio";
import type { ScrapedListing } from "../pipeline/types";
import { parseArea, parsePrice, parseRooms } from "../pipeline/text";

/**
 * Otodom to aplikacja Next.js — dane wyników siedzą w <script id="__NEXT_DATA__">.
 * Struktura bywa zmieniana; parsujemy defensywnie i przechodzimy przez znane ścieżki.
 */
export interface OtodomAd {
  id?: number | string;
  slug?: string;
  title?: string;
  totalPrice?: { value?: number } | null;
  rentPrice?: { value?: number } | null;
  areaInSquareMeters?: number;
  roomsNumber?: number | string;
  location?: {
    address?: {
      city?: { name?: string };
      district?: { name?: string };
    };
    // niektóre warianty:
    reverseGeocoding?: { locations?: { fullName?: string }[] };
  };
  images?: { large?: string; medium?: string }[];
  description?: string;
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

  const price = ad.rentPrice?.value ?? ad.totalPrice?.value;
  const city =
    ad.location?.address?.city?.name ??
    ad.location?.reverseGeocoding?.locations?.at(-1)?.fullName;

  return {
    source: "OTODOM",
    externalId: String(ad.id),
    url,
    title: ad.title ?? "(bez tytułu)",
    description: ad.description,
    price: parsePrice(price ?? null),
    area: parseArea(ad.areaInSquareMeters ?? null),
    rooms: parseRooms(ad.roomsNumber ?? ad.title ?? null),
    city,
    district: ad.location?.address?.district?.name,
    imageUrl: ad.images?.[0]?.large ?? ad.images?.[0]?.medium,
  };
}

export function mapOtodomHtml(html: string): ScrapedListing[] {
  const nextData = extractNextData(html);
  return findOtodomAds(nextData)
    .map(mapOtodomAd)
    .filter((x): x is ScrapedListing => x !== null);
}
