import { profileRouter } from "~/server/api/routers/profile";
import { listingRouter } from "~/server/api/routers/listing";
import { scrapeRouter } from "~/server/api/routers/scrape";
import { geoRouter } from "~/server/api/routers/geo";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  listing: listingRouter,
  scrape: scrapeRouter,
  geo: geoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.profile.get();
 */
export const createCaller = createCallerFactory(appRouter);
