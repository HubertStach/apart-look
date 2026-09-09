import type { ListingCollection } from "../collection";
import type { PipelineContext, PipelineStep, ScrapedListing } from "../types";
import type { PrismaClient } from "../../../../generated/prisma";

/** Buduje rekord DB z ogłoszenia (wspólne dla zapisu batch i strumieniowego). */
export function buildListingData(l: ScrapedListing) {
  const passed = !l.rejected;
  return {
    url: l.url,
    title: l.title,
    description: l.description ?? null,
    price: l.price ?? null,
    rentExtra: l.ai?.adminRent ?? l.rentExtra ?? null,
    area: l.area ?? null,
    rooms: l.rooms ?? null,
    city: l.city ?? null,
    district: l.ai?.district ?? l.district ?? null,
    petsAllowed: l.ai?.petsAllowed ?? l.petsAllowed ?? null,
    hasParking: l.ai?.hasParking ?? l.hasParking ?? null,
    imageUrl: l.imageUrl ?? null,
    deposit: l.ai?.deposit ?? null,
    furnished: l.ai?.furnished ?? null,
    utilities: l.ai?.utilitiesCost ?? null,
    score: l.score ?? null,
    aiSummary: l.ai?.summary ?? null,
    aiExtracted: l.ai ? JSON.stringify(l.ai) : null,
    status: passed ? "PASSED" : "REJECTED",
    rejectReason: l.rejected?.reason ?? null,
  };
}

/**
 * Upsert pojedynczego ogłoszenia po kluczu [profileId, source, externalId].
 * Przy update NIE nadpisuje `hidden`/`favorite` ustawionych przez użytkownika.
 */
export async function persistListing(
  db: PrismaClient,
  profileId: string,
  l: ScrapedListing,
): Promise<void> {
  const data = buildListingData(l);
  await db.listing.upsert({
    where: {
      profileId_source_externalId: {
        profileId,
        source: l.source,
        externalId: l.externalId,
      },
    },
    update: data,
    create: { profileId, source: l.source, externalId: l.externalId, ...data },
  });
}

/**
 * Zapisuje wyniki do bazy przez upsert po kluczu [profileId, source, externalId].
 * Aktywne oferty => status PASSED, odrzucone => REJECTED (audyt powodów).
 *
 * Uwaga: w domyślnym pipeline zapis jest strumieniowy (`StreamProcessStep`),
 * więc ten krok batch nie jest w łańcuchu — pozostaje jako gotowy klocek.
 */
export class PersistStep implements PipelineStep {
  readonly name = "Zapis do bazy";

  async run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection> {
    const { db, profile } = ctx;
    let saved = 0;

    for (const l of col.all()) {
      await persistListing(db, profile.id, l);
      saved++;
    }

    await ctx.reportProgress(this.name, {
      passed: col.active().length,
      rejected: col.rejected().length,
      saved,
    });

    return col;
  }
}

/** Pomocnicze — używane też przez route status do liczenia statystyk. */
export function countByReason(rejected: ScrapedListing[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of rejected) {
    const key = l.rejected?.reason ?? "nieznany";
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return m;
}
