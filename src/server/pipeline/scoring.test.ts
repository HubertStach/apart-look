import { describe, it, expect } from "vitest";
import { computeScore } from "./scoring";
import type { ScrapedListing } from "./types";
import type { SearchProfile } from "../../../generated/prisma";

function makeProfile(overrides: Partial<SearchProfile> = {}): SearchProfile {
  return {
    id: "p1",
    name: "test",
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
    ...overrides,
  };
}

function makeListing(overrides: Partial<ScrapedListing> = {}): ScrapedListing {
  return {
    source: "OLX",
    externalId: "1",
    url: "https://x",
    title: "Mieszkanie",
    ...overrides,
  };
}

describe("computeScore", () => {
  it("zwraca 1 gdy brak preferencji (suma wag = 0)", () => {
    expect(computeScore(makeListing(), makeProfile())).toBe(1);
  });

  it("cena bliżej dolnej granicy = wyższy score", () => {
    const profile = makeProfile({ priceMin: 2000, priceMax: 4000, priceWeight: 5 });
    const cheap = computeScore(makeListing({ price: 2000 }), profile);
    const mid = computeScore(makeListing({ price: 3000 }), profile);
    const expensive = computeScore(makeListing({ price: 4000 }), profile);
    expect(cheap).toBe(1);
    expect(mid).toBeCloseTo(0.5, 5);
    expect(expensive).toBe(0);
  });

  it("powierzchnia bliżej górnej granicy = wyższy score", () => {
    const profile = makeProfile({ areaMin: 30, areaMax: 70, areaWeight: 5 });
    expect(computeScore(makeListing({ area: 70 }), profile)).toBe(1);
    expect(computeScore(makeListing({ area: 50 }), profile)).toBeCloseTo(0.5, 5);
    expect(computeScore(makeListing({ area: 30 }), profile)).toBe(0);
  });

  it("dzielnica preferowana = 1, obca = 0, nieznana = 0.4", () => {
    const profile = makeProfile({ districts: '["Centrum","Podgórze"]', districtWeight: 5 });
    expect(computeScore(makeListing({ district: "Centrum" }), profile)).toBe(1);
    expect(computeScore(makeListing({ district: "Nowa Huta" }), profile)).toBe(0);
    expect(computeScore(makeListing({ district: undefined }), profile)).toBeCloseTo(0.4, 5);
  });

  it("dopasowanie dzielnicy ignoruje diakrytyki", () => {
    const profile = makeProfile({ districts: '["Podgorze"]', districtWeight: 5 });
    expect(computeScore(makeListing({ district: "Podgórze" }), profile)).toBe(1);
  });

  it("zwierzęta: dane AI mają pierwszeństwo", () => {
    const profile = makeProfile({ petsRequired: true, petsWeight: 5 });
    const listing = makeListing({
      petsAllowed: false,
      ai: {
        petsAllowed: true,
        hasParking: null,
        district: null,
        street: null,
        price: null,
        deposit: null,
        adminRent: null,
        utilitiesCost: null,
        furnishings: [],
        furnished: null,
        isLongTermApartmentRental: true,
        isRoomInSharedApartment: false,
        summary: "",
      },
    });
    expect(computeScore(listing, profile)).toBe(1);
  });

  it("średnia ważona łączy kilka preferencji", () => {
    const profile = makeProfile({
      priceMin: 2000,
      priceMax: 4000,
      priceWeight: 4, // waga 4, match 0.5 (cena 3000)
      areaMin: 30,
      areaMax: 70,
      areaWeight: 1, // waga 1, match 1.0 (area 70)
    });
    const listing = makeListing({ price: 3000, area: 70 });
    // (4*0.5 + 1*1.0) / (4+1) = 3/5 = 0.6
    expect(computeScore(listing, profile)).toBeCloseTo(0.6, 5);
  });
});
