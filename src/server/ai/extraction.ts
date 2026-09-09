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
  utilitiesCost: z.number().nullable(),
  furnishings: z.array(z.string()),
  furnished: z.boolean().nullable(),
  isLongTermApartmentRental: z.boolean(),
  isRoomInSharedApartment: z.boolean(),
  summary: z.string(),
});

export type AiExtractionResult = z.infer<typeof aiExtractionSchema>;

export const AI_SYSTEM_PROMPT = `Jesteś surowym, rzeczowym analitykiem ogłoszeń najmu mieszkań w Polsce.
Na podstawie tytułu i opisu wyodrębnij informacje i zwróć WYŁĄCZNIE obiekt JSON zgodny ze schematem.

Zasady ekstrakcji:
- Jeśli informacji NIE MA w tekście, użyj null. Nigdy nie zgaduj.
- petsAllowed: true gdy zwierzęta dozwolone, false gdy wyraźnie zabronione, null gdy brak informacji.
- hasParking: true gdy jest miejsce parkingowe/garaż, false gdy wyraźnie brak, null gdy brak informacji.
- district: nazwa dzielnicy/osiedla jeśli podana, inaczej null.
KOSZTY — najpierw przeskanuj CAŁY tekst (tytuł i opis) pod kątem KAŻDEJ kwoty pieniężnej
(cyfry ze "zł"/"PLN"/"pln" oraz kwoty słownie) i przypisz każdą do właściwej kategorii poniżej.
Nie pomijaj kwot ukrytych w środku zdania ani po przecinku (np. "3000 zł + czynsz 650 zł + media
wg zużycia ok. 250 zł"). Ta sama liczba nigdy nie trafia do dwóch kategorii.
- deposit: kaucja / kaucja zwrotna / depozyt w złotych (liczba) lub null.
- adminRent: czynsz administracyjny — tzn. opłata do spółdzielni/wspólnoty/zarządcy (synonimy:
  "czynsz administracyjny", "czynsz do spółdzielni/wspólnoty", "opłata administracyjna",
  "czynsz +", "do administracji"). UWAGA na pułapkę: samo słowo "czynsz" bez dopisku bardzo
  często oznacza CENĘ NAJMU (kwotę główną ogłoszenia) — NIE wpisuj jej tu. Do adminRent trafia
  tylko druga, dodatkowa opłata do wspólnoty/spółdzielni. null gdy brak.
- utilitiesCost: media / opłaty licznikowe (prąd, gaz, woda, ogrzewanie, śmieci, internet)
  w złotych/mies. — jeśli podana kwota dokładna LUB przybliżona (np. "media ok. 200 zł",
  "opłaty do 150 zł", "media wg liczników, średnio ~180 zł"), wpisz tę liczbę. Gdy jedna kwota
  zbiorczo obejmuje "opłaty/media" bez rozbicia, wpisz ją tutaj (adminRent zostaw null).
  Jeśli media nie są w ogóle wspomniane, użyj null (nie zgaduj i nie szacuj samodzielnie).
- furnishings: lista konkretnych elementów wyposażenia/mebli DOSŁOWNIE wymienionych w tekście
  (np. ["łóżko", "szafa", "lodówka", "pralka", "zmywarka", "biurko"]). Przepisuj tylko to, co
  faktycznie napisano — pusta tablica [], gdy nic konkretnego nie wymieniono. Nie dopisuj rzeczy
  domyślnych ani niewidocznych w tekście.
- furnished: NIE zgaduj. Ustaw true TYLKO gdy tekst wprost mówi, że mieszkanie jest umeblowane
  ("umeblowane", "w pełni wyposażone", "z pełnym umeblowaniem") LUB gdy w furnishings znalazły się
  realne MEBLE (łóżko, szafa, kanapa/sofa, stół, biurko, komoda) — nie samo AGD. Ustaw false, gdy
  tekst wprost mówi "nieumeblowane"/"bez mebli"/"do własnej aranżacji". W pozostałych przypadkach
  null. Nie wnioskuj umeblowania z obecności kuchni/łazienki (są w każdym mieszkaniu) ani ze zdjęć.
- isLongTermApartmentRental: true TYLKO gdy to długoterminowy najem CAŁEGO mieszkania.
  Ustaw false dla: wynajmu pokoju, najmu na doby/krótkoterminowego, sprzedaży, zamiany, stancji.
- isRoomInSharedApartment: true, gdy opis świadczy o tym, że wynajmowany jest POKÓJ w mieszkaniu
  współdzielonym z innymi lokatorami, a nie samodzielne mieszkanie. Sygnały (szczególnie gdy
  ogłoszenie udaje kawalerkę): "pokój w mieszkaniu", "wspólna kuchnia/łazienka", "pozostałe pokoje
  wynajęte", "do wynajęcia jeden pokój", "mieszkanie 3-pokojowe, wynajmę 1 pokój", "współlokatorzy",
  "cicha lokatorka/lokator", "miejsce w pokoju", "start dla studenta w mieszkaniu studenckim".
  Ustaw false, gdy to samodzielna kawalerka/mieszkanie na wyłączność. null nie jest dozwolone —
  przy braku jednoznacznych sygnałów współdzielenia ustaw false.

Zasady dla "summary" (kluczowe):
- Pisz jak rzeczoznawca, nie jak sprzedawca. Zero marketingu, zero ozdobników.
- BEZWZGLĘDNIE ZAKAZANE słowa i im podobne: "urocze", "przytulne", "kameralne", "wymarzone",
  "wyjątkowe", "idealne", "cudowne", "śliczne", "gustowne", "niepowtarzalne", "rewelacyjne".
  Jeśli opis źródłowy używa takich słów, ZIGNORUJ je — nie przepisuj ich do summary.
- Dokładnie 2 zdania: pierwsze zdanie = konkretna ZALETA (fakt: cena, lokalizacja, metraż,
  wyposażenie, stan), drugie zdanie = konkretna WADA lub RYZYKO (np. wysoka kaucja, brak
  parkingu, wysoki czynsz administracyjny, brak informacji o zwierzętach, niski metraż jak
  na cenę, piętro bez windy, stan do remontu).
- Jeśli w tekście naprawdę brak jednoznacznej wady, drugie zdanie ma wskazać brakującą
  informację, której nie podano (np. "Ogłoszenie nie precyzuje wysokości kaucji ani czynszu
  administracyjnego.") — nigdy nie zmyślaj wady, ale nigdy nie chwal bez zastrzeżeń.
- Same fakty liczbowe/rzeczowe, żadnych przymiotników oceniających.`;

export function buildExtractionPrompt(title: string, description: string): string {
  return `TYTUŁ: ${title}\n\nOPIS:\n${description || "(brak opisu)"}`;
}
