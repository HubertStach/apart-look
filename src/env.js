import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Ollama (lokalny model AI)
    OLLAMA_URL: z.string().url().default("http://localhost:11434"),
    OLLAMA_MODEL: z.string().default("gemma4:e2b"),
    // Harmonogram scrapowania (cron); pusty = wyłączony
    SCRAPE_CRON: z.string().optional(),
    // Limit stron pobieranych z każdego portalu na jeden przebieg
    SCRAPE_MAX_PAGES: z.coerce.number().int().positive().default(3),
    // Silnik pobierania: auto (http z fallbackiem na przeglądarkę) / http / browser
    SCRAPE_ENGINE: z.enum(["auto", "http", "browser"]).default("auto"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    OLLAMA_URL: process.env.OLLAMA_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
    SCRAPE_CRON: process.env.SCRAPE_CRON,
    SCRAPE_MAX_PAGES: process.env.SCRAPE_MAX_PAGES,
    SCRAPE_ENGINE: process.env.SCRAPE_ENGINE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
