import type { ListingCollection } from "../collection";
import type { PipelineContext, PipelineStep, ScrapedListing } from "../types";

/**
 * Krok zastępczy używany zanim gotowe są realne scrapery (Faza 2).
 * Generuje deterministyczne ogłoszenia dla miasta z profilu, aby przetestować
 * resztę pipeline'u (filtr, scoring, persist) end-to-end.
 */
export class MockScrapeStep implements PipelineStep {
  readonly name = "Scraper (mock)";

  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { profile } = ctx;
    const city = profile.city;
    const rooms = profile.rooms;

    const samples: ScrapedListing[] = [
      {
        source: "OLX",
        externalId: "mock-1",
        url: "https://www.olx.pl/oferta/mock-1",
        title: `Ładne ${rooms}-pokojowe mieszkanie, ${city} centrum`,
        description:
          "Przytulne mieszkanie w centrum. Zwierzęta akceptowane. Miejsce parkingowe w cenie. Umeblowane.",
        price: 2800,
        area: 48,
        rooms,
        city,
        district: "Centrum",
        imageUrl: "https://placehold.co/400x300",
      },
      {
        source: "OTODOM",
        externalId: "mock-2",
        url: "https://www.otodom.pl/pl/oferta/mock-2",
        title: `${rooms} pokoje, ${city} Podgórze`,
        description: "Bez zwierząt. Blisko przystanku. Kaucja 3000 zł.",
        price: 3500,
        area: 55,
        rooms,
        city,
        district: "Podgórze",
        imageUrl: "https://placehold.co/400x300",
      },
      {
        source: "OLX",
        externalId: "mock-3",
        url: "https://www.olx.pl/oferta/mock-3",
        title: `TANIO ${rooms} pok, ${city}`,
        description: "Kawalerka na doby — wynajem krótkoterminowy dla turystów.",
        price: 1500,
        area: 25,
        rooms,
        city,
        district: "Krowodrza",
      },
      {
        // inne miasto — powinno odpaść na HardFilter
        source: "OTODOM",
        externalId: "mock-4",
        url: "https://www.otodom.pl/pl/oferta/mock-4",
        title: `${rooms} pokoje, Warszawa Mokotów`,
        description: "Mieszkanie w innym mieście.",
        price: 3000,
        area: 50,
        rooms,
        city: "Warszawa",
        district: "Mokotów",
      },
      {
        // za droga — powinna odpaść jeśli priceMax ustawione
        source: "OLX",
        externalId: "mock-5",
        url: "https://www.olx.pl/oferta/mock-5",
        title: `Luksusowy apartament ${rooms} pok, ${city}`,
        description: "Wysoki standard. Parking podziemny. Zwierzęta mile widziane.",
        price: 9000,
        area: 90,
        rooms,
        city,
        district: "Stare Miasto",
      },
    ];

    col.add(...samples);
    return Promise.resolve(col);
  }
}
