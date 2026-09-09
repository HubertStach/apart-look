import type { ListingCollection } from "../collection";
import { looseEquals } from "../text";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Twarde filtry z profilu: miasto, liczba pokoi, widełki ceny i powierzchni.
 *
 * Zasada: BRAKUJĄCA wartość (undefined) NIE odrzuca oferty — przechodzi dalej,
 * bo AI może wyłuskać dane z opisu. Odrzucamy tylko przy jednoznacznej
 * niezgodności z twardym wymaganiem.
 */
export class HardFilterStep implements PipelineStep {
  readonly name = "Filtr twardy";

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { profile } = ctx;

    // miasto — jeśli scraper podał, musi się zgadzać
    col.reject(
      this.name,
      (l) => l.city == null || looseEquals(l.city, profile.city),
      (l) => `miasto (${l.city ?? "?"} ≠ ${profile.city})`,
    );

    // liczba pokoi — jeśli scraper podał, musi się zgadzać dokładnie
    col.reject(
      this.name,
      (l) => l.rooms == null || l.rooms === profile.rooms,
      (l) => `pokoje (${l.rooms ?? "?"} ≠ ${profile.rooms})`,
    );

    // cena — twarde widełki, jeśli oferta ma cenę
    if (profile.priceMin != null) {
      const min = profile.priceMin;
      col.reject(
        this.name,
        (l) => l.price == null || l.price >= min,
        (l) => `cena < ${min} (${l.price} zł)`,
      );
    }
    if (profile.priceMax != null) {
      const max = profile.priceMax;
      col.reject(
        this.name,
        (l) => l.price == null || l.price <= max,
        (l) => `cena > ${max} (${l.price} zł)`,
      );
    }

    // powierzchnia — twarde widełki, jeśli oferta ma powierzchnię
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

    return Promise.resolve(col);
  }
}
