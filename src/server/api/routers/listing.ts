import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const listingRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          status: z.enum(["PASSED", "REJECTED", "ALL"]).default("PASSED"),
          source: z.enum(["OLX", "OTODOM", "ALL"]).default("ALL"),
          onlyFavorites: z.boolean().default(false),
          includeHidden: z.boolean().default(false),
        })
        .default({}),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.searchProfile.findFirst({
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      if (!profile) return [];

      return ctx.db.listing.findMany({
        where: {
          profileId: profile.id,
          ...(input.status !== "ALL" ? { status: input.status } : {}),
          ...(input.source !== "ALL" ? { source: input.source } : {}),
          ...(input.onlyFavorites ? { favorite: true } : {}),
          ...(input.includeHidden ? {} : { hidden: false }),
        },
        orderBy: [{ score: "desc" }, { scrapedAt: "desc" }],
      });
    }),

  /** Agregacja powodów odrzuceń z ostatniego przebiegu (dla profilu). */
  rejectedSummary: publicProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.searchProfile.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (!profile) return { total: 0, byReason: [] as { reason: string; count: number }[] };

    const rejected = await ctx.db.listing.findMany({
      where: { profileId: profile.id, status: "REJECTED" },
      select: { rejectReason: true },
    });

    const counts = new Map<string, number>();
    for (const r of rejected) {
      const key = r.rejectReason ?? "nieznany";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return {
      total: rejected.length,
      byReason: [...counts.entries()]
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count),
    };
  }),

  hide: publicProcedure
    .input(z.object({ id: z.string(), hidden: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listing.update({
        where: { id: input.id },
        data: { hidden: input.hidden },
      });
    }),

  favorite: publicProcedure
    .input(z.object({ id: z.string(), favorite: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listing.update({
        where: { id: input.id },
        data: { favorite: input.favorite },
      });
    }),
});
