import type { ListingCollection } from "../collection";
import { extractAreaFromText } from "../text";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Filtr powierzchni — wykonywany PRZED krokami AI (tanie, deterministyczne).
 *
 * Krok 1: dla ofert bez `area` ze scrapera próbuje wyłuskać metraż z treści
 * (tytuł + opis) REGEX-em (`extractAreaFromText`). Uzupełniona wartość poprawia
 * też późniejszą wstępną ocenę (`PreScoreStep` używa `area` w scoringu).
 *
 * Krok 2: twarde widełki `areaMin`/`areaMax` z profilu. Zasada „brak danych nie
 * odrzuca": jeśli metraż nadal nieznany (regex też nic nie znalazł), oferta
 * przechodzi dalej — AI dostanie szansę, a użytkownik zdecyduje.
 */
export class AreaFilterStep implements PipelineStep {
  readonly name = "Filtr powierzchni";

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { profile } = ctx;

    // 1) Uzupełnij brakującą powierzchnię z treści ogłoszenia (regex).
    let filled = 0;
    for (const l of col.active()) {
      if (l.area != null) continue;
      const fromText = extractAreaFromText(`${l.title} ${l.description ?? ""}`);
      if (fromText != null) {
        l.area = fromText;
        filled++;
      }
    }
    if (filled > 0) ctx.log(`Filtr powierzchni: uzupełniono metraż z tekstu w ${filled} ofertach`);

    // 2) Twarde widełki — odrzucamy tylko przy znanej, niezgodnej powierzchni.
    if (profile.areaMin != null) {
      const min = profile.areaMin;
      col.reject(
        this.name,
        (l) => l.area == null || l.area >= min,
        (l) => `powierzchnia < ${min} (${l.area} m²)`,
      );
    }
    if (profile.areaMax != null) {
      const max = profile.areaMax;
      col.reject(
        this.name,
        (l) => l.area == null || l.area <= max,
        (l) => `powierzchnia > ${max} (${l.area} m²)`,
      );
    }

    const rejected = col
      .rejected()
      .filter((l) => l.rejected?.step === this.name).length;
    ctx.log(`Filtr powierzchni: odrzucono ${rejected} ofert poza widełkami`);
    return Promise.resolve(col);
  }
}
