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
    <main className="flex flex-1 flex-col overflow-hidden bg-cream">
      {/* pasek filtrów */}
      <div className="flex flex-wrap items-center gap-3 border-b border-linen bg-panel px-4 py-2 text-sm">
        <span className="font-semibold text-cocoa">
          {listings.data?.length ?? 0} mieszkań
        </span>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
          className="rounded-md border border-linen bg-cream/60 px-2 py-1 text-xs text-cocoa focus:border-clay focus:outline-none"
        >
          <option value="ALL">Wszystkie źródła</option>
          <option value="OLX">OLX</option>
          <option value="OTODOM">Otodom</option>
        </select>

        <label className="flex items-center gap-1 text-xs text-mocha">
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => setOnlyFavorites(e.target.checked)}
            className="accent-clay"
          />
          tylko ulubione
        </label>
        <label className="flex items-center gap-1 text-xs text-mocha">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) => setIncludeHidden(e.target.checked)}
            className="accent-clay"
          />
          pokaż ukryte
        </label>

        {rejected.data && rejected.data.total > 0 && (
          <details className="relative ml-auto text-xs text-mocha">
            <summary className="cursor-pointer">
              odrzucono {rejected.data.total} ▸
            </summary>
            <ul className="absolute right-0 z-10 mt-1 w-64 rounded-md border border-linen bg-panel p-2 shadow-lg">
              {rejected.data.byReason.slice(0, 12).map((r) => (
                <li key={r.reason} className="flex justify-between gap-2 text-cocoa">
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
          <p className="text-mocha/70">Ładowanie…</p>
        ) : (listings.data?.length ?? 0) === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-mocha/70">
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
