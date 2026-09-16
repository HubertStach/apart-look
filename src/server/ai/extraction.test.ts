import { describe, it, expect } from "vitest";
import { aiExtractionSchema } from "./extraction";

const base = {
  district: null,
  street: null,
  price: null,
  deposit: null,
  adminRent: null,
  utilitiesCost: null,
  isLongTermApartmentRental: true,
  isRoomInSharedApartment: false,
  summary: "",
};

describe("aiExtractionSchema — sanityzacja kwot", () => {
  it("odrzuca absurdalne kwoty (ujemne / gigantyczne) do null", () => {
    const out = aiExtractionSchema.parse({
      ...base,
      adminRent: -1_000_000_000_000_000,
      deposit: 999_999_999,
      utilitiesCost: -5,
    });
    expect(out.adminRent).toBeNull();
    expect(out.deposit).toBeNull();
    expect(out.utilitiesCost).toBeNull();
  });

  it("zaokrągla i zachowuje kwoty w rozsądnym zakresie", () => {
    const out = aiExtractionSchema.parse({
      ...base,
      adminRent: 650.4,
      deposit: 3000,
      utilitiesCost: 0,
    });
    expect(out.adminRent).toBe(650);
    expect(out.deposit).toBe(3000);
    expect(out.utilitiesCost).toBe(0);
  });
});
