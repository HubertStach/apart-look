import type { SearchProfile } from "../../../generated/prisma";
import { looseEquals, normalizeText } from "./text";
import { parseDistricts } from "../api/schemas/profile";
import type { ScrapedListing } from "./types";

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * Dopasowanie ceny: im bliżej dolnej granicy widełek, tym lepiej (taniej = lepiej).
 * match = (priceMax - price) / (priceMax - priceMin), clamp [0,1].
 */
function priceMatch(price: number | undefined, min: number | null, max: number | null): number | null {
  if (price == null) return 0.5; // nieznane
  if (min == null && max == null) return null; // brak preferencji
  if (min != null && max != null) {
    if (max === min) return price <= max ? 1 : 0;
    return clamp01((max - price) / (max - min));
  }
  if (max != null) return price <= max ? 1 : 0;
  if (min != null) return price >= min ? 1 : 0;
  return null;
}

/**
 * Dopasowanie powierzchni: im bliżej górnej granicy, tym lepiej (więcej = lepiej).
 * match = (area - areaMin) / (areaMax - areaMin), clamp [0,1].
 */
function areaMatch(area: number | undefined, min: number | null, max: number | null): number | null {
  if (area == null) return 0.5;
  if (min == null && max == null) return null;
  if (min != null && max != null) {
    if (max === min) return area >= min ? 1 : 0;
    return clamp01((area - min) / (max - min));
  }
  if (min != null) return area >= min ? 1 : 0;
  if (max != null) return area <= max ? 1 : 0;
  return null;
}

function districtMatch(district: string | undefined, preferred: string[]): number | null {
  if (preferred.length === 0) return null;
  if (!district) return 0.4; // nieznane — częściowy kredyt
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
 * Efektywna wartość zwierząt/parkingu bierze pod uwagę dane AI (jeśli są).
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
