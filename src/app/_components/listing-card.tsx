"use client";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Listing = RouterOutputs["listing"]["list"][number];

function scoreColor(score: number): string {
  if (score >= 0.75) return "bg-green-500";
  if (score >= 0.5) return "bg-amber-500";
  return "bg-slate-400";
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const utils = api.useUtils();
  const invalidate = () => {
    void utils.listing.list.invalidate();
  };
  const hide = api.listing.hide.useMutation({ onSuccess: invalidate });
  const favorite = api.listing.favorite.useMutation({ onSuccess: invalidate });

  const score = listing.score ?? 0;
  const scorePct = Math.round(score * 100);

  return (
    <article className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {listing.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.imageUrl}
          alt=""
          className="h-28 w-36 shrink-0 rounded object-cover"
        />
      ) : (
        <div className="flex h-28 w-36 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-300">
          brak zdjęcia
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{listing.title}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <div className="h-2 w-16 overflow-hidden rounded bg-slate-200">
              <div
                className={`h-full ${scoreColor(score)}`}
                style={{ width: `${scorePct}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-bold text-slate-600">
              {scorePct}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {listing.price != null && (
            <span className="text-base font-bold text-slate-900">
              {listing.price.toLocaleString("pl-PL")} zł
            </span>
          )}
          {listing.area != null && <span className="text-slate-600">{listing.area} m²</span>}
          {listing.rooms != null && <span className="text-slate-600">{listing.rooms} pok.</span>}
          {listing.district && <span className="text-slate-500">📍 {listing.district}</span>}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge tone="blue">{listing.source}</Badge>
          {listing.petsAllowed === true && <Badge tone="green">🐾 zwierzęta OK</Badge>}
          {listing.petsAllowed === false && <Badge tone="red">🐾 bez zwierząt</Badge>}
          {listing.hasParking === true && <Badge tone="green">🅿️ parking</Badge>}
          {listing.rentExtra != null && <Badge>+ {listing.rentExtra} zł czynsz</Badge>}
        </div>

        {listing.aiSummary && (
          <p className="line-clamp-2 text-xs text-slate-500">{listing.aiSummary}</p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-1 text-xs">
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            Zobacz ogłoszenie ↗
          </a>
          <button
            onClick={() => favorite.mutate({ id: listing.id, favorite: !listing.favorite })}
            className={listing.favorite ? "text-amber-500" : "text-slate-400 hover:text-amber-400"}
          >
            {listing.favorite ? "★ ulubione" : "☆ ulubione"}
          </button>
          <button
            onClick={() => hide.mutate({ id: listing.id, hidden: !listing.hidden })}
            className="text-slate-400 hover:text-red-500"
          >
            {listing.hidden ? "przywróć" : "ukryj"}
          </button>
        </div>
      </div>
    </article>
  );
}
