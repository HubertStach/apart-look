/** Normalizacja tekstu: usuwa diakrytyki, małe litery, zbędne spacje. */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Porównanie nazw miast/dzielnic bez uwzględniania diakrytyków i wielkości liter. */
export function looseEquals(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return normalizeText(a) === normalizeText(b);
}

/**
 * Parsuje cenę z tekstu typu "1 200 zł", "1.200,50 zł", "2500zł/mies".
 * Zwraca liczbę całkowitą (złote) lub undefined.
 */
export function parsePrice(input: string | number | null | undefined): number | undefined {
  if (input == null) return undefined;
  if (typeof input === "number") return Number.isFinite(input) ? Math.round(input) : undefined;
  // usuń wszystko poza cyframi, kropką, przecinkiem
  const cleaned = input.replace(/[^\d.,]/g, "").replace(/\s/g, "");
  if (!cleaned) return undefined;
  // usuń separatory tysięcy — bierzemy tylko część całkowitą
  const intPart = cleaned.replace(/[.,]\d{1,2}$/, "").replace(/[.,]/g, "");
  const n = Number.parseInt(intPart, 10);
  return Number.isFinite(n) ? n : undefined;
}

/** Parsuje powierzchnię z tekstu typu "45,5 m²", "45.5", "45 m2". */
export function parseArea(input: string | number | null | undefined): number | undefined {
  if (input == null) return undefined;
  if (typeof input === "number") return Number.isFinite(input) ? input : undefined;
  const match = /(\d+(?:[.,]\d+)?)/.exec(input.replace(/\s/g, ""));
  if (!match) return undefined;
  const n = Number.parseFloat(match[1]!.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

/** Parsuje liczbę pokoi. Obsługuje "kawalerka" => 1, "2 pokoje", "trzypokojowe". */
export function parseRooms(input: string | number | null | undefined): number | undefined {
  if (input == null) return undefined;
  if (typeof input === "number") return Number.isFinite(input) ? Math.round(input) : undefined;
  const norm = normalizeText(input);
  if (norm.includes("kawalerka") || norm.includes("garsoniera")) return 1;
  const wordMap: Record<string, number> = {
    jedno: 1,
    dwu: 2,
    trzy: 3,
    cztero: 4,
    piecio: 5,
  };
  for (const [word, n] of Object.entries(wordMap)) {
    if (norm.includes(word + "pokojow")) return n;
  }
  const match = /(\d+)/.exec(norm);
  if (match) {
    const n = Number.parseInt(match[1]!, 10);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

/**
 * Wyszukuje powierzchnię mieszkania w treści (tytuł + opis) za pomocą REGEX.
 * Dopasowuje liczbę bezpośrednio poprzedzającą jednostkę m² / m2 / mkw / metrów,
 * np. "45 m²", "45,5m2", "ok. 38 mkw", "powierzchnia 52 metry".
 * Zwraca pierwszy sensowny metraż (8–400 m²) lub undefined.
 */
export function extractAreaFromText(input: string | null | undefined): number | undefined {
  if (!input) return undefined;
  const norm = normalizeText(input);
  const re = /(\d{1,3}(?:[.,]\d{1,2})?)\s*(?:m2|m²|mkw|metr(?:ow|y|a)?)(?![a-ząćęłńóśźż0-9])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(norm)) !== null) {
    const n = Number.parseFloat(m[1]!.replace(",", "."));
    if (Number.isFinite(n) && n >= 8 && n <= 400) return n;
  }
  return undefined;
}

/**
 * Skróty tytularne, które w nazwie ulicy POPRZEDZAJĄ właściwą nazwę i mają kropkę,
 * np. "ul. św. Filipa", "al. gen. Andersa", "ul. ks. Popiełuszki". Bez tej listy
 * regex urywał nazwę na kropce skrótu (klasa znaków nazwy wyklucza `.`), gubiąc
 * resztę ("ul. św. Filipa" → "ul. św"). Lista zamknięta (nie dowolny wyraz+kropka),
 * żeby kropka KOŃCZĄCA ZDANIE po zwykłej nazwie ("ul. Krótka. Blisko") nadal
 * kończyła nazwę. Dopuszczamy wariant z wielką literą pierwszej litery.
 */
const STREET_ABBRS = [
  "św", "ks", "bł", "gen", "płk", "ppłk", "mjr", "kpt", "por", "ppor",
  "kmdr", "marsz", "abp", "bp", "kard", "prof", "dr", "inż", "hr", "im", "o",
];
const abbrAlt = STREET_ABBRS.map((a) => `[${a[0]}${a[0]!.toUpperCase()}]${a.slice(1)}`).join("|");
const ABBR = `(?:${abbrAlt})\\.`;
const NAME_WORD = `[A-ZŻŹĆĄŚĘŁÓŃ0-9][^\\s,.;:!?/()<>"']*`;
const STREET_PREFIX = `\\b(ul|ulica|ulicy|al|aleja|aleje|alei|os|osiedle|osiedla|pl|plac)\\b\\.?`;
// Nazwa = opcjonalne skróty tytularne (św./ks./gen.) + wyraz właściwy + do 5
// kolejnych tokenów (wyraz / liczba rzymska / kolejny skrót / numer domu).
const STREET_RE = new RegExp(
  `${STREET_PREFIX}[ \\t]+((?:${ABBR}[ \\t]+)*${NAME_WORD}(?:[ \\t]+(?:${NAME_WORD}|[IVX]+|${ABBR})){0,5})`,
);

/**
 * Wyszukuje ulicę/aleję/osiedle/plac w treści (tytuł + opis) za pomocą REGEX.
 * Działa na ORYGINALNYM tekście (zachowuje wielkość liter nazwy). Dopasowuje
 * przedrostek ("ul.", "ulica", "al.", "aleja", "os.", "osiedle", "pl.", "plac")
 * i kolejne wyrazy nazwy (wielka litera / cyfra / liczba rzymska), w tym SKRÓTY
 * TYTULARNE z kropką ("ul. św. Filipa 5", "al. gen. Andersa 12"), wraz z
 * ewentualnym numerem domu, np. "ul. Długa 12", "al. Jana Pawła II 40".
 *
 * Kropka skrótu (św./ks./gen. — lista `STREET_ABBRS`) NIE kończy nazwy; kropka po
 * zwykłym wyrazie ("ul. Krótka. Blisko") — kończy. Nazwę kończą też: nowa linia,
 * interpunkcja i znaki `, ; : ! ? / ( ) < > " '` (markup HTML). Łącznik między
 * wyrazami to tylko spacja/tabulator, więc newline nie zlewa nazwy z następną linią.
 * Zwraca zapis z krótkim przedrostkiem i — gdy podany — numerem domu, inaczej
 * undefined. Numer domu ZACHOWUJEMY (uściśla geokodowanie strukturalne w geo.ts).
 */
export function extractStreetFromText(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  const m = STREET_RE.exec(input);
  if (!m) return undefined;

  const prefixMap: Record<string, string> = {
    ul: "ul.",
    ulica: "ul.",
    ulicy: "ul.",
    al: "al.",
    aleja: "al.",
    aleje: "al.",
    alei: "al.",
    os: "os.",
    osiedle: "os.",
    osiedla: "os.",
    pl: "pl.",
    plac: "pl.",
  };
  const prefix = prefixMap[m[1]!.toLowerCase()] ?? "ul.";
  // Zachowujemy końcowy numer domu — nie ucinamy go już (regex łapie go jako
  // ostatni token nazwy). Zdejmujemy tylko końcową interpunkcję/markup.
  const name = m[2]!.replace(/[.,;:!?/)<>"']+$/, "").trim();
  if (!name) return undefined;
  return `${prefix} ${name}`;
}

/**
 * Końcówki żeńskich nazw przymiotnikowych w formie odmienionej (dopełniacz/
 * miejscownik "-ej") → mianownik. Kolejność od NAJBARDZIEJ szczegółowej, bo
 * regexy są sprawdzane po kolei (skiej przed kiej przed ej).
 */
const NOMINATIVE_SUFFIXES: [RegExp, string][] = [
  [/skiej$/, "ska"],
  [/ckiej$/, "cka"],
  [/dzkiej$/, "dzka"],
  [/giej$/, "ga"],
  [/kiej$/, "ka"],
  [/owej$/, "owa"],
  [/nej$/, "na"],
  [/łej$/, "ła"],
  [/rej$/, "ra"],
  [/wej$/, "wa"],
  [/iej$/, "ia"],
  [/ej$/, "a"],
];

/**
 * Sprowadza odmienioną nazwę ulicy do mianownika: "ul. Mogilskiej 70" →
 * "ul. Mogilska 70", "ul. Długiej" → "ul. Długa". Konserwatywnie — działa TYLKO
 * dla JEDNOWYRAZOWEJ nazwy przymiotnikowej z końcówką "-ej" (żeńskie ulice typu
 * Mogilska/Długa/Krótka). Nazwy WIELOWYRAZOWE zostawia bez zmian, bo to zwykle
 * dopełniacz od nazwiska, który MA zostać odmieniony ("ul. Jana Kilińskiego",
 * "al. Jana Pawła II"). Idempotentna: mianownik ("Mogilska") nie ma "-ej", więc
 * nie jest ruszany — bezpieczna też dla poprawnych danych z AI.
 */
export function toNominativeStreet(street: string | null | undefined): string | undefined {
  if (!street) return street ?? undefined;
  const m = /^(ul\.|al\.|os\.|pl\.)\s+(.+)$/.exec(street.trim());
  if (!m) return street;
  const prefix = m[1]!;
  const rest = m[2]!;
  // Oddziel końcowy numer domu ("70", "5a"), by go zachować bez zmian.
  const numMatch = /\s+(\d+[a-zA-Z]?)$/.exec(rest);
  const num = numMatch ? numMatch[0] : "";
  const core = (num ? rest.slice(0, rest.length - num.length) : rest).trim();
  // Tylko jednowyrazowa nazwa (bez spacji) — wielowyrazowa = dopełniacz nazwiska.
  if (/\s/.test(core)) return street;
  // Nazwa własna z wielkiej litery i sensownej długości (unikamy krótkich śmieci).
  if (core.length <= 4 || !/^[A-ZŻŹĆĄŚĘŁÓŃ]/.test(core)) return street;
  for (const [re, repl] of NOMINATIVE_SUFFIXES) {
    if (re.test(core)) {
      const nominative = core.replace(re, repl);
      return `${prefix} ${nominative}${num}`;
    }
  }
  return street;
}

/**
 * Buduje etykietę lokalizacji: "Dzielnica, ulica" (ulica tylko gdy znana),
 * "Dzielnica" lub sama "ulica". Zwraca null, gdy brak obu.
 */
export function formatLocation(
  district: string | null | undefined,
  street: string | null | undefined,
): string | null {
  const parts = [district, street].filter((p): p is string => !!p && p.trim().length > 0);
  return parts.length > 0 ? parts.join(", ") : null;
}
