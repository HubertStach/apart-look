import type { ListingCollection } from "../collection";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Filtr końcowy: po `ScoreStep` (score policzony na danych wzbogaconych przez AI)
 * odrzuca oferty, które spadły poniżej progu. Bez tego kroku `PreScoreStep`
 * (liczony tylko na danych ze scrapera) mógłby przepuścić ofertę, której
 * ostateczny wynik po analizie AI jest niższy niż próg — a mieszkanie i tak
 * trafiłoby na stronę główną jako PASSED.
 *
 * Musi iść PO `ScoreStep` (potrzebuje `l.score`) i PRZED `PersistStep`.
 */
export class ScoreFilterStep implements PipelineStep {
  readonly name = "Filtr wyniku końcowego";

  constructor(private readonly threshold = 0.6) {}

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    col.reject(
      this.name,
      (l) => (l.score ?? 0) >= this.threshold,
      (l) => `końcowe dopasowanie ${Math.round((l.score ?? 0) * 100)}% < ${Math.round(this.threshold * 100)}%`,
    );

    const rejected = col
      .rejected()
      .filter((l) => l.rejected?.step === this.name).length;
    ctx.log(
      `Filtr wyniku końcowego: odrzucono ${rejected} ofert poniżej progu ${Math.round(this.threshold * 100)}%`,
    );
    return Promise.resolve(col);
  }
}
