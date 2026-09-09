import { z } from "zod";

/**
 * Schemat ekstrakcji AI. Każde pole informacyjne może być null (model nie wie).
 * Jeden wspólny call łączy ekstrakcję danych i weryfikację typu oferty.
 */
export const aiExtractionSchema = z.object({
  petsAllowed: z.boolean().nullable(),
  hasParking: z.boolean().nullable(),
  district: z.string().nullable(),
  deposit: z.number().nullable(),
  adminRent: z.number().nullable(),
  furnished: z.boolean().nullable(),
  isLongTermApartmentRental: z.boolean(),
  summary: z.string(),
});

export type AiExtractionResult = z.infer<typeof aiExtractionSchema>;

export const AI_SYSTEM_PROMPT = `Jesteś asystentem analizującym ogłoszenia najmu mieszkań w Polsce.
Na podstawie tytułu i opisu wyodrębnij informacje i zwróć WYŁĄCZNIE obiekt JSON zgodny ze schematem.
Zasady:
- Jeśli informacji NIE MA w tekście, użyj null. Nigdy nie zgaduj.
- petsAllowed: true gdy zwierzęta dozwolone, false gdy wyraźnie zabronione, null gdy brak informacji.
- hasParking: true gdy jest miejsce parkingowe/garaż, false gdy wyraźnie brak, null gdy brak informacji.
- district: nazwa dzielnicy/osiedla jeśli podana, inaczej null.
- deposit: kwota kaucji w złotych (liczba) lub null.
- adminRent: czynsz administracyjny/do wspólnoty w złotych (liczba) lub null.
- furnished: true gdy umeblowane, false gdy nieumeblowane, null gdy brak informacji.
- isLongTermApartmentRental: true TYLKO gdy to długoterminowy najem CAŁEGO mieszkania.
  Ustaw false dla: wynajmu pokoju, najmu na doby/krótkoterminowego, sprzedaży, zamiany, stancji.
- summary: 2-3 zdania po polsku streszczające ofertę.`;

export function buildExtractionPrompt(title: string, description: string): string {
  return `TYTUŁ: ${title}\n\nOPIS:\n${description || "(brak opisu)"}`;
}
