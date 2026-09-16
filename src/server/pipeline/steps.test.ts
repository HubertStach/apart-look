import { describe, it, expect } from "vitest";
import { ListingCollection } from "./collection";
import { DedupeStep } from "./steps/dedupe";
import { HardFilterStep } from "./steps/hard-filter";
import { AreaFilterStep } from "./steps/area-filter";
import { PreScoreStep } from "./steps/pre-score";
import { TotalCostFilterStep } from "./steps/total-cost-filter";
import type { PipelineContext, ScrapedListing } from "./types";
import type { SearchProfile } from "../../../generated/prisma";

function ctx(profile: Partial<SearchProfile>): PipelineContext {
  return {
    profile: {
      id: "p1",
      name: "t",
      isActive: true,
      city: "Kraków",
      rooms: 2,
      priceMin: null,
      priceMax: null,
      priceWeight: 0,
      areaMin: null,
      areaMax: null,
      areaWeight: 0,
      districts: "[]",
      districtWeight: 0,
      petsRequired: false,
      petsWeight: 0,
      parkingRequired: false,
      parkingWeight: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...profile,
    },
    runId: "r1",
    db: {} as PipelineContext["db"],
    log: () => undefined,
    reportProgress: async () => undefined,
  };
}

function l(o: Partial<ScrapedListing>): ScrapedListing {
  return { source: "OLX", externalId: "x", url: "u", title: "t", ...o };
}

describe("DedupeStep", () => {
  it("usuwa duplikaty po source+externalId", async () => {
    const col = new ListingCollection([
      l({ externalId: "1" }),
      l({ externalId: "1" }),
      l({ externalId: "2" }),
    ]);
    const out = await new DedupeStep().run(col, ctx({}));
    expect(out.size).toBe(2);
  });

  it("usuwa duplikaty cross-portal po tytule+cenie+powierzchni", async () => {
    const col = new ListingCollection([
      l({ source: "OLX", externalId: "1", title: "Ładne mieszkanie", price: 3000, area: 50 }),
      l({ source: "OTODOM", externalId: "9", title: "Ładne mieszkanie", price: 3000, area: 50 }),
    ]);
    const out = await new DedupeStep().run(col, ctx({}));
    expect(out.size).toBe(1);
  });
});

describe("HardFilterStep", () => {
  it("odrzuca inne miasto, zachowuje audyt", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", city: "Kraków" }),
      l({ externalId: "2", city: "Warszawa" }),
    ]);
    const out = await new HardFilterStep().run(col, ctx({ city: "Kraków" }));
    expect(out.active()).toHaveLength(1);
    expect(out.rejected()).toHaveLength(1);
    expect(out.rejected()[0]!.rejected!.reason).toContain("miasto");
  });

  it("NIE odrzuca gdy dane brakują (null przechodzi dalej)", async () => {
    const col = new ListingCollection([l({ city: undefined, rooms: undefined, price: undefined })]);
    const out = await new HardFilterStep().run(
      col,
      ctx({ city: "Kraków", rooms: 2, priceMin: 1000, priceMax: 5000 }),
    );
    expect(out.active()).toHaveLength(1);
  });

  it("uzupełnia brakujące miasto profilowym (normalizacja lokalizacji)", async () => {
    const col = new ListingCollection([l({ externalId: "1", city: undefined })]);
    const out = await new HardFilterStep().run(col, ctx({ city: "Kraków" }));
    expect(out.active()).toHaveLength(1);
    expect(out.active()[0]!.city).toBe("Kraków");
  });

  it("odrzuca po widełkach ceny", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", price: 2500 }),
      l({ externalId: "2", price: 6000 }),
    ]);
    const out = await new HardFilterStep().run(col, ctx({ priceMax: 5000 }));
    expect(out.active()).toHaveLength(1);
    expect(out.active()[0]!.price).toBe(2500);
  });

  it("odrzuca niezgodną liczbę pokoi", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", rooms: 2 }),
      l({ externalId: "2", rooms: 3 }),
    ]);
    const out = await new HardFilterStep().run(col, ctx({ rooms: 2 }));
    expect(out.active()).toHaveLength(1);
  });
});

describe("AreaFilterStep", () => {
  it("uzupełnia metraż z treści (regex) i odrzuca poza widełkami", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", area: undefined, title: "Mieszkanie 55 m² z balkonem", description: "" }),
      l({ externalId: "2", area: undefined, title: "Kawalerka 25 m²", description: "" }),
    ]);
    const out = await new AreaFilterStep().run(col, ctx({ areaMin: 40 }));
    expect(out.active()).toHaveLength(1);
    expect(out.active()[0]!.externalId).toBe("1");
    expect(out.active()[0]!.area).toBe(55); // uzupełnione z tekstu
    expect(out.rejected()[0]!.rejected!.reason).toContain("powierzchnia < 40");
  });

  it("NIE odrzuca gdy metraż nieznany (regex nic nie znalazł)", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", area: undefined, title: "Mieszkanie w centrum", description: "3 pokoje" }),
    ]);
    const out = await new AreaFilterStep().run(col, ctx({ areaMin: 40, areaMax: 60 }));
    expect(out.active()).toHaveLength(1);
  });

  it("respektuje powierzchnię podaną przez scraper (nie nadpisuje)", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", area: 48, title: "Mieszkanie 999 m²" }),
    ]);
    const out = await new AreaFilterStep().run(col, ctx({ areaMax: 60 }));
    expect(out.active()).toHaveLength(1);
    expect(out.active()[0]!.area).toBe(48);
  });
});

describe("PreScoreStep", () => {
  it("odrzuca oferty poniżej progu wstępnej oceny", async () => {
    const col = new ListingCollection([
      l({ externalId: "1", price: 2000 }), // blisko dolnej granicy => dobry match cenowy
      l({ externalId: "2", price: 4900 }), // blisko górnej granicy => słaby match cenowy
    ]);
    const out = await new PreScoreStep(0.6).run(
      col,
      ctx({ priceMin: 2000, priceMax: 5000, priceWeight: 5 }),
    );
    expect(out.active()).toHaveLength(1);
    expect(out.active()[0]!.price).toBe(2000);
    expect(out.rejected()[0]!.rejected!.reason).toContain("wstępne dopasowanie");
  });

  it("nie odrzuca gdy brak preferencji (score=1)", async () => {
    const col = new ListingCollection([l({ externalId: "1", price: 4999 })]);
    const out = await new PreScoreStep(0.6).run(col, ctx({}));
    expect(out.active()).toHaveLength(1);
  });
});

describe("TotalCostFilterStep", () => {
  it("odrzuca gdy wynajem+czynsz+media > priceMax", async () => {
    const col = new ListingCollection([
      l({
        externalId: "1",
        price: 2500,
        ai: {
          district: null,
          street: null,
          price: null,
          deposit: null,
          adminRent: 400,
          utilitiesCost: 300,
          petsAllowed: null,
          hasParking: null,
          furnished: null,
          isLongTermApartmentRental: true,
          isRoomInSharedApartment: false,
          summary: "",
        },
      }),
    ]);
    const out = await new TotalCostFilterStep().run(col, ctx({ priceMax: 3000 }));
    expect(out.active()).toHaveLength(0);
    expect(out.rejected()[0]!.rejected!.reason).toContain("koszt całkowity 3200");
  });

  it("nie odrzuca gdy media nieznane (nie zgadujemy kosztu)", async () => {
    const col = new ListingCollection([l({ externalId: "1", price: 2900 })]);
    const out = await new TotalCostFilterStep().run(col, ctx({ priceMax: 3000 }));
    expect(out.active()).toHaveLength(1);
  });

  it("nie odrzuca gdy brak priceMax", async () => {
    const col = new ListingCollection([
      l({
        externalId: "1",
        price: 5000,
        ai: {
          district: null,
          street: null,
          price: null,
          deposit: null,
          adminRent: 1000,
          utilitiesCost: 1000,
          petsAllowed: null,
          hasParking: null,
          furnished: null,
          isLongTermApartmentRental: true,
          isRoomInSharedApartment: false,
          summary: "",
        },
      }),
    ]);
    const out = await new TotalCostFilterStep().run(col, ctx({}));
    expect(out.active()).toHaveLength(1);
  });
});
