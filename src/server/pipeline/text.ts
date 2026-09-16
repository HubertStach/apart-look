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
 * Wyszukuje ulicę/aleję/osiedle/plac w treści (tytuł + opis) za pomocą REGEX.
 * Działa na ORYGINALNYM tekście (zachowuje wielkość liter nazwy). Dopasowuje
 * przedrostek ("ul.", "ulica", "al.", "aleja", "os.", "osiedle", "pl.", "plac")
 * i 1–4 kolejne wyrazy nazwy (wielka litera / cyfra / liczba rzymska) wraz z
 * ewentualnym numerem domu, np. "ul. Długa 12", "al. Jana Pawła II 40",
 * "os. Widok", "ul. 3 Maja".
 *
 * Nazwę kończy: znak nowej linii, spacja przechodząca w koniec/interpunkcję oraz
 * znaki `, . ; : ! ? / ( ) < > " '` (m.in. markup HTML). Łącznik między wyrazami
 * to tylko spacja/tabulator (`[ \t]`), więc newline NIE zlewa nazwy z następną linią.
 * Zwraca znormalizowany zapis z krótkim przedrostkiem i — gdy podany — numerem
 * domu (np. "ul. Długa 12"), inaczej undefined. Numer domu ZACHOWUJEMY, bo
 * uściśla geokodowanie (Nominatim, zapytanie strukturalne w geo.ts).
 */
export function extractStreetFromText(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  // {0,3} (a nie {0,2}) — dodatkowy token mieści końcowy numer domu przy dłuższych
  // nazwach ("al. Jana Pawła II 40"), którego wcześniej nie obejmowaliśmy.
  const re =
    /\b(ul|ulica|ulicy|al|aleja|aleje|alei|os|osiedle|osiedla|pl|plac)\b\.?[ \t]+([A-ZŻŹĆĄŚĘŁÓŃ0-9][^\s,.;:!?/()<>"']*(?:[ \t]+(?:[A-ZŻŹĆĄŚĘŁÓŃ0-9][^\s,.;:!?/()<>"']*|[IVX]+)){0,3})/;
  const m = re.exec(input);
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
