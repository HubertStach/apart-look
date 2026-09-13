import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import { analyzeWithFallback, resetAiHealth } from "./provider";
import { openRouterProvider } from "./openrouter";

/**
 * Testy warstwy AI.
 *
 * OpenRouter jest OBECNIE WYŁĄCZONY flagą `OPENROUTER_ENABLED = false`
 * (`provider.ts`) — orkiestrator używa TYLKO lokalnej Ollamy. Dlatego:
 *  - testy `analyzeWithFallback` sprawdzają ścieżkę czysto-Ollama,
 *  - kod OpenRoutera testujemy BEZPOŚREDNIO (`openRouterProvider.generateJson`),
 *    żeby pokrycie przetrwało wyłączenie i re-enable był bezpieczny.
 *
 * Mockujemy globalne `fetch` i env, żeby sterować dostępnością/odpowiedziami.
 */

const schema = z.object({ ok: z.boolean() });

// env mockowany per-test (klucz OpenRouter + adresy).
vi.mock("~/env", () => ({
  env: {
    OPENROUTER_API_KEY: "test-key",
    OPENROUTER_MODEL: "nex-agi/nex-n2.5-mini:free",
    OPENROUTER_URL: "https://openrouter.ai/api/v1",
    OLLAMA_URL: "http://localhost:11434",
    OLLAMA_MODEL: "gemma4:e2b",
  },
}));

/** OpenRouter zwraca JSON w `choices[0].message.content` (natywne structured outputs). */
function openRouterOk(payload: unknown): Response {
  return new Response(
    JSON.stringify({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
    { status: 200 },
  );
}

function ollamaTags(): Response {
  return new Response("{}", { status: 200 });
}
function ollamaChat(payload: unknown): Response {
  return new Response(JSON.stringify({ message: { content: JSON.stringify(payload) } }), {
    status: 200,
  });
}

/** Wyciąga URL z argumentu fetch (string | URL) bez ryzyka [object Object]. */
function urlOf(input: string | URL): string {
  return typeof input === "string" ? input : input.href;
}

const opts = { system: "s", prompt: "p", schema, retries: 0 };

beforeEach(() => {
  resetAiHealth();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("analyzeWithFallback (tylko Ollama — OpenRouter wyłączony flagą)", () => {
  it("używa Ollamy i NIE woła OpenRoutera", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = urlOf(url);
      if (u.endsWith("/api/tags")) return ollamaTags();
      if (u.endsWith("/api/chat")) return ollamaChat({ ok: true });
      throw new Error(`nieoczekiwany fetch: ${u}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await analyzeWithFallback(opts);
    expect(res).toEqual({ ok: true });
    // OpenRouter nie może być odpytany przy wyłączonej fladze.
    expect(fetchMock.mock.calls.every((c) => !urlOf(c[0]).includes("openrouter.ai"))).toBe(true);
  });

  it("gdy Ollama jest niedostępna — rzuca błąd", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = urlOf(url);
      if (u.endsWith("/api/tags")) return new Response("down", { status: 500 });
      throw new Error(`nieoczekiwany fetch: ${u}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(analyzeWithFallback(opts)).rejects.toThrow();
  });

  it("gdy Ollama zwraca błąd HTTP — rzuca błąd", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = urlOf(url);
      if (u.endsWith("/api/tags")) return ollamaTags();
      if (u.endsWith("/api/chat")) return new Response("err", { status: 500 });
      throw new Error(`nieoczekiwany fetch: ${u}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(analyzeWithFallback(opts)).rejects.toThrow();
  });
});

// Kod OpenRoutera pozostaje kompletny mimo wyłączenia w orkiestratorze — testujemy
// go BEZPOŚREDNIO, żeby ponowne włączenie (OPENROUTER_ENABLED = true) było bezpieczne.
describe("openRouterProvider.generateJson (test bezpośredni — provider wyłączony w orkiestratorze)", () => {
  it("parsuje poprawny JSON z choices[0].message.content", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = urlOf(url);
      if (u.includes("openrouter.ai")) return openRouterOk({ ok: true });
      throw new Error(`nieoczekiwany fetch: ${u}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await openRouterProvider.generateJson(opts);
    expect(res).toEqual({ ok: true });
  });

  it("przy 429 rzuca AiProviderError ze statusem (sygnał fallbacku)", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = urlOf(url);
      if (u.includes("openrouter.ai")) return new Response("rate limit", { status: 429 });
      throw new Error(`nieoczekiwany fetch: ${u}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(openRouterProvider.generateJson(opts)).rejects.toMatchObject({ status: 429 });
  });

  it("jest dostępny, gdy skonfigurowano OPENROUTER_API_KEY", async () => {
    openRouterProvider.resetHealth();
    await expect(openRouterProvider.isAvailable()).resolves.toBe(true);
  });
});
