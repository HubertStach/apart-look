"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

const STEP_ORDER = [
  "Scraper OLX",
  "Scraper Otodom",
  "Scraper (mock)",
  "Deduplikacja",
  "Filtr twardy",
  "Pobranie opisów",
  "Analiza AI",
  "Weryfikacja AI",
  "Ocena dopasowania",
  "Zapis do bazy",
];

export function ScrapeControls({ hasProfile }: { hasProfile: boolean }) {
  const utils = api.useUtils();
  const [runId, setRunId] = useState<string | null>(null);

  const status = api.scrape.status.useQuery(
    { runId: runId ?? undefined },
    {
      refetchInterval: (q) =>
        q.state.data?.status === "RUNNING" ? 1500 : false,
      enabled: hasProfile,
    },
  );

  const isRunning = status.data?.status === "RUNNING";

  const start = api.scrape.start.useMutation({
    onSuccess: async (res) => {
      setRunId(res.runId);
      await utils.scrape.status.invalidate();
    },
  });

  // po zakończeniu przebiegu (przejście RUNNING → DONE) odśwież listę raz
  const prevStatus = useRef<string | undefined>(undefined);
  useEffect(() => {
    const cur = status.data?.status;
    if (prevStatus.current === "RUNNING" && cur === "DONE") {
      void utils.listing.list.invalidate();
      void utils.listing.rejectedSummary.invalidate();
    }
    prevStatus.current = cur;
  }, [status.data?.status, utils]);

  const run = status.data;
  const stepIndex = run?.currentStep ? STEP_ORDER.indexOf(run.currentStep) : -1;
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / STEP_ORDER.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => start.mutate({ useMock: false })}
        disabled={isRunning || start.isPending}
        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40"
      >
        {isRunning ? "⏳ Szukanie…" : "🔍 Szukaj mieszkań"}
      </button>

      <button
        onClick={() => start.mutate({ useMock: true })}
        disabled={isRunning || start.isPending}
        className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        title="Uruchom na danych zastępczych (gdy portale blokują scrapowanie z serwera)"
      >
        Tryb demo (dane mock)
      </button>

      {start.error && (
        <p className="text-xs text-red-500">{start.error.message}</p>
      )}

      {run && (
        <div className="flex flex-col gap-1 rounded bg-slate-50 p-2 text-xs">
          {isRunning && (
            <>
              <div className="flex justify-between">
                <span className="font-medium">{run.currentStep ?? "…"}</span>
                <span className="text-slate-400">
                  {run.stats.aiChecked ? `AI: ${run.stats.aiChecked}` : ""}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-slate-200">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
          {run.status === "DONE" && (
            <span className="text-green-600">
              ✓ Znaleziono {run.stats.passed ?? 0}, odrzucono {run.stats.rejected ?? 0}
            </span>
          )}
          {run.status === "ERROR" && (
            <span className="text-red-500">Błąd: {run.error}</span>
          )}
        </div>
      )}
    </div>
  );
}
