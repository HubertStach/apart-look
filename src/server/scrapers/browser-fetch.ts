/**
 * Warstwa fetch oparta na prawdziwej przeglądarce (Playwright/Chromium).
 *
 * OLX (CloudFront) i Otodom (Cloudflare) blokują żądania z Node po
 * fingerprincie TLS — nagłówki nie pomagają. Headless Chromium ma pełny
 * fingerprint przeglądarki i przechodzi przez obie blokady (zweryfikowane).
 *
 * Architektura:
 *  - jeden współdzielony browser (lazy singleton) + jeden kontekst PL,
 *  - kolejka: jedno żądanie naraz + odstęp 1-2 s z jitterem (grzeczne tempo),
 *  - HTML: page.goto() → page.content(),
 *  - JSON API: „rozgrzana" karta na danym originie → page.evaluate(fetch)
 *    (same-origin XHR z ciasteczkami i pełnym fingerprintem JS).
 */
import type { Browser, BrowserContext, Page } from "playwright";
import { ScraperError } from "./polite-fetch";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const MIN_INTERVAL_MS = 1200;
const NAV_TIMEOUT_MS = 35_000;

let browserPromise: Promise<Browser> | null = null;
let contextPromise: Promise<BrowserContext> | null = null;
/** Rozgrzane karty per-origin (do same-origin fetch API). */
const warmPages = new Map<string, Page>();

let queueTail: Promise<void> = Promise.resolve();
let lastRequestAt = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Serializacja żądań: jedno naraz, z odstępem + jitter. */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queueTail.then(async () => {
    const wait = Math.max(0, lastRequestAt + MIN_INTERVAL_MS - Date.now());
    await sleep(wait + Math.floor(Math.random() * 600));
    try {
      return await task();
    } finally {
      lastRequestAt = Date.now();
    }
  });
  queueTail = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function getContext(): Promise<BrowserContext> {
  contextPromise ??= (async () => {
    // dynamiczny import — playwright ładuje się tylko gdy faktycznie potrzebny
    const { chromium } = await import("playwright");
    browserPromise ??= chromium.launch({
      headless: true,
      args: ["--disable-blink-features=AutomationControlled"],
    });
    const browser = await browserPromise;
    const ctx = await browser.newContext({
      locale: "pl-PL",
      timezoneId: "Europe/Warsaw",
      viewport: { width: 1366, height: 900 },
      userAgent: UA,
    });
    ctx.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    return ctx;
  })();
  return contextPromise;
}

/** Czy strona to interstitial Cloudflare/CloudFront zamiast właściwej treści? */
async function looksBlocked(page: Page): Promise<boolean> {
  const title = (await page.title()).toLowerCase();
  return (
    title.includes("just a moment") ||
    title.includes("attention required") ||
    title.includes("access denied") ||
    title.includes("error")
  );
}

/** Pobiera pełny HTML strony przez przeglądarkę. */
export async function browserFetchHtml(
  url: string,
  opts: { source?: string; waitMs?: number } = {},
): Promise<string> {
  const source = opts.source ?? "browser";
  return enqueue(async () => {
    const ctx = await getContext();
    const page = await ctx.newPage();
    try {
      const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
      // krótka pauza na dociągnięcie skryptów / ewentualny challenge
      await page.waitForTimeout(opts.waitMs ?? 1500);
      if (await looksBlocked(page)) {
        // challenge JS zwykle rozwiązuje się w kilka sekund — dajmy mu szansę
        await page.waitForTimeout(6000);
        if (await looksBlocked(page)) {
          throw new ScraperError(
            `Blokada anty-bot na ${new URL(url).host} (challenge nie przeszedł)`,
            source,
          );
        }
      }
      const status = resp?.status() ?? 0;
      if (status >= 400) {
        throw new ScraperError(`HTTP ${status} dla ${url}`, source);
      }
      return await page.content();
    } finally {
      await page.close().catch(() => undefined);
    }
  });
}

/** Zwraca rozgrzaną kartę dla danego originu (tworzy i nawiguję przy pierwszym użyciu). */
async function getWarmPage(warmUrl: string): Promise<Page> {
  const origin = new URL(warmUrl).origin;
  const existing = warmPages.get(origin);
  if (existing && !existing.isClosed()) return existing;

  const ctx = await getContext();
  const page = await ctx.newPage();
  await page.goto(warmUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  warmPages.set(origin, page);
  return page;
}

/**
 * Pobiera JSON z API przez fetch wykonany WEWNĄTRZ strony na tym samym originie
 * (pełny fingerprint + cookies). `warmUrl` to strona do rozgrzania sesji.
 */
export async function browserFetchJson<T = unknown>(
  url: string,
  opts: { warmUrl: string; source?: string },
): Promise<T> {
  const source = opts.source ?? "browser";
  return enqueue(async () => {
    const page = await getWarmPage(opts.warmUrl);
    const result = await page.evaluate(
      async (apiUrl: string) => {
        const r = await fetch(apiUrl, {
          headers: { Accept: "application/json" },
        });
        return { status: r.status, body: await r.text() };
      },
      url,
    );
    if (result.status >= 400) {
      throw new ScraperError(`HTTP ${result.status} dla ${url}`, source);
    }
    try {
      return JSON.parse(result.body) as T;
    } catch {
      throw new ScraperError(`Niepoprawny JSON z ${url}`, source);
    }
  });
}

/** Zamyka przeglądarkę (koniec przebiegu — oszczędzamy RAM). */
export async function closeBrowser(): Promise<void> {
  warmPages.clear();
  const ctxP = contextPromise;
  const brP = browserPromise;
  contextPromise = null;
  browserPromise = null;
  try {
    if (ctxP) await (await ctxP).close();
  } catch {
    /* ignore */
  }
  try {
    if (brP) await (await brP).close();
  } catch {
    /* ignore */
  }
}
