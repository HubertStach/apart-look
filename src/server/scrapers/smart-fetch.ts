/**
 * Inteligentny wybór silnika pobierania:
 *  - "http"    — zwykły fetch (szybki, ale blokowany przez CloudFront/Cloudflare),
 *  - "browser" — headless Chromium (wolniejszy, pełny fingerprint),
 *  - "auto"    — próbuje http, przy blokadzie (403/challenge) przełącza na
 *                przeglądarkę i ZAPAMIĘTUJE decyzję dla domeny (na czas procesu).
 *
 * Konfiguracja przez env SCRAPE_ENGINE (domyślnie "auto").
 */
import { env } from "~/env";
import { politeFetch, politeFetchJson, ScraperError } from "./polite-fetch";
import { browserFetchHtml, browserFetchJson } from "./browser-fetch";

type Engine = "http" | "browser";

/** Pamięć: która domena wymaga przeglądarki (żeby nie marnować prób HTTP). */
const domainEngine = new Map<string, Engine>();

function hostOf(url: string): string {
  return new URL(url).host;
}

/** Czy błąd wygląda na blokadę anty-bot (a nie np. timeout sieci)? */
function isBlockError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /HTTP 40[13]|HTTP 429|blokada|challenge|just a moment/i.test(msg);
}

function pickEngine(url: string): Engine {
  if (env.SCRAPE_ENGINE === "http") return "http";
  if (env.SCRAPE_ENGINE === "browser") return "browser";
  return domainEngine.get(hostOf(url)) ?? "http";
}

function rememberBrowser(url: string, source: string): void {
  const host = hostOf(url);
  if (domainEngine.get(host) !== "browser") {
    domainEngine.set(host, "browser");
    console.log(`[${source}] ${host}: blokada HTTP — przełączam na przeglądarkę`);
  }
}

/** Pobiera HTML — auto-fallback http → browser. */
export async function smartFetchHtml(
  url: string,
  opts: { source?: string } = {},
): Promise<string> {
  const source = opts.source ?? "scraper";
  if (pickEngine(url) === "browser") {
    return browserFetchHtml(url, { source });
  }
  try {
    return await politeFetch(url, { source, retries: 0 });
  } catch (err) {
    if (env.SCRAPE_ENGINE === "http" || !isBlockError(err)) throw err;
    rememberBrowser(url, source);
    return browserFetchHtml(url, { source });
  }
}

/**
 * Pobiera JSON z API — auto-fallback http → browser (same-origin fetch
 * w rozgrzanej karcie; `warmUrl` = strona originu do zainicjowania sesji).
 */
export async function smartFetchJson<T = unknown>(
  url: string,
  opts: { warmUrl: string; source?: string },
): Promise<T> {
  const source = opts.source ?? "scraper";
  if (pickEngine(url) === "browser") {
    return browserFetchJson<T>(url, { warmUrl: opts.warmUrl, source });
  }
  try {
    return await politeFetchJson<T>(url, { source, retries: 0 });
  } catch (err) {
    if (env.SCRAPE_ENGINE === "http" || !isBlockError(err)) throw err;
    rememberBrowser(url, source);
    return browserFetchJson<T>(url, { warmUrl: opts.warmUrl, source });
  }
}

export { ScraperError };
