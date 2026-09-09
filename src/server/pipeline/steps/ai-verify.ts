import type { ListingCollection } from "../collection";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Weryfikacja na podstawie wyniku AI: odrzuca oferty, które NIE są
 * długoterminowym najmem całego mieszkania (pokój, doby, sprzedaż, zamiana).
 *
 * Ostrożność: odrzucamy tylko gdy AI jednoznacznie stwierdziła false.
 * Brak danych AI (null) => przepuszczamy (nie karzemy za brak modelu).
 */
export class AiVerifyStep implements PipelineStep {
  readonly name = "Weryfikacja AI";

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    col.reject(
      this.name,
      (l) => l.ai == null || l.ai.isLongTermApartmentRental === true,
      () => "AI: nie jest długoterminowym najmem mieszkania",
    );

    const rejected = col
      .rejected()
      .filter((l) => l.rejected?.step === this.name).length;
    ctx.log(`Weryfikacja AI: odrzucono ${rejected} ofert`);
    return Promise.resolve(col);
  }
}
