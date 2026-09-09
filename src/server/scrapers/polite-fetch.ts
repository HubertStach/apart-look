/**
 * Grzeczny fetch dla scrapowania: realny User-Agent, retry z backoffem,
 * odstęp między requestami + jitter, prosty cache w pamięci (15 min).
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<string, { at: number; body: string }>();

let lastRequestAt = 0;
const MIN_INTERVAL_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Odstęp 1-2 s (z jitterem) między kolejnymi żądaniami sieciowymi. */
async function throttle(): Promise<void> {
  const now = Date.now();
  const wait = Math.max(0, lastRequestAt + MIN_INTERVAL_MS - now);
  const jitter = Math.floor(Math.random() * 800);
  await sleep(wait + jitter);
  lastRequestAt = Date.now();
}

export class ScraperError extends Error {
  constructor(
    message: string,
    readonly source: string,
  ) {
    super(message);
    this.name = "ScraperError";
  }
}

export interface FetchOptions {
  headers?: Record<string, string>;
  cache?: boolean;
  retries?: number;
  source?: string;
}

/** Pobiera tekst (HTML/JSON) z grzecznym tempem, retry i cache. */
export async function politeFetch(
  url: string,
  opts: FetchOptions = {},
): Promise<string> {
  const { cache: useCache = true, retries = 2, source = "scraper" } = opts;

  if (useCache) {
    const hit = cache.get(url);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.body;
  }

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await throttle();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": UA,
          "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.6",
          Accept: "text/html,application/json,application/xhtml+xml,*/*;q=0.8",
          ...opts.headers,
        },
      }).finally(() => clearTimeout(timeout));

      if (res.status === 429 || res.status >= 500) {
        throw new ScraperError(`HTTP ${res.status}`, source);
      }
      if (!res.ok) {
        throw new ScraperError(`HTTP ${res.status} dla ${url}`, source);
      }

      const body = await res.text();
      if (useCache) cache.set(url, { at: Date.now(), body });
      return body;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(1000 * Math.pow(2, attempt) + Math.random() * 500);
      }
    }
  }

  throw new ScraperError(
    `Nie udało się pobrać ${url}: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
    source,
  );
}

/** Pobiera i parsuje JSON. */
export async function politeFetchJson<T = unknown>(
  url: string,
  opts: FetchOptions = {},
): Promise<T> {
  const body = await politeFetch(url, opts);
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ScraperError(`Niepoprawny JSON z ${url}`, opts.source ?? "scraper");
  }
}
