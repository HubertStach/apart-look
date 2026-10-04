import type { PrismaClient, SearchProfile } from "../../../generated/prisma";
import { ListingPipeline } from "./pipeline";
import type { PipelineStats } from "./types";
import { DedupeStep } from "./steps/dedupe";
import { HardFilterStep } from "./steps/hard-filter";
import { AreaFilterStep } from "./steps/area-filter";
import { PreScoreStep } from "./steps/pre-score";
import { StreamProcessStep } from "./steps/stream-process";
import { MockScrapeStep } from "./steps/mock-scrape";
import { ScrapeOlxStep } from "./steps/scrape-olx";
import { ScrapeOtodomStep } from "./steps/scrape-otodom";
import { env } from "~/env";

export { ListingPipeline } from "./pipeline";
export { ListingCollection } from "./collection";

/**
 * Domyślny łańcuch wyszukiwania. Kolejność kroków = kolejność wykonania.
 * Dodanie nowego etapu = jedna linijka `.use(...)`.
 *
 * `useMock` podmienia realne scrapery na deterministyczny mock (testy/rozwój UI).
 */
export function buildDefaultPipeline(
  opts: { useMock?: boolean; preScoreThreshold?: number } = {},
): ListingPipeline {
  const pipeline = new ListingPipeline();

  if (opts.useMock) {
    pipeline.use(new MockScrapeStep());
  } else {
    pipeline.use(new ScrapeOlxStep());
    pipeline.use(new ScrapeOtodomStep());
  }

  const threshold = opts.preScoreThreshold ?? env.PRE_SCORE_THRESHOLD;
  pipeline
    .use(new DedupeStep())
    .use(new HardFilterStep())
    // Filtr powierzchni PRZED AI: uzupełnia brakujący metraż z treści (regex)
    // i odrzuca oferty poza widełkami, zanim trafią do drogich kroków AI.
    .use(new AreaFilterStep())
    .use(new PreScoreStep(threshold))
    // Strumieniowy ogon: dla każdego ogłoszenia po kolei robi AI + selekcję
    // i NATYCHMIAST zapisuje wynik → mieszkania pojawiają się na bieżąco.
    .use(new StreamProcessStep(threshold));

  return pipeline;
}

const EMPTY_STATS: PipelineStats = {
  scraped: 0,
  deduped: 0,
  filtered: 0,
  preScored: 0,
  aiChecked: 0,
  passed: 0,
  rejected: 0,
  saved: 0,
};

/**
 * Przebieg został anulowany: rekord `ScrapeRun` zniknął z bazy (przycisk
 * „Wyczyść"). Usunięcie wiersza JEST sygnałem stopu — nie trzymamy osobnego
 * rejestru anulowań w pamięci, bo baza i tak jest jedynym źródłem prawdy.
 */
class PipelineCancelledError extends Error {
  constructor() {
    super("Przebieg anulowany (wyczyszczono dane)");
    this.name = "PipelineCancelledError";
  }
}

/**
 * Uruchamia pipeline dla profilu i aktualizuje rekord ScrapeRun.
 * Wywoływane fire-and-forget z routera (bez await) — dlatego łapiemy wszystko.
 *
 * ANULOWANIE: `reportProgress` jest wołane przed każdym krokiem i przy każdej
 * ofercie w `StreamProcessStep`, więc to naturalny punkt kontrolny. Gdy wiersz
 * `ScrapeRun` już nie istnieje (usunęło go `scrape.clear`), rzucamy
 * `PipelineCancelledError` i cały przebieg zwija się przez istniejący `catch`.
 */
export async function runPipeline(
  db: PrismaClient,
  profile: SearchProfile,
  runId: string,
  opts: { useMock?: boolean; preScoreThreshold?: number } = {},
): Promise<void> {
  const stats: PipelineStats = { ...EMPTY_STATS };

  const reportProgress = async (
    step: string,
    partial?: Partial<PipelineStats>,
  ) => {
    if (partial) Object.assign(stats, partial);
    // `updateMany` (nie `update`) nie rzuca, gdy wiersza nie ma — zwraca count 0,
    // co jest dla nas sygnałem „przebieg anulowany".
    const res = await db.scrapeRun.updateMany({
      where: { id: runId },
      data: { currentStep: step, statsJson: JSON.stringify(stats) },
    });
    if (res.count === 0) throw new PipelineCancelledError();
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

    await db.scrapeRun.updateMany({
      where: { id: runId },
      data: {
        status: "DONE",
        currentStep: "Zakończono",
        statsJson: JSON.stringify(stats),
        finishedAt: new Date(),
      },
    });
  } catch (err) {
    if (err instanceof PipelineCancelledError) {
      // Przebieg przerwany przez użytkownika — nie ma czego i gdzie zapisywać
      // (wiersz ScrapeRun już nie istnieje). Nie jest to błąd.
      console.log(`[pipeline:${runId}] przerwany — dane wyczyszczone.`);
    } else {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[pipeline:${runId}] BŁĄD:`, err);
      // `updateMany` zamiast `update`: gdy wiersz zniknął w trakcie, nie chcemy
      // drugiego wyjątku w fire-and-forget (nieobsłużone odrzucenie promise).
      await db.scrapeRun.updateMany({
        where: { id: runId },
        data: {
          status: "ERROR",
          error: message,
          finishedAt: new Date(),
        },
      });
    }
  } finally {
    // Zamknij headless przeglądarkę (jeśli była użyta) — oszczędzamy RAM.
    const { closeBrowser } = await import("../scrapers/browser-fetch");
    await closeBrowser();
  }
}
