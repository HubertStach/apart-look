import { ListingCollection } from "./collection";
import type { PipelineContext, PipelineStep } from "./types";

/**
 * Orkiestracja łańcucha kroków. Dodanie nowego etapu = `.use(new Step())`.
 * Każdy krok dostaje kolekcję i zwraca (wzbogaconą/przefiltrowaną) kolekcję.
 */
export class ListingPipeline {
  private steps: PipelineStep[] = [];

  use(step: PipelineStep): this {
    this.steps.push(step);
    return this;
  }

  async execute(ctx: PipelineContext): Promise<ListingCollection> {
    let col = new ListingCollection();
    for (const step of this.steps) {
      await ctx.reportProgress(step.name);
      ctx.log(`▶ krok: ${step.name} (aktywne: ${col.active().length})`);
      col = await step.run(col, ctx);
    }
    return col;
  }
}
