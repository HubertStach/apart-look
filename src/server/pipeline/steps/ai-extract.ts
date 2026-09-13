import type { ListingCollection } from "../collection";
import {
  analyzeWithFallback,
  isAiAvailable,
  resetAiHealth,
} from "../../ai/provider";
import {
  AI_SYSTEM_PROMPT,
  aiExtractionSchema,
  buildExtractionPrompt,
} from "../../ai/extraction";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Wzbogaca aktywne ogłoszenia o dane wyekstrahowane przez AI (OpenRouter jako
 * primary dla całego przebiegu; przy błędzie w trakcie przebiegu — fallback,
 * "sticky", na lokalną Ollamę dla reszty ofert — patrz `ai/provider.ts`).
 * Degradacja: gdy żaden provider niedostępny → ustawia ai=null i pipeline działa
 * dalej (scoring traktuje brakujące pola jako "nieznane").
 */
export class AiExtractStep implements PipelineStep {
  readonly name = "Analiza AI";

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    resetAiHealth();
    const available = await isAiAvailable();
    if (!available) {
      ctx.log("⚠ AI niedostępne (OpenRouter i Ollama) — pomijam analizę AI (oferty przejdą bez wzbogacenia).");
      for (const l of col.active()) l.ai = null;
      return col;
    }

    let done = 0;
    const total = col.active().length;

    // concurrency 1 — lokalny model liczy jeden request na raz (bezpieczne też dla OpenRouter).
    await col.forEachActive(
      async (l) => {
        try {
          l.ai = await analyzeWithFallback(
            {
              system: AI_SYSTEM_PROMPT,
              prompt: buildExtractionPrompt(l.title, l.description ?? ""),
              schema: aiExtractionSchema,
            },
            (provider, err) =>
              ctx.log(`AI: ${provider} zawiódł (${String(err)}) — próba fallbacku.`),
          );
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
