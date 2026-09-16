"use client";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { ListingMap } from "./listing-map";

type Listing = RouterOutputs["listing"]["list"][number];

function scoreColor(score: number): string {
  if (score >= 0.75) return "bg-sage";
  if (score >= 0.5) return "bg-clay";
  return "bg-sand";
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    neutral: "bg-ecru text-cocoa",
    green: "bg-sage-soft text-sage-deep",
    red: "bg-rust-soft text-rust-deep",
    clay: "bg-beige text-cocoa",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
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
    <article className="flex max-h-[28rem] min-h-64 items-stretch gap-4 overflow-hidden rounded-xl border border-linen bg-panel p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* KOLUMNA 1 — zdjęcie */}
      <div className="min-w-0 flex-1 basis-0">
        {listing.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.imageUrl}
            alt=""
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-ecru text-mocha/50">
            brak zdjęcia
          </div>
        )}
      </div>

      {/* KOLUMNA 2 — opis */}
      <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col gap-2 pr-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-cocoa">{listing.title}</h3>
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="h-2.5 w-14 overflow-hidden rounded-full bg-beige">
              <div
                className={`h-full ${scoreColor(score)}`}
                style={{ width: `${scorePct}%` }}
              />
            </div>
            <span className="w-9 text-right text-sm font-bold text-mocha">
              {scorePct}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {listing.price != null && (
            <span className="text-lg font-bold text-cocoa">
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
              📍 {[listing.district, listing.street].filter((p) => p && p !== "null").join(", ")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge tone="clay">{listing.source}</Badge>
          {listing.petsAllowed === true && <Badge tone="green">🐾 zwierzęta OK</Badge>}
          {listing.petsAllowed === false && <Badge tone="red">🐾 bez zwierząt</Badge>}
          {listing.hasParking === true && <Badge tone="green">🅿️ parking</Badge>}
          {listing.furnished === true && <Badge tone="green">🛋️ umeblowane</Badge>}
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
          <p className="line-clamp-4 text-xs leading-relaxed text-mocha/80" title={listing.aiSummary}>
            {listing.aiSummary}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-1 text-sm">
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-clay hover:text-clay-dark hover:underline"
          >
            Zobacz ↗
          </a>
          <button
            onClick={() => favorite.mutate({ id: listing.id, favorite: !listing.favorite })}
            className={listing.favorite ? "text-clay" : "text-mocha/60 hover:text-clay"}
          >
            {listing.favorite ? "★" : "☆"}
          </button>
          <button
            onClick={() => hide.mutate({ id: listing.id, hidden: !listing.hidden })}
            className="text-mocha/60 hover:text-red-500"
          >
            {listing.hidden ? "przywróć" : "ukryj"}
          </button>
        </div>
      </div>

      {/* KOLUMNA 3 — mapa */}
      <div className="min-w-0 flex-1 basis-0">
        {listing.street ? (
          <ListingMap
            street={listing.street}
            city={listing.city}
            district={listing.district}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-ecru text-center text-xs text-mocha/50">
            brak ulicy — mapa niedostępna
          </div>
        )}
      </div>
    </article>
  );
}
