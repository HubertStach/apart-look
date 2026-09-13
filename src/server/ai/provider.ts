import type { z } from "zod";
import { openRouterProvider } from "./openrouter";
import { ollamaProvider } from "./ollama";

/**
 * Wspólna warstwa AI: pipeline nie zna konkretnego backendu (OpenRouter/Ollama),
 * rozmawia tylko przez interfejs `AiProvider` i orkiestrator `analyzeWithFallback`.
 *
 * Strategia: PER RUN, nie per-oferta. Cały przebieg (scrape run) używa jednego,
 * pierwszego DOSTĘPNEGO providera z listy `PROVIDERS` (obecnie: OpenRouter).
 * Dopiero gdy w TRAKCIE przebiegu ten provider zawiedzie (limit/outage/niepoprawny
 * JSON), orkiestrator w tym samym wywołaniu próbuje kolejnego (Ollama) — i od tego
 * momentu ("sticky") wszystkie KOLEJNE oferty w tym przebiegu idą już od razu do
 * tego kolejnego providera, bez ponownych prób na tym, który zawiódł. Nowy
 * przebieg (`resetAiHealth()`) zawsze zaczyna od providera nr 1.
 * Gdy wszystkie providery zawiodą — rzuć błąd (konsument degraduje: `l.ai = null`).
 */

export interface AiJsonOptions<T> {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  /** Liczba dodatkowych prób w obrębie JEDNEGO providera (domyślnie 1). */
  retries?: number;
}

export interface AiProvider {
  /** Nazwa providera do logów, np. "OpenRouter" / "Ollama". */
  readonly name: string;
  /** Health-check (cache'owany na czas przebiegu). false => provider pomijany. */
  isAvailable(): Promise<boolean>;
  /** Reset cache health-checku (na początek nowego przebiegu). */
  resetHealth(): void;
  /** Wywołanie modelu z wymuszonym, zwalidowanym wyjściem JSON typu T. */
  generateJson<T>(opts: AiJsonOptions<T>): Promise<T>;
}

/**
 * Błąd sygnalizujący, że providera należy pominąć / przełączyć się na fallback:
 * przekroczony limit (429), brak kredytów (402), outage (5xx), timeout, sieć.
 */
export class AiProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

// --- Orkiestrator providerów AI ---

/**
 * Flaga włączająca zdalny provider OpenRouter. Obecnie WYŁĄCZONY — używamy
 * tylko lokalnej Ollamy. Kod OpenRoutera (`openrouter.ts`) pozostaje w pełni
 * skompilowany i przetestowany (unit-test woła `openRouterProvider.generateJson`
 * bezpośrednio), więc ponowne włączenie to zmiana tej jednej flagi na `true`.
 * Wtedy wraca strategia „OpenRouter (primary) → Ollama (fallback)" per przebieg.
 */
const OPENROUTER_ENABLED = false;

/**
 * Kolejność providerów (pierwszy = primary dla całego przebiegu).
 * Przy `OPENROUTER_ENABLED = true`: OpenRouter primary, Ollama fallback.
 * Domyślnie (flaga false): tylko Ollama (lokalnie).
 */
const PROVIDERS: readonly AiProvider[] = OPENROUTER_ENABLED
  ? [openRouterProvider, ollamaProvider]
  : [ollamaProvider];

/**
 * Indeks providera „przyklejonego" na czas bieżącego przebiegu. Awansuje (+1)
 * TYLKO gdy provider pod tym indeksem zawiedzie — od tej chwili wszystkie kolejne
 * wywołania w tym samym przebiegu pomijają go i zaczynają od kolejnego. Reset do
 * 0 robi `resetAiHealth()` na start nowego przebiegu.
 */
let stickyIndex = 0;

/** Reset health-checków wszystkich providerów + sticky index (na start nowego przebiegu). */
export function resetAiHealth(): void {
  for (const p of PROVIDERS) p.resetHealth();
  stickyIndex = 0;
}

/** true, gdy CHOĆ JEDEN provider jest dostępny (OpenRouter lub Ollama). */
export async function isAiAvailable(): Promise<boolean> {
  const flags = await Promise.all(PROVIDERS.map((p) => p.isAvailable()));
  return flags.some(Boolean);
}

/**
 * Analiza JEDNEJ oferty, zaczynając od providera "przyklejonego" dla bieżącego
 * przebiegu (`stickyIndex`). Próbuje po kolei kolejnych DOSTĘPNYCH providerów aż
 * do sukcesu; przy pierwszym błędzie na `stickyIndex` trwale awansuje go na resztę
 * przebiegu, więc następne oferty nie tracą czasu na ponowną próbę providera,
 * który już raz zawiódł. `onFallback` pozwala zalogować przełączenie.
 * Rzuca, gdy wszyscy DOSTĘPNI providerzy od `stickyIndex` w dół zawiodą.
 */
export async function analyzeWithFallback<T>(
  opts: AiJsonOptions<T>,
  onFallback?: (provider: string, err: unknown) => void,
): Promise<T> {
  let lastErr: unknown;
  for (let i = stickyIndex; i < PROVIDERS.length; i++) {
    const provider = PROVIDERS[i]!;
    if (!(await provider.isAvailable())) {
      if (i === stickyIndex) stickyIndex = i + 1;
      continue;
    }
    try {
      return await provider.generateJson(opts);
    } catch (err) {
      lastErr = err;
      onFallback?.(provider.name, err);
      // Sticky: provider na bieżącym stickyIndex zawiódł -> na resztę przebiegu
      // kolejne oferty pomijają go i zaczynają od następnego w kolejności.
      if (i === stickyIndex) stickyIndex = i + 1;
    }
  }
  throw new AiProviderError(
    `Wszystkie providery AI zawiodły: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
    "orchestrator",
  );
}
