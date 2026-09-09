import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { runPipeline } from "~/server/pipeline";
import { getActiveProfile, getActiveProfileId } from "~/server/api/helpers/active-profile";

/** Uznajemy przebieg za "wiszący" po 30 min bez zakończenia. */
const STALE_RUN_MS = 30 * 60 * 1000;

export const scrapeRouter = createTRPCRouter({
  /**
   * Uruchamia przebieg pipeline'u dla aktywnego profilu (fire-and-forget).
   * `useMock=true` używa danych zastępczych (gdy scrapery zablokowane / do testów UI).
   */
  start: publicProcedure
    .input(z.object({ useMock: z.boolean().default(false) }).default({}))
    .mutation(async ({ ctx, input }) => {
      const profile = await getActiveProfile(ctx.db);
      if (!profile) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Najpierw utwórz profil wyszukiwania.",
        });
      }

      // Oznacz wiszące przebiegi jako ERROR (np. po restarcie serwera).
      await ctx.db.scrapeRun.updateMany({
        where: {
          status: "RUNNING",
          startedAt: { lt: new Date(Date.now() - STALE_RUN_MS) },
        },
        data: { status: "ERROR", error: "Przerwany (timeout/restart)", finishedAt: new Date() },
      });

      // Blokada: tylko jeden aktywny przebieg naraz dla tego profilu.
      const running = await ctx.db.scrapeRun.findFirst({
        where: { profileId: profile.id, status: "RUNNING" },
      });
      if (running) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Przebieg już trwa.",
        });
      }

      const run = await ctx.db.scrapeRun.create({
        data: { profileId: profile.id, status: "RUNNING", currentStep: "Start" },
      });

      // Fire-and-forget — nie czekamy na zakończenie pipeline'u.
      void runPipeline(db, profile, run.id, { useMock: input.useMock });

      return { runId: run.id };
    }),

  /** Status bieżącego (lub wskazanego) przebiegu — do pollingu w UI. */
  status: publicProcedure
    .input(z.object({ runId: z.string().optional() }).default({}))
    .query(async ({ ctx, input }) => {
      const profileId = await getActiveProfileId(ctx.db);
      if (!profileId) return null;

      const run = input.runId
        ? await ctx.db.scrapeRun.findUnique({ where: { id: input.runId } })
        : await ctx.db.scrapeRun.findFirst({
            where: { profileId },
            orderBy: { startedAt: "desc" },
          });
      if (!run) return null;

      let stats: Record<string, number> = {};
      try {
        stats = JSON.parse(run.statsJson) as Record<string, number>;
      } catch {
        stats = {};
      }

      return {
        id: run.id,
        status: run.status,
        currentStep: run.currentStep,
        error: run.error,
        stats,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
      };
    }),

  history: publicProcedure.query(async ({ ctx }) => {
    const profileId = await getActiveProfileId(ctx.db);
    if (!profileId) return [];
    return ctx.db.scrapeRun.findMany({
      where: { profileId },
      orderBy: { startedAt: "desc" },
      take: 10,
    });
  }),
});
