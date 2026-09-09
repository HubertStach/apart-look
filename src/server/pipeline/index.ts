import type { PrismaClient, SearchProfile } from "../../../generated/prisma";
import { ListingPipeline } from "./pipeline";
import type { PipelineStats } from "./types";
import { DedupeStep } from "./steps/dedupe";
import { HardFilterStep } from "./steps/hard-filter";
import { ScoreStep } from "./steps/score";
import { PersistStep } from "./steps/persist";
import { MockScrapeStep } from "./steps/mock-scrape";
import { ScrapeOlxStep } from "./steps/scrape-olx";
import { ScrapeOtodomStep } from "./steps/scrape-otodom";
import { FetchDetailsStep } from "./steps/fetch-details";
import { AiExtractStep } from "./steps/ai-extract";
import { AiVerifyStep } from "./steps/ai-verify";

export { ListingPipeline } from "./pipeline";
export { ListingCollection } from "./collection";

/**
 * Domyślny łańcuch wyszukiwania. Kolejność kroków = kolejność wykonania.
 * Dodanie nowego etapu = jedna linijka `.use(...)`.
 *
 * `useMock` podmienia realne scrapery na deterministyczny mock (testy/rozwój UI).
 */
export function buildDefaultPipeline(opts: { useMock?: boolean } = {}): ListingPipeline {
  const pipeline = new ListingPipeline();

  if (opts.useMock) {
    pipeline.use(new MockScrapeStep());
  } else {
    pipeline.use(new ScrapeOlxStep());
    pipeline.use(new ScrapeOtodomStep());
  }

  pipeline
    .use(new DedupeStep())
    .use(new HardFilterStep())
    .use(new FetchDetailsStep())
    .use(new AiExtractStep())
    .use(new AiVerifyStep())
    .use(new ScoreStep())
    .use(new PersistStep());

  return pipeline;
}

const EMPTY_STATS: PipelineStats = {
  scraped: 0,
  deduped: 0,
  filtered: 0,
  aiChecked: 0,
  passed: 0,
  rejected: 0,
  saved: 0,
};

/**
 * Uruchamia pipeline dla profilu i aktualizuje rekord ScrapeRun.
 * Wywoływane fire-and-forget z routera (bez await) — dlatego łapiemy wszystko.
 */
export async function runPipeline(
  db: PrismaClient,
  profile: SearchProfile,
  runId: string,
  opts: { useMock?: boolean } = {},
): Promise<void> {
  const stats: PipelineStats = { ...EMPTY_STATS };

  const reportProgress = async (
    step: string,
    partial?: Partial<PipelineStats>,
  ) => {
    if (partial) Object.assign(stats, partial);
    await db.scrapeRun.update({
      where: { id: runId },
      data: { currentStep: step, statsJson: JSON.stringify(stats) },
    });
  };

  try {
    const pipeline = buildDefaultPipeline(opts);
    const result = await pipeline.execute({
      profile,
      runId,
      db,
      log: (msg) => console.log(`[pipeline:${runId}] ${msg}`),
      reportProgress,
    });

    stats.passed = result.active().length;
    stats.rejected = result.rejected().length;

    await db.scrapeRun.update({
      where: { id: runId },
      data: {
        status: "DONE",
        currentStep: "Zakończono",
        statsJson: JSON.stringify(stats),
        finishedAt: new Date(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[pipeline:${runId}] BŁĄD:`, err);
    await db.scrapeRun.update({
      where: { id: runId },
      data: {
        status: "ERROR",
        error: message,
        finishedAt: new Date(),
      },
    });
  } finally {
    // Zamknij headless przeglądarkę (jeśli była użyta) — oszczędzamy RAM.
    const { closeBrowser } = await import("../scrapers/browser-fetch");
    await closeBrowser();
  }
}
