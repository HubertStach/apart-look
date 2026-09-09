import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { profileInputSchema } from "~/server/api/schemas/profile";

/**
 * Aplikacja jest single-user, więc trzymamy jeden aktywny profil.
 * `get` zwraca pierwszy (najstarszy) profil lub null.
 */
export const profileRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.searchProfile.findFirst({
      orderBy: { createdAt: "asc" },
    });
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
      return ctx.db.searchProfile.create({ data });
    }),
});
