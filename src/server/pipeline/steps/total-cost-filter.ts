import type { ListingCollection } from "../collection";
import type { PipelineContext, PipelineStep, ScrapedListing } from "../types";

/**
 * Odrzuca oferty, których RZECZYWISTY całkowity koszt miesięczny
 * (wynajem + czynsz administracyjny + media) przekracza `priceMax` profilu.
 *
 * Musi iść PO `AiExtractStep` (potrzebuje `l.ai?.adminRent` / `l.ai?.utilitiesCost`
 * wyłuskanych z opisu) i PRZED `PersistStep`.
 *
 * Zasada „brak danych nie odrzuca": jeśli media nie są wspomniane w ogłoszeniu
 * (utilitiesCost == null), NIE zgadujemy ich kosztu — liczymy tylko znane składniki.
 * Dzięki temu oferta z nieznanym kosztem mediów nie jest niesłusznie odrzucana.
 */
export class TotalCostFilterStep implements PipelineStep {
  readonly name = "Filtr kosztu całkowitego";

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { profile } = ctx;
    if (profile.priceMax == null) return Promise.resolve(col);
    const max = profile.priceMax;

    col.reject(
      this.name,
      (l) => l.price == null || totalMonthlyCost(l) <= max,
      (l) => `koszt całkowity ${totalMonthlyCost(l)} zł (wynajem+czynsz+media) > ${max} zł`,
    );

    const rejected = col
      .rejected()
      .filter((l) => l.rejected?.step === this.name).length;
    ctx.log(`Filtr kosztu całkowitego: odrzucono ${rejected} ofert`);
    return Promise.resolve(col);
  }
}

/** Suma znanych składników kosztu miesięcznego: wynajem + czynsz administracyjny + media. */
export function totalMonthlyCost(l: ScrapedListing): number {
  const price = l.price ?? 0;
  const adminRent = l.ai?.adminRent ?? l.rentExtra ?? 0;
  const utilities = l.ai?.utilitiesCost ?? 0;
  return price + adminRent + utilities;
}
