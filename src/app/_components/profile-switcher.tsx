"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

/**
 * Przełącznik profili: lista wszystkich profili z zaznaczonym aktywnym,
 * dodawanie nowego, przełączanie i usuwanie.
 */
export function ProfileSwitcher() {
  const utils = api.useUtils();
  const profiles = api.profile.list.useQuery();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  /** Po zmianie aktywnego profilu odświeżamy wszystko, co od niego zależy. */
  const refreshAll = async () => {
    await Promise.all([
      utils.profile.list.invalidate(),
      utils.profile.get.invalidate(),
      utils.listing.list.invalidate(),
      utils.listing.rejectedSummary.invalidate(),
      utils.scrape.status.invalidate(),
    ]);
  };

  const activate = api.profile.activate.useMutation({ onSuccess: refreshAll });
  const create = api.profile.create.useMutation({ onSuccess: refreshAll });
  const del = api.profile.delete.useMutation({
    onSuccess: async () => {
      setConfirmDelete(null);
      await refreshAll();
    },
  });

  const items = profiles.data ?? [];
  const busy = activate.isPending || create.isPending || del.isPending;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-mocha uppercase">
          Profile
        </span>
        <button
          onClick={() => create.mutate({ name: "Nowy profil" })}
          disabled={busy}
          title="Dodaj nowy profil"
          className="rounded-md border border-linen bg-cream/60 px-2 py-0.5 text-xs font-medium text-cocoa transition-colors hover:bg-ecru disabled:opacity-40"
        >
          + Nowy
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((p) => {
          const isConfirming = confirmDelete === p.id;
          return (
            <li
              key={p.id}
              className={`group flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm transition-colors ${
                p.isActive
                  ? "border-clay bg-beige/50 font-medium text-cocoa"
                  : "border-transparent text-mocha hover:bg-ecru/60"
              }`}
            >
              <button
                onClick={() => !p.isActive && activate.mutate({ id: p.id })}
                disabled={busy || p.isActive}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                title={p.isActive ? "Aktywny profil" : "Przełącz na ten profil"}
              >
                <span className={p.isActive ? "text-clay" : "text-transparent"}>●</span>
                <span className="min-w-0 flex-1 truncate">
                  {p.name}
                  <span className="ml-1 text-xs text-mocha/60">
                    · {p.city || "—"} · {p.rooms}p
                  </span>
                </span>
              </button>

              {isConfirming ? (
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => del.mutate({ id: p.id })}
                    disabled={busy}
                    className="rounded bg-red-500 px-1.5 py-0.5 text-xs text-white hover:bg-red-600"
                    title="Potwierdź usunięcie"
                  >
                    usuń
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="rounded px-1 py-0.5 text-xs text-mocha hover:bg-ecru"
                    title="Anuluj"
                  >
                    ✕
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmDelete(p.id)}
                  disabled={busy}
                  className="shrink-0 rounded px-1 text-mocha/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                  title="Usuń profil"
                >
                  🗑
                </button>
              )}
            </li>
          );
        })}
        {items.length === 0 && !profiles.isLoading && (
          <li className="px-2 py-1 text-xs text-mocha/60">Brak profili</li>
        )}
      </ul>
    </div>
  );
}
