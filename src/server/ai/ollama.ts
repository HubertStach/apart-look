import { zodToJsonSchema } from "zod-to-json-schema";
import { env } from "~/env";
import { AiProviderError, type AiJsonOptions, type AiProvider } from "./provider";

/**
 * Klient Ollamy (lokalny model AI, fallback) z wymuszonym wyjściem JSON.
 * `format` = JSON Schema wygenerowany z Zod → model musi zwrócić poprawny JSON.
 */

interface OllamaChatResponse {
  message?: { content?: string };
  done?: boolean;
}

export class OllamaProvider implements AiProvider {
  readonly name = "Ollama";
  private available: boolean | null = null;

  /** Szybki health-check — cache'owany na czas przebiegu. */
  async isAvailable(): Promise<boolean> {
    if (this.available !== null) return this.available;
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${env.OLLAMA_URL}/api/tags`, {
        signal: controller.signal,
      }).finally(() => clearTimeout(t));
      this.available = res.ok;
    } catch {
      this.available = false;
    }
    return this.available;
  }

  resetHealth(): void {
    this.available = null;
  }

  /**
   * Wywołuje Ollamę i zwraca sparsowany, zwalidowany obiekt T.
   * Rzuca `AiProviderError`, gdy model nie zwróci poprawnego JSON po `retries` próbach.
   */
  async generateJson<T>(opts: AiJsonOptions<T>): Promise<T> {
    const model = env.OLLAMA_MODEL;
    const retries = opts.retries ?? 1;
    const jsonSchema = zodToJsonSchema(opts.schema, { target: "openApi3" });

    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60_000);
        const res = await fetch(`${env.OLLAMA_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            stream: false,
            format: jsonSchema,
            options: { temperature: 0 },
            messages: [
              { role: "system", content: opts.system },
              { role: "user", content: opts.prompt },
            ],
          }),
        }).finally(() => clearTimeout(timeout));

        if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
        const data = (await res.json()) as OllamaChatResponse;
        const content = data.message?.content ?? "";
        const parsed: unknown = JSON.parse(content);
        return opts.schema.parse(parsed);
      } catch (err) {
        lastErr = err;
      }
    }
    throw new AiProviderError(
      `Ollama nie zwróciła poprawnego JSON: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
      this.name,
    );
  }
}

/** Współdzielona instancja providera Ollama. */
export const ollamaProvider = new OllamaProvider();
