import type { ListingCollection } from "../collection";
import { fetchOtodomDetails } from "../../scrapers/otodom";
import type { PipelineContext, PipelineStep } from "../types";

/**
 * Dociąga pełny opis ogłoszenia dla ofert, które przeszły filtr twardy.
 * Tylko dla ofert bez opisu (lista często zwraca krótki lub żaden opis).
 * OLX zwykle ma opis już z listy; głównie dotyczy Otodom.
 */
export class FetchDetailsStep implements PipelineStep {
  readonly name = "Pobranie opisów";

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const needDetails = col.active().filter(
      (l) => !l.description || l.description.length < 60,
    );

    let fetched = 0;
    await col.forEachActive(
      async (l) => {
        if (l.description && l.description.length >= 60) return;
        try {
          if (l.source === "OTODOM") {
            const desc = await fetchOtodomDetails(l.url);
            if (desc) {
              l.description = desc;
              fetched++;
            }
          }
          // OLX: opis zwykle obecny z listy; pomijamy dodatkowy request.
        } catch (err) {
          ctx.log(`Nie udało się pobrać opisu ${l.url}: ${String(err)}`);
        }
      },
      { concurrency: 2 },
    );

    ctx.log(`Pobrano ${fetched}/${needDetails.length} brakujących opisów`);
    return col;
  }
}
