import type { ScrapedListing } from "../pipeline/types";
import { parseArea, parsePrice, parseRooms } from "../pipeline/text";

/**
 * Kształt (częściowy) odpowiedzi OLX API v1 /offers/.
 * Pola opcjonalne — parsujemy defensywnie, bo API bywa niespójne.
 */
export interface OlxParam {
  key?: string;
  name?: string;
  type?: string;
  value?: {
    key?: string;
    label?: string;
    value?: string | number;
    // dla ceny:
    currency?: string;
  } | null;
}

export interface OlxOffer {
  id?: number | string;
  url?: string;
  title?: string;
  description?: string;
  params?: OlxParam[];
  location?: {
    city?: { name?: string };
    district?: { name?: string };
    region?: { name?: string };
  };
  photos?: { link?: string }[];
}

export interface OlxResponse {
  data?: OlxOffer[];
  links?: { next?: { href?: string } };
}

function paramValue(offer: OlxOffer, key: string): string | number | undefined {
  const p = offer.params?.find((x) => x.key === key);
  if (!p?.value) return undefined;
  return p.value.value ?? p.value.label ?? undefined;
}

/** Mapuje surową ofertę OLX na znormalizowany ScrapedListing. */
export function mapOlxOffer(offer: OlxOffer): ScrapedListing | null {
  if (offer.id == null || !offer.url) return null;

  const priceRaw = paramValue(offer, "price");
  const areaRaw = paramValue(offer, "m");
  const roomsRaw = paramValue(offer, "rooms");

  // OLX zwraca link zdjęcia z placeholderami {width}/{height}
  const photo = offer.photos?.[0]?.link?.replace(/\{width\}/g, "800").replace(/\{height\}/g, "600");

  return {
    source: "OLX",
    externalId: String(offer.id),
    url: offer.url,
    title: offer.title ?? "(bez tytułu)",
    description: offer.description,
    price: parsePrice(priceRaw ?? null),
    area: parseArea(areaRaw ?? null),
    rooms: parseRooms(roomsRaw ?? offer.title ?? null),
    city: offer.location?.city?.name,
    district: offer.location?.district?.name,
    imageUrl: photo,
  };
}

/** Mapuje całą odpowiedź OLX na listę ScrapedListing (odrzucając niepełne). */
export function mapOlxResponse(res: OlxResponse): ScrapedListing[] {
  return (res.data ?? [])
    .map(mapOlxOffer)
    .filter((x): x is ScrapedListing => x !== null);
}
