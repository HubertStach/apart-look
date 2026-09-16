import type { ListingCollection } from "../collection";
import { looseEquals } from "../text";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Twarde filtry z profilu: miasto, liczba pokoi, widełki ceny.
 * Powierzchnia jest filtrowana wcześniej w `AreaFilterStep` (z regexowym
 * uzupełnieniem metrażu z treści) — jeszcze przed krokami AI.
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

    // Normalizacja: oferty bez nazwy miasta przyjmują miasto z profilu.
    // URL wyszukiwania (OLX city_id / Otodom slug) był już zawężony do tego
    // miasta, więc brak nazwy = to samo miasto — nie inne. Dzięki temu karta
    // i mapka zawsze wskazują konkretne, jedno miasto (PLAN pkt 1).
    for (const l of col.active()) {
      l.city ??= profile.city;
    }

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

    // Powierzchnia jest filtrowana osobno w AreaFilterStep (z uzupełnieniem
    // metrażu z treści przez regex) — PRZED krokami AI.

    return Promise.resolve(col);
  }
}
