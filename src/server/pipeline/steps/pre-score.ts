import type { ListingCollection } from "../collection";
import { computeScore } from "../scoring";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Wstępna ocena dopasowania — WYŁĄCZNIE na podstawie danych ze scrapera
 * (bez AI, bo `l.ai` jeszcze nie istnieje na tym etapie). Odrzuca oferty
 * poniżej progu `threshold`, zanim trafią do (drogich) kroków:
 * pobranie opisów, analiza AI, weryfikacja AI.
 *
 * Cel: mniej ofert do AI => szybszy przebieg. `computeScore` traktuje braki
 * danych jako "nieznane" (0.5/0.4), więc oferty z niepełnymi danymi nie są
 * karane niesprawiedliwie — AI i tak dostanie szansę je uzupełnić, o ile
 * wstępny score przekroczy próg.
 *
 * Końcowy `ScoreStep` i tak przelicza score ponownie po wzbogaceniu AI —
 * ten krok tylko zawęża zbiór, nie ustala ostatecznego wyniku.
 */
export class PreScoreStep implements PipelineStep {
  readonly name = "Wstępna ocena";

  constructor(private readonly threshold = 0.7) {}

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    col.reject(
      this.name,
      (l) => computeScore(l, ctx.profile) >= this.threshold,
      (l) => `wstępne dopasowanie ${Math.round(computeScore(l, ctx.profile) * 100)}% < ${Math.round(this.threshold * 100)}%`,
    );

    const rejected = col
      .rejected()
      .filter((l) => l.rejected?.step === this.name).length;
    ctx.log(
      `Wstępna ocena: odrzucono ${rejected} ofert poniżej progu ${Math.round(this.threshold * 100)}%`,
    );
    return Promise.resolve(col);
  }
}
