import type { ListingCollection } from "../collection";
import { searchOtodom } from "../../scrapers/otodom";
import { ScraperError } from "../../scrapers/polite-fetch";
import { env } from "~/env";
import type { PipelineContext, PipelineStep } from "../types";

export class ScrapeOtodomStep implements PipelineStep {
  readonly name = "Scraper Otodom";

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { profile } = ctx;
    try {
      const listings = await searchOtodom({
        city: profile.city,
        rooms: profile.rooms,
        priceMin: profile.priceMin,
        priceMax: profile.priceMax,
        areaMin: profile.areaMin,
        areaMax: profile.areaMax,
        maxPages: env.SCRAPE_MAX_PAGES,
      });
      col.add(...listings);
      ctx.log(`Otodom: pobrano ${listings.length} ofert`);
      await ctx.reportProgress(this.name, { scraped: col.size });
    } catch (err) {
      const msg = err instanceof ScraperError ? err.message : String(err);
      ctx.log(`Otodom BŁĄD (kontynuuję): ${msg}`);
    }
    return col;
  }
}
