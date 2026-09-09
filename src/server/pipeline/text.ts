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

/**
 * Parsuje liczbę pokoi. Obsługuje "kawalerka" => 1, "2 pokoje", "trzypokojowe".
 */
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
