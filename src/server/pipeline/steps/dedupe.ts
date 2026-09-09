import { ListingCollection } from "../collection";
import { normalizeText } from "../text";
import type { PipelineContext, PipelineStep, ScrapedListing } from "../types";

/**
 * Usuwa duplikaty:
 *  1. w ramach jednego przebiegu (ta sama oferta z listy i szczegółów),
 *  2. oferty pojawiające się w OLX i Otodom (wspólna grupa kapitałowa).
 *
 * Klucz pierwotny: source+externalId. Klucz wtórny (cross-portal):
 * znormalizowany tytuł + cena + zaokrąglona powierzchnia.
 */
export class DedupeStep implements PipelineStep {
  readonly name = "Deduplikacja";

  run(col: ListingCollection, _ctx: PipelineContext): Promise<ListingCollection> {
    const seenIds = new Set<string>();
    const seenContent = new Set<string>();
    const out: ScrapedListing[] = [];

    for (const l of col.all()) {
      const idKey = `${l.source}:${l.externalId}`;
      if (seenIds.has(idKey)) continue;

      const contentKey = [
        normalizeText(l.title).slice(0, 40),
        l.price ?? "?",
        l.area != null ? Math.round(l.area) : "?",
      ].join("|");

      if (seenContent.has(contentKey) && l.price != null && l.area != null) {
        continue;
      }

      seenIds.add(idKey);
      seenContent.add(contentKey);
      out.push(l);
    }

    return Promise.resolve(new ListingCollection(out));
  }
}
