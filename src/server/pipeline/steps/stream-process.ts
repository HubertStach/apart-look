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
import { fetchOtodomDetails } from "../../scrapers/otodom";
import { computeScore } from "../scoring";
import { totalMonthlyCost } from "./total-cost-filter";
import { persistListing } from "./persist";
import type { PipelineContext, PipelineStep, ScrapedListing } from "../types";

/**
 * Strumieniowy „ogon" pipeline'u. Dla KAŻDEGO ogłoszenia po kolei wykonuje pełną
 * selekcję i NATYCHMIAST zapisuje wynik do bazy, dzięki czemu mieszkania
 * pojawiają się na tablicy głównej na bieżąco (a nie hurtem na końcu przebiegu).
 *
 * Sekwencja per ogłoszenie:
 *   1. pobranie opisu (Otodom, gdy brakuje),
 *   2. analiza AI (ekstrakcja),
 *   3. weryfikacja AI (odrzuć, jeśli nie długoterminowy najem mieszkania),
 *   4. filtr kosztu całkowitego (odrzuć, jeśli wynajem+czynsz+media > priceMax),
 *   5. ocena dopasowania (score),
 *   6. filtr wyniku końcowego (odrzuć poniżej progu),
 *   7. zapis do bazy (upsert) — od razu, więc UI może odświeżyć listę.
 *
 * Ogłoszenia odrzucone we wcześniejszych krokach batch (Dedupe/HardFilter/PreScore)
 * są zapisywane na starcie (audyt „odrzucono N"), bez przechodzenia przez AI.
 *
 * concurrency 1 — model liczy sekwencyjnie; to też daje efekt „mieszkanie po
 * mieszkaniu" na tablicy. Providery AI (OpenRouter → Ollama) są dobierane PER RUN
 * przez orkiestrator (`analyzeWithFallback`, patrz `ai/provider.ts`) — dopiero błąd
 * w trakcie przebiegu przełącza resztę ofert na kolejny provider.
 */
export class StreamProcessStep implements PipelineStep {
  readonly name = "Selekcja i zapis (na bieżąco)";

  constructor(private readonly scoreThreshold = 0.6) {}

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { db, profile } = ctx;

    // 1) Zapisz od razu ogłoszenia odrzucone wcześniej (poza AI) — audyt odrzuceń.
    for (const l of col.all()) {
      if (l.rejected) await persistListing(db, profile.id, l, profile.city);
    }

    resetAiHealth();
    const aiAvailable = await isAiAvailable();
    if (!aiAvailable) {
      ctx.log("⚠ AI niedostępne (OpenRouter i Ollama) — selekcja bez wzbogacenia AI.");
    }

    const active = col.active();
    let processed = 0;
    let saved = col.rejected().length; // już zapisane odrzucone

    for (const l of active) {
      await this.fetchDetails(l, ctx);

      if (aiAvailable) {
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
        }
      } else {
        l.ai = null;
      }

      this.select(l, ctx);
      l.score = computeScore(l, profile);
      if (!l.rejected && l.score < this.scoreThreshold) {
        l.rejected = {
          step: "Filtr wyniku końcowego",
          reason: `końcowe dopasowanie ${Math.round(l.score * 100)}% < ${Math.round(this.scoreThreshold * 100)}%`,
        };
      }

      await persistListing(db, profile.id, l, profile.city);
      saved++;
      processed++;
      // Raport postępu po każdym ogłoszeniu → UI odświeża listę na bieżąco.
      await ctx.reportProgress(this.name, {
        aiChecked: processed,
        saved,
        passed: col.active().length,
        rejected: col.rejected().length,
      });
    }

    ctx.log(`Selekcja strumieniowa: przetworzono ${processed} ofert, zapisano ${saved}.`);
    return col;
  }

  /** Krok 1: dociągnięcie opisu (głównie Otodom), jeśli za krótki. */
  private async fetchDetails(l: ScrapedListing, ctx: PipelineContext): Promise<void> {
    if (l.description && l.description.length >= 60) return;
    if (l.source !== "OTODOM") return;
    try {
      const desc = await fetchOtodomDetails(l.url);
      if (desc) l.description = desc;
    } catch (err) {
      ctx.log(`Nie udało się pobrać opisu ${l.url}: ${String(err)}`);
    }
  }

  /** Kroki 3-4: weryfikacja typu oferty + filtr kosztu całkowitego. */
  private select(l: ScrapedListing, ctx: PipelineContext): void {
    if (l.ai != null && l.ai.isLongTermApartmentRental !== true) {
      l.rejected = {
        step: "Weryfikacja AI",
        reason: "AI: nie jest długoterminowym najmem mieszkania",
      };
      return;
    }

    // Wynajem pokoju w mieszkaniu współdzielonym (często udaje kawalerkę).
    if (l.ai?.isRoomInSharedApartment === true) {
      l.rejected = {
        step: "Weryfikacja AI",
        reason: "AI: pokój w mieszkaniu współdzielonym (nie samodzielne mieszkanie)",
      };
      return;
    }

    const max = ctx.profile.priceMax;
    if (max != null && l.price != null && totalMonthlyCost(l) > max) {
      l.rejected = {
        step: "Filtr kosztu całkowitego",
        reason: `koszt całkowity ${totalMonthlyCost(l)} zł (wynajem+czynsz+media) > ${max} zł`,
      };
    }
  }
}
