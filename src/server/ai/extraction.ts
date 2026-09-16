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
  district: z.string().nullable(),
  street: z.string().nullable(),
  price: moneyField,
  deposit: moneyField,
  adminRent: moneyField,
  utilitiesCost: moneyField,
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
gdy go nie ma. NAZWĘ ULICY ZAWSZE ZWRÓĆ W MIANOWNIKU (forma podstawowa, jak w rejestrze ulic) —
jeśli w tekście jest odmieniona przez przypadek, sprowadź ją do mianownika:
"mieszkanie na ul. Ślicznej" → "ul. Śliczna", "przy ulicy Długiej" → "ul. Długa",
"na Marszałkowskiej" → "ul. Marszałkowska", "na alei Jana Pawła" → "al. Jana Pawła".
Nazwy pochodzące od nazwiska/imienia zostaw bez zmian w części własnej (np. "ul. Jana Kilińskiego"
pozostaje "ul. Jana Kilińskiego"). Pierwszą literę nazwy zapisz wielką. Jeśli ulicy nie podano,
null. district: nazwa dzielnicy/osiedla jeśli podana, inaczej null.

PRIORYTET 3 — POKÓJ vs MIESZKANIE. isRoomInSharedApartment: true, gdy wynajmowany jest POKÓJ
w mieszkaniu współdzielonym z innymi lokatorami (szczególnie gdy ogłoszenie udaje kawalerkę).
Sygnały: "pokój w mieszkaniu", "wspólna kuchnia/łazienka", "pozostałe pokoje wynajęte",
"do wynajęcia jeden pokój", "mieszkanie 3-pokojowe, wynajmę 1 pokój", "współlokatorzy",
"miejsce w pokoju". W innym razie false (null niedozwolone).
isLongTermApartmentRental: true TYLKO dla długoterminowego najmu CAŁEGO mieszkania; false dla
wynajmu pokoju, najmu na doby/krótkoterminowego, sprzedaży, zamiany, stancji.

PRIORYTET 4 — OPIS (summary). Stwórz zwięzłe, rzeczowe PODSUMOWANIE CECH mieszkania i jego
LOKALIZACJI po polsku — same fakty z ogłoszenia, w naturalnych zdaniach (nie lista).
TWARDY LIMIT: maksymalnie 3–4 zdania. Nie przekraczaj go — wybierz najważniejsze cechy i pomiń
mniej istotne szczegóły, zamiast pisać dłużej.
Zawrzyj przede wszystkim najważniejsze cechy oferty, o ile są w tekście: lokalizację/dzielnicę
i otoczenie, metraż / liczbę pokoi / piętro, stan i umeblowanie, warunki finansowe (cena najmu,
kaucja, czynsz administracyjny, media), a także kluczowe cechy: czy jest PARKING/garaż, czy
dozwolone są ZWIERZĘTA, oraz czy ogłoszenie pochodzi od BIURA NIERUCHOMOŚCI / pośrednika i czy
wymagana jest PROWIZJA (w jakiej wysokości, jeśli podana). Gdy oferta jest wyraźnie bezpośrednio
od właściciela lub oznaczona "bez prowizji", również to zaznacz.
Trzymaj się faktów z ogłoszenia. ZAKAZ słów marketingowych i ocen: "urocze", "przytulne",
"kameralne", "przestronne", "wymarzone", "idealne", "wyjątkowe", "cudowne", "gustowne",
"komfortowe", "słoneczne" i podobnych — jeśli są w opisie, zignoruj je i opisz same fakty.`;

export function buildExtractionPrompt(title: string, description: string): string {
  return `TYTUŁ: ${title}\n\nOPIS:\n${description || "(brak opisu)"}`;
}
