import type { ScrapedListing } from "./types";

/**
 * Kolekcja ogłoszeń, na której pipeline wykonuje łańcuch operacji.
 *
 * Kluczowa decyzja projektowa: odrzucone ogłoszenia NIE znikają z kolekcji —
 * dostają `rejected = { step, reason }`. Dzięki temu na końcu możemy pokazać
 * pełny audyt ("odrzucono 37: 20 cena, 12 miasto, 5 AI").
 */
export class ListingCollection {
  private items: ScrapedListing[];

  constructor(items: ScrapedListing[] = []) {
    this.items = items;
  }

  get size(): number {
    return this.items.length;
  }

  /** Wszystkie ogłoszenia (również odrzucone). */
  all(): ScrapedListing[] {
    return [...this.items];
  }

  /** Tylko aktywne (nieodrzucone) ogłoszenia. */
  active(): ScrapedListing[] {
    return this.items.filter((l) => !l.rejected);
  }

  /** Odrzucone ogłoszenia. */
  rejected(): ScrapedListing[] {
    return this.items.filter((l) => l.rejected);
  }

  add(...listings: ScrapedListing[]): this {
    this.items.push(...listings);
    return this;
  }

  /** Zastępuje całą zawartość (używane np. po dedupe). */
  replace(listings: ScrapedListing[]): this {
    this.items = listings;
    return this;
  }

  /**
   * Oznacza jako odrzucone te aktywne ogłoszenia, dla których `predicate` zwróci
   * `false`. `reason` buduje powód odrzucenia dla konkretnego ogłoszenia.
   */
  reject(
    step: string,
    keep: (l: ScrapedListing) => boolean,
    reason: (l: ScrapedListing) => string,
  ): this {
    for (const l of this.items) {
      if (l.rejected) continue;
      if (!keep(l)) {
        l.rejected = { step, reason: reason(l) };
      }
    }
    return this;
  }

  /**
   * Asynchroniczne przetwarzanie aktywnych ogłoszeń z ograniczoną równoległością.
   * Używane w krokach fetch/AI (grzeczne tempo, lokalny model).
   */
  async forEachActive(
    fn: (l: ScrapedListing, index: number) => Promise<void>,
    opts: { concurrency?: number } = {},
  ): Promise<void> {
    const concurrency = Math.max(1, opts.concurrency ?? 4);
    const active = this.active();
    let cursor = 0;

    const worker = async () => {
      while (cursor < active.length) {
        const index = cursor++;
        const item = active[index];
        if (item) await fn(item, index);
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(concurrency, active.length) }, worker),
    );
  }
}
