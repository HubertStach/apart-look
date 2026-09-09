import { politeFetch } from "./polite-fetch";
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

/** Slug miasta w URL Otodom: małe litery, bez diakrytyków, spacje→myślniki. */
function citySlug(city: string): string {
  return normalizeText(city).replace(/\s+/g, "-");
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
    u.searchParams.set("roomsNumber", `%5B${ROOMS_ENUM[params.rooms]}%5D`);
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
    const html = await politeFetch(url, {
      source: "OTODOM",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        Referer: "https://www.otodom.pl/",
      },
    });

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
  const html = await politeFetch(url, { source: "OTODOM" });
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
