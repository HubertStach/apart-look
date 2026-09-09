import type { ListingCollection } from "../collection";
import { searchOlx } from "../../scrapers/olx";
import { ScraperError } from "../../scrapers/polite-fetch";
import { env } from "~/env";
import type { PipelineContext, PipelineStep } from "../types";

export class ScrapeOlxStep implements PipelineStep {
  readonly name = "Scraper OLX";

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { profile } = ctx;
    try {
      const listings = await searchOlx({
        city: profile.city,
        rooms: profile.rooms,
        priceMin: profile.priceMin,
        priceMax: profile.priceMax,
        areaMin: profile.areaMin,
        areaMax: profile.areaMax,
        maxPages: env.SCRAPE_MAX_PAGES,
      });
      col.add(...listings);
      ctx.log(`OLX: pobrano ${listings.length} ofert`);
      await ctx.reportProgress(this.name, { scraped: col.size });
    } catch (err) {
      // Nie przerywamy całego przebiegu — Otodom może się udać.
      const msg = err instanceof ScraperError ? err.message : String(err);
      ctx.log(`OLX BŁĄD (kontynuuję): ${msg}`);
    }
    return col;
  }
}
