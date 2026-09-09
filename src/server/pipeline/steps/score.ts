import type { ListingCollection } from "../collection";
import { computeScore } from "../scoring";
import type { PipelineContext, PipelineStep } from "../types";

/** Nadaje każdemu aktywnemu ogłoszeniu score 0..1 (średnia ważona preferencji). */
export class ScoreStep implements PipelineStep {
  readonly name = "Ocena dopasowania";

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    for (const l of col.active()) {
      l.score = computeScore(l, ctx.profile);
    }
    return Promise.resolve(col);
  }
}
