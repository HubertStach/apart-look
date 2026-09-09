import { z } from "zod";

/**
 * Waga preferencji: 0..5 gwiazdek (0 = nieistotne).
 */
export const weightSchema = z.number().int().min(0).max(5);

/**
 * Schemat wejściowy formularza profilu wyszukiwania.
 * `districts` na wejściu to tablica stringów — do bazy zapisujemy jako JSON string.
 */
export const profileInputSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Podaj nazwę profilu").default("Mój profil"),

    // MUST-HAVE
    city: z.string().min(1, "Miasto jest wymagane"),
    rooms: z.number().int().min(1).max(10),

    // PREFERENCJE
    priceMin: z.number().int().nonnegative().nullish(),
    priceMax: z.number().int().nonnegative().nullish(),
    priceWeight: weightSchema.default(0),

    areaMin: z.number().int().nonnegative().nullish(),
    areaMax: z.number().int().nonnegative().nullish(),
    areaWeight: weightSchema.default(0),

    districts: z.array(z.string().min(1)).default([]),
    districtWeight: weightSchema.default(0),

    petsRequired: z.boolean().default(false),
    petsWeight: weightSchema.default(0),

    parkingRequired: z.boolean().default(false),
    parkingWeight: weightSchema.default(0),
  })
  .refine(
    (p) => p.priceMin == null || p.priceMax == null || p.priceMin <= p.priceMax,
    { message: "Cena min musi być ≤ cena max", path: ["priceMin"] },
  )
  .refine(
    (p) => p.areaMin == null || p.areaMax == null || p.areaMin <= p.areaMax,
    { message: "Powierzchnia min musi być ≤ powierzchnia max", path: ["areaMin"] },
  );

export type ProfileInput = z.infer<typeof profileInputSchema>;

/** Bezpieczne parsowanie listy dzielnic zapisanej jako JSON string w bazie. */
export function parseDistricts(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
    return [];
  } catch {
    return [];
  }
}
