import type { ListingCollection } from "../collection";
import { ollamaJson, isOllamaAvailable, resetOllamaHealth } from "../../ai/ollama";
import {
  AI_SYSTEM_PROMPT,
  aiExtractionSchema,
  buildExtractionPrompt,
} from "../../ai/extraction";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Wzbogaca aktywne ogłoszenia o dane wyekstrahowane przez lokalny model (Ollama).
 * Degradacja: gdy Ollama niedostępna → ustawia ai=null i pipeline działa dalej
 * (scoring traktuje brakujące pola jako "nieznane").
 */
export class AiExtractStep implements PipelineStep {
  readonly name = "Analiza AI";

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    resetOllamaHealth();
    const available = await isOllamaAvailable();
    if (!available) {
      ctx.log("⚠ Ollama niedostępna — pomijam analizę AI (oferty przejdą bez wzbogacenia).");
      for (const l of col.active()) l.ai = null;
      return col;
    }

    let done = 0;
    const total = col.active().length;

    // concurrency 1 — lokalny model, jeden request na raz
    await col.forEachActive(
      async (l) => {
        try {
          const result = await ollamaJson({
            system: AI_SYSTEM_PROMPT,
            prompt: buildExtractionPrompt(l.title, l.description ?? ""),
            schema: aiExtractionSchema,
          });
          l.ai = result;
        } catch (err) {
          ctx.log(`AI błąd dla ${l.url}: ${String(err)}`);
          l.ai = null;
        } finally {
          done++;
          await ctx.reportProgress(this.name, { aiChecked: done });
        }
      },
      { concurrency: 1 },
    );

    ctx.log(`AI: przeanalizowano ${done}/${total} ofert`);
    return col;
  }
}
