import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { profileInputSchema } from "~/server/api/schemas/profile";
import { getActiveProfile } from "~/server/api/helpers/active-profile";

/** Domyślne wartości nowego, pustego profilu. */
const NEW_PROFILE_DEFAULTS = {
  city: "",
  rooms: 2,
  priceWeight: 0,
  areaWeight: 0,
  districts: "[]",
  districtWeight: 0,
  petsRequired: false,
  petsWeight: 0,
  parkingRequired: false,
  parkingWeight: 0,
};

export const profileRouter = createTRPCRouter({
  /** Aktywny profil (z auto-promocją najstarszego, gdy żaden nieaktywny). */
  get: publicProcedure.query(async ({ ctx }) => {
    return getActiveProfile(ctx.db);
  }),

  /** Lista wszystkich profili (do przełącznika w panelu). */
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.searchProfile.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, city: true, rooms: true, isActive: true },
    });
  }),

  /** Ustawia wskazany profil jako aktywny (odznaczając pozostałe). */
  activate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.searchProfile.findUnique({
        where: { id: input.id },
        select: { id: true },
      });
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profil nie istnieje." });
      }
      await ctx.db.$transaction([
        ctx.db.searchProfile.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        }),
        ctx.db.searchProfile.update({
          where: { id: input.id },
          data: { isActive: true },
        }),
      ]);
      return { id: input.id };
    }),

  /** Tworzy nowy, pusty profil i ustawia go jako aktywny. */
  create: publicProcedure
    .input(z.object({ name: z.string().min(1).default("Nowy profil") }).default({}))
    .mutation(async ({ ctx, input }) => {
      // Najpierw odznacz dotychczasowy aktywny, potem utwórz nowy jako aktywny —
      // zwrócony obiekt ma już poprawne isActive=true.
      await ctx.db.searchProfile.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
      return ctx.db.searchProfile.create({
        data: { ...NEW_PROFILE_DEFAULTS, name: input.name, isActive: true },
      });
    }),

  /** Usuwa profil (wraz z ogłoszeniami i przebiegami — kaskada). */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const wasActive = await ctx.db.searchProfile.findUnique({
        where: { id: input.id },
        select: { isActive: true },
      });
      if (!wasActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profil nie istnieje." });
      }

      await ctx.db.searchProfile.delete({ where: { id: input.id } });

      // jeśli usunęliśmy aktywny — awansuj najstarszy z pozostałych
      if (wasActive.isActive) {
        const next = await ctx.db.searchProfile.findFirst({
          orderBy: { createdAt: "asc" },
          select: { id: true },
        });
        if (next) {
          await ctx.db.searchProfile.update({
            where: { id: next.id },
            data: { isActive: true },
          });
        }
      }
      return { id: input.id };
    }),

  upsert: publicProcedure
    .input(profileInputSchema)
    .mutation(async ({ ctx, input }) => {
      const data = {
        name: input.name,
        city: input.city.trim(),
        rooms: input.rooms,
        priceMin: input.priceMin ?? null,
        priceMax: input.priceMax ?? null,
        priceWeight: input.priceWeight,
        areaMin: input.areaMin ?? null,
        areaMax: input.areaMax ?? null,
        areaWeight: input.areaWeight,
        districts: JSON.stringify(input.districts),
        districtWeight: input.districtWeight,
        petsRequired: input.petsRequired,
        petsWeight: input.petsWeight,
        parkingRequired: input.parkingRequired,
        parkingWeight: input.parkingWeight,
      };

      if (input.id) {
        return ctx.db.searchProfile.update({
          where: { id: input.id },
          data,
        });
      }

      // Brak id → zapisz do aktywnego profilu, a jeśli żadnego nie ma, utwórz go
      // jako aktywny (pierwsze uruchomienie aplikacji).
      const active = await getActiveProfile(ctx.db);
      if (active) {
        return ctx.db.searchProfile.update({ where: { id: active.id }, data });
      }
      return ctx.db.searchProfile.create({ data: { ...data, isActive: true } });
    }),
});
