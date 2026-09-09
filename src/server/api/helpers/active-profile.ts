import type { PrismaClient } from "../../../../generated/prisma";

/**
 * Zwraca aktywny profil (isActive=true). Jeśli żaden nie jest oznaczony jako
 * aktywny (np. baza sprzed migracji), promuje najstarszy i go zwraca.
 * `null` gdy nie ma żadnego profilu.
 */
export async function getActiveProfile(db: PrismaClient) {
  const active = await db.searchProfile.findFirst({ where: { isActive: true } });
  if (active) return active;

  const oldest = await db.searchProfile.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!oldest) return null;

  // auto-promocja: pierwszy profil staje się aktywny
  return db.searchProfile.update({
    where: { id: oldest.id },
    data: { isActive: true },
  });
}

/** Jak wyżej, ale zwraca tylko id (lżejsze zapytania). */
export async function getActiveProfileId(db: PrismaClient): Promise<string | null> {
  const profile = await getActiveProfile(db);
  return profile?.id ?? null;
}
