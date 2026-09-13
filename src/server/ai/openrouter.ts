import { zodToJsonSchema } from "zod-to-json-schema";
import { env } from "~/env";
import { AiProviderError, type AiJsonOptions, type AiProvider } from "./provider";

/**
 * Klient OpenRouter (zdalny model AI, primary — patrz strategia w `provider.ts`).
 *
 * Model `nex-agi/nex-n2.5-mini:free` wspiera natywne structured outputs
 * (`response_format` / `structured_outputs`), więc — tak jak w Ollamie — wymuszamy
 * JSON Schema wygenerowany z tego samego Zod-a i walidujemy wynik przez `schema.parse`.
 */

interface OpenRouterResponse {
  choices?: {
    message?: { content?: string };
  }[];
  error?: { message?: string; code?: number };
}

/** HTTP status oznaczające „przełącz się na fallback": limit, kredyty, outage. */
function isFallbackStatus(status: number): boolean {
  return status === 429 || status === 402 || status === 408 || status >= 500;
}

export class OpenRouterProvider implements AiProvider {
  readonly name = "OpenRouter";
  private available: boolean | null = null;

  /** Dostępny, gdy skonfigurowano klucz API. */
  isAvailable(): Promise<boolean> {
    if (this.available !== null) return Promise.resolve(this.available);
    this.available = !!env.OPENROUTER_API_KEY;
    return Promise.resolve(this.available);
  }

  resetHealth(): void {
    this.available = null;
  }

  async generateJson<T>(opts: AiJsonOptions<T>): Promise<T> {
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new AiProviderError("Brak OPENROUTER_API_KEY", this.name);
    }
    const retries = opts.retries ?? 1;
    const jsonSchema = zodToJsonSchema(opts.schema, { target: "openApi3" });

    const body = {
      model: env.OPENROUTER_MODEL,
      temperature: 0,
      stream: false,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "listing_extraction",
          strict: false,
          schema: jsonSchema,
        },
      },
    };

    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60_000);
        const res = await fetch(`${env.OPENROUTER_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            // Zalecane przez OpenRouter (identyfikacja aplikacji).
            "HTTP-Referer": "https://github.com/apart-look",
            "X-Title": "apart-look",
          },
          signal: controller.signal,
          body: JSON.stringify(body),
        }).finally(() => clearTimeout(timeout));

        if (!res.ok) {
          // 429/402/5xx/timeout => sygnał do fallbacku (nie ponawiamy w kółko).
          throw new AiProviderError(
            `OpenRouter HTTP ${res.status}`,
            this.name,
            res.status,
          );
        }

        const data = (await res.json()) as OpenRouterResponse;
        if (data.error) {
          throw new AiProviderError(
            `OpenRouter: ${data.error.message ?? "błąd"}`,
            this.name,
            data.error.code,
          );
        }

        const content = data.choices?.[0]?.message?.content ?? "";
        if (!content.trim()) throw new Error("pusta odpowiedź (brak content)");
        const parsed: unknown = JSON.parse(content);
        return opts.schema.parse(parsed);
      } catch (err) {
        lastErr = err;
        // Błędy limitu/outage nie mają sensu ponawiać na tym samym providerze —
        // od razu propagujemy, żeby orkiestrator przeszedł na fallback.
        if (err instanceof AiProviderError && err.status && isFallbackStatus(err.status)) {
          throw err;
        }
      }
    }
    throw new AiProviderError(
      `OpenRouter nie zwrócił poprawnego JSON: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
      this.name,
    );
  }
}

/** Współdzielona instancja providera OpenRouter. */
export const openRouterProvider = new OpenRouterProvider();
