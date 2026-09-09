import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { env } from "~/env";

/**
 * Klient Ollamy z wymuszonym wyjściem JSON (structured outputs).
 * `format` = JSON Schema wygenerowany z Zod → model musi zwrócić poprawny JSON.
 */

interface OllamaChatResponse {
  message?: { content?: string };
  done?: boolean;
}

let ollamaAvailable: boolean | null = null;

/** Szybki health-check — cache'owany na czas przebiegu. */
export async function isOllamaAvailable(): Promise<boolean> {
  if (ollamaAvailable !== null) return ollamaAvailable;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${env.OLLAMA_URL}/api/tags`, {
      signal: controller.signal,
    }).finally(() => clearTimeout(t));
    ollamaAvailable = res.ok;
  } catch {
    ollamaAvailable = false;
  }
  return ollamaAvailable;
}

/** Reset cache health-checku (na początek nowego przebiegu). */
export function resetOllamaHealth(): void {
  ollamaAvailable = null;
}

export interface OllamaJsonOptions<T> {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  model?: string;
  retries?: number;
}

/**
 * Wywołuje Ollamę i zwraca sparsowany, zwalidowany obiekt T.
 * Rzuca błąd, gdy model nie zwróci poprawnego JSON po `retries` próbach.
 */
export async function ollamaJson<T>(opts: OllamaJsonOptions<T>): Promise<T> {
  const model = opts.model ?? env.OLLAMA_MODEL;
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
  throw new Error(
    `Ollama nie zwróciła poprawnego JSON: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}
