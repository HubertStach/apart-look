"use client";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Listing = RouterOutputs["listing"]["list"][number];

function scoreColor(score: number): string {
  if (score >= 0.75) return "bg-green-600";
  if (score >= 0.5) return "bg-clay";
  return "bg-sand";
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    neutral: "bg-ecru text-cocoa",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-700",
    clay: "bg-beige text-cocoa",
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
    <article className="flex gap-3 rounded-lg border border-linen bg-panel p-3 shadow-sm transition-shadow hover:shadow-md">
      {listing.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.imageUrl}
          alt=""
          className="h-28 w-36 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-28 w-36 shrink-0 items-center justify-center rounded-md bg-ecru text-mocha/50">
          brak zdjęcia
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-cocoa">{listing.title}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-beige">
              <div
                className={`h-full ${scoreColor(score)}`}
                style={{ width: `${scorePct}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-bold text-mocha">
              {scorePct}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {listing.price != null && (
            <span className="text-base font-bold text-cocoa">
              {listing.price.toLocaleString("pl-PL")} zł
              {listing.utilities == null && (
                <span className="ml-1 text-xs font-normal text-mocha/60">+ media</span>
              )}
            </span>
          )}
          {listing.area != null && <span className="text-mocha">{listing.area} m²</span>}
          {listing.rooms != null && <span className="text-mocha">{listing.rooms} pok.</span>}
          {(listing.district ?? listing.street) && (
            <span className="text-mocha/80">
              📍 {[listing.district, listing.street].filter(Boolean).join(", ")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge tone="clay">{listing.source}</Badge>
          {listing.petsAllowed === true && <Badge tone="green">🐾 zwierzęta OK</Badge>}
          {listing.petsAllowed === false && <Badge tone="red">🐾 bez zwierząt</Badge>}
          {listing.hasParking === true && <Badge tone="green">🅿️ parking</Badge>}
          {listing.furnished === true && <Badge tone="green">umeblowane</Badge>}
          {listing.furnished === false && <Badge tone="red">nieumeblowane</Badge>}
        </div>

        {(listing.price != null ||
          listing.rentExtra != null ||
          listing.utilities != null ||
          listing.deposit != null) && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-mocha/80">
            {listing.price != null && <span>wynajem: {listing.price.toLocaleString("pl-PL")} zł</span>}
            {listing.rentExtra != null && (
              <span>czynsz: {listing.rentExtra.toLocaleString("pl-PL")} zł</span>
            )}
            {listing.utilities != null ? (
              <span>media: {listing.utilities.toLocaleString("pl-PL")} zł</span>
            ) : (
              <span className="italic text-mocha/50">media: nieznane</span>
            )}
            {listing.deposit != null && (
              <span>kaucja: {listing.deposit.toLocaleString("pl-PL")} zł</span>
            )}
            {listing.price != null && (
              <span className="font-semibold text-cocoa">
                razem:{" "}
                {(
                  listing.price +
                  (listing.rentExtra ?? 0) +
                  (listing.utilities ?? 0)
                ).toLocaleString("pl-PL")}{" "}
                zł{listing.utilities == null && "+"}
              </span>
            )}
          </div>
        )}

        {listing.aiSummary && (
          <p className="line-clamp-2 text-xs text-mocha/80" title={listing.aiSummary}>
            {listing.aiSummary}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-1 text-xs">
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-clay hover:text-clay-dark hover:underline"
          >
            Zobacz ogłoszenie ↗
          </a>
          <button
            onClick={() => favorite.mutate({ id: listing.id, favorite: !listing.favorite })}
            className={listing.favorite ? "text-amber-500" : "text-mocha/60 hover:text-amber-400"}
          >
            {listing.favorite ? "★ ulubione" : "☆ ulubione"}
          </button>
          <button
            onClick={() => hide.mutate({ id: listing.id, hidden: !listing.hidden })}
            className="text-mocha/60 hover:text-red-500"
          >
            {listing.hidden ? "przywróć" : "ukryj"}
          </button>
        </div>
      </div>
    </article>
  );
}
