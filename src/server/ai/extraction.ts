import { z } from "zod";

/**
 * Pole pieniężne z AI. Model bywa halucynuje absurdalne liczby (ujemne,
 * gigantyczne, ułamkowe), które nie mieszczą się w kolumnie INT (SQLite).
 * Sanityzujemy: akceptujemy tylko całkowitą kwotę w zł w zakresie [0, 100000];
 * wszystko poza tym → null (brak danych), bez wywracania całej ekstrakcji.
 */
const MAX_MONEY = 100_000;
const moneyField = z
  .number()
  .nullable()
  .transform((v) =>
    v != null && Number.isFinite(v) && v >= 0 && v <= MAX_MONEY ? Math.round(v) : null,
  );

/**
 * Schemat ekstrakcji AI. Każde pole informacyjne może być null (model nie wie).
 * Jeden wspólny call łączy ekstrakcję danych i weryfikację typu oferty.
 */
export const aiExtractionSchema = z.object({
  petsAllowed: z.boolean().nullable(),
  hasParking: z.boolean().nullable(),
  district: z.string().nullable(),
  street: z.string().nullable(),
  price: moneyField,
  deposit: moneyField,
  adminRent: moneyField,
  utilitiesCost: moneyField,
  furnishings: z.array(z.string()),
  furnished: z.boolean().nullable(),
  isLongTermApartmentRental: z.boolean(),
  isRoomInSharedApartment: z.boolean(),
  summary: z.string(),
});

export type AiExtractionResult = z.infer<typeof aiExtractionSchema>;

export const AI_SYSTEM_PROMPT = `Jesteś rzeczowym analitykiem ogłoszeń najmu mieszkań w Polsce.
Na podstawie tytułu i opisu zwróć WYŁĄCZNIE obiekt JSON zgodny ze schematem.
Zasada nadrzędna: jeśli informacji NIE MA w tekście, użyj null (dla list — []). Nigdy nie zgaduj.

PRIORYTET 1 — CENA NAJMU (najważniejsze). Najpierw ustal price = miesięczną CENĘ NAJMU, czyli
główną kwotę, którą najemca płaci właścicielowi za samo mieszkanie. To zwykle najwyższa,
wyeksponowana kwota ("wynajmę za 3000 zł", "cena 2800 zł/mies", "najem 3200"). Pułapki:
- Samo słowo "czynsz" bez dopisku prawie zawsze oznacza CENĘ NAJMU → to jest price.
- NIE myl ceny z kaucją, kosztem mediów ani z metrażem/ceną za m². Kwota "za m²" lub liczba
  przy "m²" to NIE cena najmu.
- Jeśli podano tylko cenę za m² i metraż, nie wyliczaj — zostaw price = null.
Gdy ceny najmu nie da się jednoznacznie ustalić, price = null.

Dopiero PO ustaleniu price przypisz pozostałe kwoty (żadna liczba dwa razy, także te ukryte
w środku zdania):
- deposit: kaucja / kaucja zwrotna / depozyt (zł) lub null.
- adminRent: DODATKOWY czynsz administracyjny do spółdzielni/wspólnoty/zarządcy ("czynsz
  administracyjny", "opłata administracyjna", "czynsz +", "do administracji"). To druga,
  osobna opłata obok ceny najmu — nigdy sama główna kwota. null gdy brak.
- utilitiesCost: media / opłaty licznikowe (prąd, gaz, woda, ogrzewanie, śmieci) w zł/mies.,
  kwota dokładna lub przybliżona ("media ok. 200 zł"). Zbiorcza kwota "opłaty/media" bez
  rozbicia → tutaj (adminRent zostaw null). Media niewspomniane → null (nie szacuj).

PRIORYTET 2 — ULICA. street: ulica, przy której jest mieszkanie, jeśli podana — zwróć zapis
z przedrostkiem ORAZ numerem domu, gdy jest w tekście, np. "ul. Długa 12", "al. Jana Pawła II 40",
"os. Widok", "pl. Wolności". Numer domu ZACHOWAJ (uściśla lokalizację na mapie); nie dodawaj go,
gdy go nie ma. Jeśli ulicy nie podano, null. district: nazwa dzielnicy/osiedla jeśli podana,
inaczej null.

PRIORYTET 3 — POKÓJ vs MIESZKANIE. isRoomInSharedApartment: true, gdy wynajmowany jest POKÓJ
w mieszkaniu współdzielonym z innymi lokatorami (szczególnie gdy ogłoszenie udaje kawalerkę).
Sygnały: "pokój w mieszkaniu", "wspólna kuchnia/łazienka", "pozostałe pokoje wynajęte",
"do wynajęcia jeden pokój", "mieszkanie 3-pokojowe, wynajmę 1 pokój", "współlokatorzy",
"miejsce w pokoju", "mieszkanie studenckie". W innym razie false (null niedozwolone).
isLongTermApartmentRental: true TYLKO dla długoterminowego najmu CAŁEGO mieszkania; false dla
wynajmu pokoju, najmu na doby/krótkoterminowego, sprzedaży, zamiany, stancji.

Pozostałe pola (uzupełnij TYLKO gdy wprost w tekście, inaczej null / []):
- petsAllowed: true gdy zwierzęta dozwolone, false gdy wyraźnie zabronione, null gdy brak.
- hasParking: true gdy jest miejsce/garaż, false gdy wyraźnie brak, null gdy brak.
- furnishings: lista mebli/AGD wymienionych DOSŁOWNIE (["łóżko","szafa","lodówka","pralka"]),
  inaczej []. furnished: true przy "umeblowane"/"w pełni wyposażone" LUB gdy w furnishings są
  realne meble (łóżko, szafa, kanapa, stół, biurko) — nie samo AGD; false przy "nieumeblowane"/
  "bez mebli"; inaczej null. Nie wnioskuj z kuchni/łazienki ani ze zdjęć.

summary: dokładnie 2 rzeczowe zdania, bez marketingu (ZAKAZ słów: "urocze", "przytulne",
"kameralne", "wymarzone", "idealne", "wyjątkowe", "cudowne", "gustowne" i podobnych — jeśli są
w opisie, zignoruj je). Zdanie 1 = konkretna ZALETA (fakt: cena, lokalizacja, metraż, stan),
zdanie 2 = konkretna WADA/RYZYKO lub — gdy brak wady — brakująca w ogłoszeniu informacja.
Same fakty, zero przymiotników oceniających.`;

export function buildExtractionPrompt(title: string, description: string): string {
  return `TYTUŁ: ${title}\n\nOPIS:\n${description || "(brak opisu)"}`;
}
