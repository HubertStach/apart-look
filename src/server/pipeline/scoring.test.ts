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

  it("dzielnica preferowana = 1, obca = 0, nieznana = neutralna (pomijana)", () => {
    const profile = makeProfile({ districts: '["Centrum","Podgórze"]', districtWeight: 5 });
    expect(computeScore(makeListing({ district: "Centrum" }), profile)).toBe(1);
    expect(computeScore(makeListing({ district: "Nowa Huta" }), profile)).toBe(0);
    // nieznana dzielnica → jedyny czynnik z wagą jest pomijany → suma wag 0 → 1
    expect(computeScore(makeListing({ district: undefined }), profile)).toBe(1);
  });

  it("dopasowanie dzielnicy ignoruje diakrytyki", () => {
    const profile = makeProfile({ districts: '["Podgorze"]', districtWeight: 5 });
    expect(computeScore(makeListing({ district: "Podgórze" }), profile)).toBe(1);
  });

  it("cena: przy samym priceMax budżet=mocny match, taniej=wyższy, poza budżetem=0", () => {
    const profile = makeProfile({ priceMax: 4000, priceWeight: 5 });
    const cheap = computeScore(makeListing({ price: 1000 }), profile);
    const mid = computeScore(makeListing({ price: 2000 }), profile);
    const nearMax = computeScore(makeListing({ price: 3800 }), profile);
    expect(cheap).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(nearMax);
    // spełniony budżet nie spada poniżej progu bazowego 0.7 (realne oferty przechodzą pre-score)
    expect(nearMax).toBeGreaterThanOrEqual(0.7);
    expect(mid).toBeCloseTo(0.7 + 0.3 * ((4000 - 2000) / 4000), 5); // 0.85
    expect(computeScore(makeListing({ price: 5000 }), profile)).toBe(0); // poza budżetem
  });

  it("powierzchnia: przy samym areaMin metraż=mocny match, więcej=wyższy, poniżej=0", () => {
    const profile = makeProfile({ areaMin: 40, areaWeight: 5 });
    const small = computeScore(makeListing({ area: 45 }), profile);
    const big = computeScore(makeListing({ area: 75 }), profile);
    expect(big).toBeGreaterThan(small);
    expect(small).toBeGreaterThanOrEqual(0.7); // spełniony metraż nie leci poniżej progu bazowego
    expect(computeScore(makeListing({ area: 60 }), profile)).toBeCloseTo(0.7 + 0.3 * ((60 - 40) / 40), 5); // 0.85
    expect(computeScore(makeListing({ area: 80 }), profile)).toBe(1); // ≥ 2×min → nasycenie
    expect(computeScore(makeListing({ area: 30 }), profile)).toBe(0); // poniżej min
  });

  it("realny profil (sam priceMax + areaMin) NIE odrzuca ofert w budżecie", () => {
    // Regresja: kawalerka 2400 zł / 25 m² przy budżecie 2500, areaMin 20 musi
    // przekroczyć próg pre-score 0.6 (wcześniej skalowanie od zera dawało ~0.04).
    const profile = makeProfile({
      priceMax: 2500, priceWeight: 5, areaMin: 20, areaWeight: 3,
    });
    expect(computeScore(makeListing({ price: 2400, area: 25 }), profile)).toBeGreaterThan(0.6);
    expect(computeScore(makeListing({ price: 2500, area: 20 }), profile)).toBeGreaterThan(0.6);
  });

  it("zwierzęta: dane scrapera działają, gdy AI ich nie wyłuskała", () => {
    const profile = makeProfile({ petsRequired: true, petsWeight: 5 });
    const listing = makeListing({
      petsAllowed: true,
      ai: {
        district: null,
        street: null,
        price: null,
        deposit: null,
        adminRent: null,
        utilitiesCost: null,
        petsAllowed: null,
        hasParking: null,
        furnished: null,
        isLongTermApartmentRental: true,
        isRoomInSharedApartment: false,
        summary: "",
      },
    });
    expect(computeScore(listing, profile)).toBe(1);
  });

  it("zwierzęta/parking: dane AI mają pierwszeństwo nad scraperem", () => {
    const petsProfile = makeProfile({ petsRequired: true, petsWeight: 5 });
    const ai = {
      district: null,
      street: null,
      price: null,
      deposit: null,
      adminRent: null,
      utilitiesCost: null,
      petsAllowed: false, // AI: bez zwierząt
      hasParking: true,
      furnished: null,
      isLongTermApartmentRental: true,
      isRoomInSharedApartment: false,
      summary: "",
    };
    // scraper twierdził petsAllowed=true, ale AI (false) wygrywa → 0
    expect(computeScore(makeListing({ petsAllowed: true, ai }), petsProfile)).toBe(0);

    const parkingProfile = makeProfile({ parkingRequired: true, parkingWeight: 5 });
    expect(computeScore(makeListing({ ai }), parkingProfile)).toBe(1); // AI: parking jest
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
