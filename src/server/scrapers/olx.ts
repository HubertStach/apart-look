import { politeFetchJson, ScraperError } from "./polite-fetch";
import { mapOlxResponse, type OlxResponse } from "./olx-map";
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

function buildUrl(params: OlxSearchParams, offset: number): string {
  const u = new URL(OLX_API);
  u.searchParams.set("offset", String(offset));
  u.searchParams.set("limit", "40");
  u.searchParams.set("category_id", String(CATEGORY_RENT_FLATS));
  u.searchParams.set("query", params.city);
  if (params.priceMin != null) u.searchParams.set("filter_float_price:from", String(params.priceMin));
  if (params.priceMax != null) u.searchParams.set("filter_float_price:to", String(params.priceMax));
  if (params.areaMin != null) u.searchParams.set("filter_float_m:from", String(params.areaMin));
  if (params.areaMax != null) u.searchParams.set("filter_float_m:to", String(params.areaMax));
  return u.toString();
}

/**
 * Wyszukuje ogłoszenia najmu na OLX przez nieoficjalne API v1.
 *
 * UWAGA: OLX stoi za CloudFront z detekcją botów (fingerprint TLS). Żądania
 * z serwera mogą zwracać 403 — wtedy wymagany jest fallback na realną
 * przeglądarkę (Playwright). Błąd jest raportowany jako ScraperError.
 */
export async function searchOlx(params: OlxSearchParams): Promise<ScrapedListing[]> {
  const maxPages = params.maxPages ?? 3;
  const results: ScrapedListing[] = [];

  for (let page = 0; page < maxPages; page++) {
    const url = buildUrl(params, page * 40);
    const res = await politeFetchJson<OlxResponse>(url, {
      source: "OLX",
      headers: {
        Accept: "application/json",
        Referer: "https://www.olx.pl/nieruchomosci/mieszkania/wynajem/",
      },
    });

    const mapped = mapOlxResponse(res);
    results.push(...mapped);

    // brak kolejnej strony lub pusta odpowiedź → koniec
    if (mapped.length === 0 || !res.links?.next?.href) break;
  }

  if (results.length === 0) {
    // Nie traktujemy pustego wyniku jako twardego błędu, ale logujemy hint.
    console.warn("[OLX] 0 wyników — możliwa blokada CloudFront lub brak ofert.");
  }

  return results;
}

export { ScraperError };
