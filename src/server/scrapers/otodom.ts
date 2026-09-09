import { smartFetchHtml, ScraperError } from "./smart-fetch";
import { extractNextData, mapOtodomHtml } from "./otodom-map";
import { normalizeText } from "../pipeline/text";
import type { ScrapedListing } from "../pipeline/types";
import * as cheerio from "cheerio";

export interface OtodomSearchParams {
  city: string;
  rooms?: number;
  priceMin?: number | null;
  priceMax?: number | null;
  areaMin?: number | null;
  areaMax?: number | null;
  maxPages?: number;
}

const ROOMS_ENUM: Record<number, string> = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

/**
 * Pełne slugi lokalizacji Otodom (wojewodztwo/powiat/gmina/miasto) —
 * wszystkie zweryfikowane na żywych URL-ach (2026-09). Krótkie slugi
 * typu /mieszkanie/krakow zwracają 404.
 */
const CITY_SLUGS: Record<string, string> = {
  krakow: "malopolskie/krakow/krakow/krakow",
  warszawa: "mazowieckie/warszawa/warszawa/warszawa",
  wroclaw: "dolnoslaskie/wroclaw/wroclaw/wroclaw",
  poznan: "wielkopolskie/poznan/poznan/poznan",
  gdansk: "pomorskie/gdansk/gdansk/gdansk",
  lodz: "lodzkie/lodz/lodz/lodz",
  katowice: "slaskie/katowice/katowice/katowice",
  lublin: "lubelskie/lublin/lublin/lublin",
  szczecin: "zachodniopomorskie/szczecin/szczecin/szczecin",
  bydgoszcz: "kujawsko--pomorskie/bydgoszcz/bydgoszcz/bydgoszcz",
  torun: "kujawsko--pomorskie/torun/torun/torun",
  rzeszow: "podkarpackie/rzeszow/rzeszow/rzeszow",
  bialystok: "podlaskie/bialystok/bialystok/bialystok",
  gdynia: "pomorskie/gdynia/gdynia/gdynia",
  olsztyn: "warminsko--mazurskie/olsztyn/olsztyn/olsztyn",
  kielce: "swietokrzyskie/kielce/kielce/kielce",
};

/** Slug miasta w URL Otodom: małe litery, bez diakrytyków, spacje→myślniki. */
function citySlug(city: string): string {
  const key = normalizeText(city).replace(/\s+/g, "-");
  const full = CITY_SLUGS[key];
  if (!full) {
    throw new ScraperError(
      `Otodom: nieznany slug lokalizacji dla "${city}" — dodaj miasto do CITY_SLUGS w otodom.ts`,
      "OTODOM",
    );
  }
  return full;
}

function buildUrl(params: OtodomSearchParams, page: number): string {
  const u = new URL(
    `https://www.otodom.pl/pl/wyniki/wynajem/mieszkanie/${citySlug(params.city)}`,
  );
  if (params.priceMin != null) u.searchParams.set("priceMin", String(params.priceMin));
  if (params.priceMax != null) u.searchParams.set("priceMax", String(params.priceMax));
  if (params.areaMin != null) u.searchParams.set("areaMin", String(params.areaMin));
  if (params.areaMax != null) u.searchParams.set("areaMax", String(params.areaMax));
  if (params.rooms && ROOMS_ENUM[params.rooms]) {
    // searchParams.set sam enkoduje — podajemy surowe [ONE], nie %5BONE%5D
    u.searchParams.set("roomsNumber", `[${ROOMS_ENUM[params.rooms]}]`);
  }
  u.searchParams.set("limit", "36");
  if (page > 1) u.searchParams.set("page", String(page));
  return u.toString();
}

/**
 * Wyszukuje ogłoszenia najmu na Otodom przez parsowanie __NEXT_DATA__.
 *
 * UWAGA: Otodom bywa chroniony przez Cloudflare — żądania serwerowe mogą
 * napotkać interstitial "Just a moment". Wtedy wymagany fallback na Playwright.
 */
export async function searchOtodom(params: OtodomSearchParams): Promise<ScrapedListing[]> {
  const maxPages = params.maxPages ?? 3;
  const results: ScrapedListing[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = buildUrl(params, page);
    const html = await smartFetchHtml(url, { source: "OTODOM" });

    const mapped = mapOtodomHtml(html);
    results.push(...mapped);
    if (mapped.length === 0) break;
  }

  if (results.length === 0) {
    console.warn("[Otodom] 0 wyników — możliwa blokada Cloudflare lub zmiana struktury.");
  }

  return results;
}

/** Dociąga pełny opis pojedynczego ogłoszenia (strona szczegółów). */
export async function fetchOtodomDetails(url: string): Promise<string | undefined> {
  const html = await smartFetchHtml(url, { source: "OTODOM" });
  const nextData = extractNextData(html);
  const desc = digDescription(nextData);
  if (desc) return desc;
  // fallback: meta description
  const $ = cheerio.load(html);
  return $('meta[name="description"]').attr("content") ?? undefined;
}

function digDescription(nextData: unknown): string | undefined {
  const paths = [
    ["props", "pageProps", "ad", "description"],
    ["props", "pageProps", "data", "ad", "description"],
  ];
  for (const path of paths) {
    let cur: unknown = nextData;
    for (const key of path) {
      if (cur == null || typeof cur !== "object") {
        cur = undefined;
        break;
      }
      cur = (cur as Record<string, unknown>)[key];
    }
    if (typeof cur === "string" && cur.length > 0) {
      // opis bywa w HTML — usuwamy tagi
      return cur.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
  }
  return undefined;
}
