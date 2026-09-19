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
    // Ollama (lokalny model AI). Nazwa modelu WYŁĄCZNIE z .env — brak wartości
    // domyślnej w kodzie, żeby model był wskazywany w jednym miejscu (.env).
    OLLAMA_URL: z.string().url().default("http://localhost:11434"),
    OLLAMA_MODEL: z.string().min(1),
    // OpenRouter (zdalny model AI — obecnie wyłączony flagą w provider.ts).
    // Brak OPENROUTER_API_KEY => OpenRouter niedostępny, używana tylko Ollama.
    // OPENROUTER_MODEL wymagany dopiero, gdy OpenRouter jest włączony (guard w openrouter.ts).
    OPENROUTER_API_KEY: z.string().optional(),
    OPENROUTER_MODEL: z.string().min(1).optional(),
    OPENROUTER_URL: z.string().url().default("https://openrouter.ai/api/v1"),
    // Harmonogram scrapowania (cron); pusty = wyłączony
    SCRAPE_CRON: z.string().optional(),
    // Limit stron pobieranych z każdego portalu na jeden przebieg
    SCRAPE_MAX_PAGES: z.coerce.number().int().positive().default(3),
    // Silnik pobierania: auto (http z fallbackiem na przeglądarkę) / http / browser
    SCRAPE_ENGINE: z.enum(["auto", "http", "browser"]).default("auto"),
    // Próg wstępnej oceny (bez AI) — oferty poniżej tego progu (0..1) nie trafiają
    // do AI (pobranie opisu, ekstrakcja, weryfikacja). Niższy próg = więcej ofert do AI.
    PRE_SCORE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.6),
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
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    OPENROUTER_URL: process.env.OPENROUTER_URL,
    SCRAPE_CRON: process.env.SCRAPE_CRON,
    SCRAPE_MAX_PAGES: process.env.SCRAPE_MAX_PAGES,
    SCRAPE_ENGINE: process.env.SCRAPE_ENGINE,
    PRE_SCORE_THRESHOLD: process.env.PRE_SCORE_THRESHOLD,
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
