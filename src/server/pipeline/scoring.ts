import type { SearchProfile } from "../../../generated/prisma";
import { looseEquals, normalizeText } from "./text";
import { parseDistricts } from "../api/schemas/profile";
import type { ScrapedListing } from "./types";

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * Próg bazowy dla JEDNOSTRONNEGO warunku (sam priceMax lub sam areaMin). Spełnienie
 * takiego warunku to już mocne dopasowanie (0.7); zapas (taniej pod budżetem /
 * więcej nad metrażem) dokłada do +0.3. Skalowanie od zera było błędem: przy
 * budżecie 2500 zł oferta za 2400 dostawała 0.04 i cały wynik leciał poniżej progu
 * pre-score → odrzucane WSZYSTKIE realne oferty. Bez górnego/dolnego odniesienia
 * nie ma sensownej skali „od zera", więc kotwiczymy ją tym progiem.
 */
const OPEN_ENDED_FLOOR = 0.7;

/**
 * Dopasowanie ceny: im taniej, tym lepiej.
 * - oba progi: liniowo (priceMax → 0, priceMin → 1) — zakres wybrany przez usera,
 * - sam priceMax: spełniony budżet → [0.7, 1.0] (taniej = wyżej), poza budżetem 0,
 * - sam priceMin: dolny próg twardy (poniżej = 0), bo bez górnej granicy nie ma
 *   sensownej skali „im drożej tym lepiej".
 */
function priceMatch(price: number | undefined, min: number | null, max: number | null): number | null {
  if (price == null) return 0.5; // nieznane
  if (min == null && max == null) return null; // brak preferencji
  if (min != null && max != null) {
    if (max === min) return price <= max ? 1 : 0;
    return clamp01((max - price) / (max - min));
  }
  if (max != null)
    return price <= max ? clamp01(OPEN_ENDED_FLOOR + (1 - OPEN_ENDED_FLOOR) * ((max - price) / max)) : 0;
  if (min != null) return price >= min ? 1 : 0;
  return null;
}

/**
 * Dopasowanie powierzchni: im więcej, tym lepiej.
 * - oba progi: liniowo (areaMin → 0, areaMax → 1) — zakres wybrany przez usera,
 * - sam areaMin: spełniony metraż → [0.7, 1.0], nasycenie do 1.0 przy ≥2×min,
 * - sam areaMax: górny próg (powyżej = 0).
 */
function areaMatch(area: number | undefined, min: number | null, max: number | null): number | null {
  if (area == null) return 0.5;
  if (min == null && max == null) return null;
  if (min != null && max != null) {
    if (max === min) return area >= min ? 1 : 0;
    return clamp01((area - min) / (max - min));
  }
  if (min != null)
    return area >= min ? clamp01(OPEN_ENDED_FLOOR + (1 - OPEN_ENDED_FLOOR) * clamp01((area - min) / min)) : 0;
  if (max != null) return area <= max ? 1 : 0;
  return null;
}

/**
 * Dopasowanie dzielnicy. Nieznana dzielnica → null (NEUTRALNA, pomijana w
 * średniej), a nie częściowy kredyt — inaczej we `PreScoreStep` (liczy score
 * BEZ danych AI) oferta z jeszcze nieuzupełnioną dzielnicą bywała niesłusznie
 * odrzucana, zanim AI zdążyła ją wyłuskać z opisu.
 */
function districtMatch(district: string | undefined, preferred: string[]): number | null {
  if (preferred.length === 0) return null;
  if (!district) return null; // nieznane — neutralne (nie karzemy braku danych)
  const norm = normalizeText(district);
  return preferred.some((d) => normalizeText(d) === norm || norm.includes(normalizeText(d)))
    ? 1
    : 0;
}

function boolMatch(value: boolean | undefined): number {
  if (value == null) return 0.5; // nieznane
  return value ? 1 : 0;
}

/**
 * Scoring: średnia ważona dopasowań preferencji. Wagi = gwiazdki (0..5).
 * Zwraca wartość w [0, 1]. Gdy suma wag = 0 → 1 (brak preferencji = wszystko idealne).
 *
 * Efektywna wartość dzielnicy/zwierząt/parkingu bierze pod uwagę dane AI
 * (jeśli są), a gdy AI ich nie wyłuskała — dane scrapera jako fallback.
 */
export function computeScore(listing: ScrapedListing, profile: SearchProfile): number {
  const districts = parseDistricts(profile.districts);
  const pets = listing.ai?.petsAllowed ?? listing.petsAllowed;
  const parking = listing.ai?.hasParking ?? listing.hasParking;
  const district = listing.ai?.district ?? listing.district;

  const factors: { weight: number; match: number | null }[] = [
    { weight: profile.priceWeight, match: priceMatch(listing.price, profile.priceMin, profile.priceMax) },
    { weight: profile.areaWeight, match: areaMatch(listing.area, profile.areaMin, profile.areaMax) },
    { weight: profile.districtWeight, match: districtMatch(district ?? undefined, districts) },
    { weight: profile.petsWeight, match: profile.petsRequired ? boolMatch(pets ?? undefined) : null },
    { weight: profile.parkingWeight, match: profile.parkingRequired ? boolMatch(parking ?? undefined) : null },
  ];

  let weightedSum = 0;
  let weightTotal = 0;
  for (const f of factors) {
    if (f.match == null || f.weight <= 0) continue;
    weightedSum += f.weight * f.match;
    weightTotal += f.weight;
  }

  if (weightTotal === 0) return 1;
  return clamp01(weightedSum / weightTotal);
}

// re-export dla wygody testów
export { looseEquals };
