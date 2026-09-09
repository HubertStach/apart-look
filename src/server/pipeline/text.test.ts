import { describe, it, expect } from "vitest";
import { parsePrice, parseArea, parseRooms, normalizeText, looseEquals } from "./text";

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

describe("normalizeText / looseEquals", () => {
  it("usuwa diakrytyki i wielkość liter", () => {
    expect(normalizeText("Kraków Śródmieście")).toBe("krakow srodmiescie");
    expect(looseEquals("Kraków", "krakow")).toBe(true);
    expect(looseEquals("Kraków", "Warszawa")).toBe(false);
    expect(looseEquals(null, "x")).toBe(false);
  });
});
