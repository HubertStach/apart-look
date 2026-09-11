import { describe, it, expect } from "vitest";
import { parsePrice, parseArea, parseRooms, normalizeText, looseEquals, extractAreaFromText, extractStreetFromText, formatLocation } from "./text";

describe("parsePrice", () => {
  it("parsuje ceny z separatorami i walutą", () => {
    expect(parsePrice("1 200 zł")).toBe(1200);
    expect(parsePrice("2500zł/mies")).toBe(2500);
    expect(parsePrice("3.500 zł")).toBe(3500);
    expect(parsePrice("1 200,50 zł")).toBe(1200);
    expect(parsePrice(2800)).toBe(2800);
    expect(parsePrice(null)).toBeUndefined();
    expect(parsePrice("")).toBeUndefined();
  });
});

describe("parseArea", () => {
  it("parsuje powierzchnię", () => {
    expect(parseArea("45,5 m²")).toBe(45.5);
    expect(parseArea("45.5")).toBe(45.5);
    expect(parseArea("50 m2")).toBe(50);
    expect(parseArea(48)).toBe(48);
    expect(parseArea(null)).toBeUndefined();
  });
});

describe("parseRooms", () => {
  it("parsuje liczbę pokoi z tekstu", () => {
    expect(parseRooms("2 pokoje")).toBe(2);
    expect(parseRooms("kawalerka")).toBe(1);
    expect(parseRooms("garsoniera do wynajęcia")).toBe(1);
    expect(parseRooms("mieszkanie trzypokojowe")).toBe(3);
    expect(parseRooms(3)).toBe(3);
    expect(parseRooms("mieszkanie")).toBeUndefined();
  });
});

describe("extractAreaFromText", () => {
  it("wyłuskuje metraż z treści ogłoszenia", () => {
    expect(extractAreaFromText("Ładne mieszkanie 45 m² w centrum")).toBe(45);
    expect(extractAreaFromText("powierzchnia 52,5m2")).toBe(52.5);
    expect(extractAreaFromText("ok. 38 mkw, 2 pokoje")).toBe(38);
    expect(extractAreaFromText("mieszkanie 60 metrow")).toBe(60);
  });

  it("ignoruje trafienia bez jednostki powierzchni i wartości absurdalne", () => {
    expect(extractAreaFromText("5 minut od centrum, cena 3000 zł")).toBeUndefined();
    expect(extractAreaFromText("mieszkanie na 3 pokoje")).toBeUndefined();
    expect(extractAreaFromText("")).toBeUndefined();
    expect(extractAreaFromText(null)).toBeUndefined();
  });

  it("bierze pierwszy sensowny metraż", () => {
    expect(extractAreaFromText("dom 120 m² na działce")).toBe(120);
  });
});

describe("extractStreetFromText", () => {
  it("wyłuskuje ulicę z różnymi przedrostkami i normalizuje zapis", () => {
    expect(extractStreetFromText("Mieszkanie przy ul. Długa 12")).toBe("ul. Długa");
    expect(extractStreetFromText("lokal na ulicy Marszałkowskiej")).toBe("ul. Marszałkowskiej");
    expect(extractStreetFromText("al. Jana Pawła II 40")).toBe("al. Jana Pawła II");
    expect(extractStreetFromText("os. Widok, blok 3")).toBe("os. Widok");
    expect(extractStreetFromText("pl. Wolności 1")).toBe("pl. Wolności");
    expect(extractStreetFromText("ul. 3 Maja")).toBe("ul. 3 Maja");
  });

  it("zwraca undefined gdy brak ulicy", () => {
    expect(extractStreetFromText("Przytulne mieszkanie w centrum")).toBeUndefined();
    expect(extractStreetFromText("")).toBeUndefined();
    expect(extractStreetFromText(null)).toBeUndefined();
  });

  it("kończy nazwę na znaku nowej linii i interpunkcji", () => {
    expect(extractStreetFromText("ul. Długa\nPrzytulne mieszkanie w centrum")).toBe("ul. Długa");
    expect(extractStreetFromText("ul. Długa, mieszkanie 2-pokojowe")).toBe("ul. Długa");
    expect(extractStreetFromText("mieszkanie przy ul. Krótka. Blisko centrum")).toBe("ul. Krótka");
    expect(extractStreetFromText("os. Widok: parking w cenie")).toBe("os. Widok");
    expect(extractStreetFromText("al. Jana Pawła II\r\nblok B")).toBe("al. Jana Pawła II");
  });
});

describe("formatLocation", () => {
  it("łączy dzielnicę i ulicę jako 'Dzielnica, ulica'", () => {
    expect(formatLocation("Śródmieście", "ul. Długa")).toBe("Śródmieście, ul. Długa");
    expect(formatLocation("Śródmieście", null)).toBe("Śródmieście");
    expect(formatLocation(null, "ul. Długa")).toBe("ul. Długa");
    expect(formatLocation(null, null)).toBeNull();
    expect(formatLocation("  ", "")).toBeNull();
  });
});

describe("normalizeText / looseEquals", () => {
  it("usuwa diakrytyki i wielkość liter", () => {
    expect(normalizeText("Kraków Śródmieście")).toBe("krakow srodmiescie");
    expect(looseEquals("Kraków", "krakow")).toBe(true);
    expect(looseEquals("Kraków", "Warszawa")).toBe(false);
    expect(looseEquals(null, "x")).toBe(false);
  });
});
