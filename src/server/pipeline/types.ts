import type { PrismaClient, SearchProfile } from "../../../generated/prisma";
import type { ListingCollection } from "./collection";

export type ListingSource = "OLX" | "OTODOM";

/**
 * Wynik ekstrakcji AI z opisu ogłoszenia. Każde pole może być `null`
 * (model nie znalazł informacji) — nigdy nie zmyślamy.
 */
export interface AiExtraction {
  petsAllowed: boolean | null;
  hasParking: boolean | null;
  district: string | null;
  deposit: number | null;
  adminRent: number | null;
  furnished: boolean | null;
  /** Czy to na pewno długoterminowy najem całego mieszkania (nie pokój/doba/sprzedaż). */
  isLongTermApartmentRental: boolean;
  /** Krótkie (2-3 zdania) podsumowanie po polsku. */
  summary: string;
}

/**
 * Pojedyncze ogłoszenie przepływające przez pipeline. Wzbogacane kolejnymi krokami.
 */
export interface ScrapedListing {
  source: ListingSource;
  externalId: string;
  url: string;
  title: string;
  description?: string;
  price?: number;
  rentExtra?: number;
  area?: number;
  rooms?: number;
  city?: string;
  district?: string;
  petsAllowed?: boolean;
  hasParking?: boolean;
  imageUrl?: string;

  /** Wynik kroku AI (jeśli wykonany). */
  ai?: AiExtraction | null;
  /** Wynik scoringu 0..1. */
  score?: number;
  /** Oznaczenie odrzucenia — jeśli ustawione, ogłoszenie nie jest już aktywne. */
  rejected?: { step: string; reason: string };
}

/** Statystyki raportowane do ScrapeRun.statsJson. */
export interface PipelineStats {
  scraped: number;
  deduped: number;
  filtered: number;
  aiChecked: number;
  passed: number;
  rejected: number;
  saved: number;
}

export interface PipelineContext {
  profile: SearchProfile;
  runId: string;
  db: PrismaClient;
  log: (msg: string) => void;
  /** Zapisuje bieżący krok + częściowe statystyki do ScrapeRun. */
  reportProgress: (step: string, stats?: Partial<PipelineStats>) => Promise<void>;
}

/** Pojedynczy etap łańcucha wyszukiwania. */
export interface PipelineStep {
  readonly name: string;
  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection>;
}
