"use client";

import { api } from "~/trpc/react";

/**
 * Mapka OpenStreetMap z zaznaczoną ulicą — pokazywana w karcie, gdy znaleziono ulicę.
 *
 * Geokodowanie idzie przez tRPC `geo.geocode` (serwer woła Nominatim z właściwym
 * User-Agent i throttlingiem). Sam podgląd to lekki iframe z oficjalnego embeda OSM
 * (bbox wokół punktu + marker) — bez Leaflet/dodatkowych zależności.
 */
export function ListingMap({
  street,
  city,
}: {
  street: string;
  city?: string | null;
  district?: string | null;
}) {
  // Zapytanie strukturalne do Nominatim (ulica + miasto) obsługiwane po stronie
  // serwera (geo.geocode). Numer domu w `street` uściśla dopasowanie do adresu,
  // a warstwa adresowa Nominatim eliminuje przypadkowe POI (szkoły, lokale).
  const geo = api.geo.geocode.useQuery(
    { street, city: city ?? undefined },
    { staleTime: Infinity, retry: false, enabled: street.trim().length >= 2 },
  );

  if (geo.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-ecru text-xs text-mocha/50">
        Ładowanie mapy…
      </div>
    );
  }

  if (!geo.data) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-ecru text-xs text-mocha/50">
        Nie udało się zlokalizować ulicy
      </div>
    );
  }

  const { lat, lon } = geo.data;
  // Ciasny bbox wokół punktu (≈ kilkaset metrów), żeby ulica była wyraźnie widoczna.
  const d = 0.004;
  const bbox = `${lon - d},${lat - d},${lon + d},${lat + d}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const fullMap = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md border border-linen">
      <iframe
        title={`Mapa: ${street}`}
        src={embedSrc}
        className="w-full flex-1"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex shrink-0 items-center justify-between bg-ecru px-2 py-1 text-xs text-mocha/80">
        <span className="truncate">📍 {street}</span>
        <a
          href={fullMap}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-medium text-clay hover:underline"
        >
          większa mapa ↗
        </a>
      </div>
    </div>
  );
}
