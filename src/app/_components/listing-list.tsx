"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ListingCard } from "./listing-card";

export function ListingList() {
  const [source, setSource] = useState<"ALL" | "OLX" | "OTODOM">("ALL");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [includeHidden, setIncludeHidden] = useState(false);

  const listings = api.listing.list.useQuery({
    status: "PASSED",
    source,
    onlyFavorites,
    includeHidden,
  });
  const rejected = api.listing.rejectedSummary.useQuery();

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* pasek filtrów */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2 text-sm">
        <span className="font-semibold">
          {listings.data?.length ?? 0} mieszkań
        </span>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
          className="rounded border border-slate-300 px-2 py-1 text-xs"
        >
          <option value="ALL">Wszystkie źródła</option>
          <option value="OLX">OLX</option>
          <option value="OTODOM">Otodom</option>
        </select>

        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => setOnlyFavorites(e.target.checked)}
          />
          tylko ulubione
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) => setIncludeHidden(e.target.checked)}
          />
          pokaż ukryte
        </label>

        {rejected.data && rejected.data.total > 0 && (
          <details className="ml-auto text-xs text-slate-500">
            <summary className="cursor-pointer">
              odrzucono {rejected.data.total} ▸
            </summary>
            <ul className="absolute right-4 z-10 mt-1 w-64 rounded border border-slate-200 bg-white p-2 shadow-lg">
              {rejected.data.byReason.slice(0, 12).map((r) => (
                <li key={r.reason} className="flex justify-between gap-2">
                  <span className="truncate">{r.reason}</span>
                  <span className="font-medium">{r.count}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* lista */}
      <div className="flex-1 overflow-y-auto p-4">
        {listings.isLoading ? (
          <p className="text-slate-400">Ładowanie…</p>
        ) : (listings.data?.length ?? 0) === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <p className="text-lg">Brak mieszkań</p>
            <p className="text-sm">
              Uzupełnij profil po lewej i kliknij „🔍 Szukaj mieszkań”.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.data?.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
