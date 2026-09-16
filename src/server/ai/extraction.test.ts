import { describe, it, expect } from "vitest";
import { aiExtractionSchema } from "./extraction";

const base = {
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

  it("akceptuje petsAllowed/hasParking jako boolean lub null", () => {
    const yes = aiExtractionSchema.parse({ ...base, petsAllowed: true, hasParking: false });
    expect(yes.petsAllowed).toBe(true);
    expect(yes.hasParking).toBe(false);
    const unknown = aiExtractionSchema.parse({ ...base, petsAllowed: null, hasParking: null });
    expect(unknown.petsAllowed).toBeNull();
    expect(unknown.hasParking).toBeNull();
  });

  it("akceptuje furnished jako boolean lub null", () => {
    expect(aiExtractionSchema.parse({ ...base, furnished: true }).furnished).toBe(true);
    expect(aiExtractionSchema.parse({ ...base, furnished: false }).furnished).toBe(false);
    expect(aiExtractionSchema.parse({ ...base, furnished: null }).furnished).toBeNull();
  });
});
