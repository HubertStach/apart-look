# CLAUDE.md — apart-look

Kontekst projektu dla asystenta AI i dla ludzi. Opisuje jak aplikacja działa,
jaka jest architektura, czemu służy i gdzie są wąskie gardła.

---

## 1. Czym jest apart-look

Lokalna (single-user) aplikacja webowa do wyszukiwania mieszkań na wynajem.
Scrapuje ogłoszenia z **OLX** i **Otodom**, przepuszcza je przez łańcuch filtrów
i lokalny model AI (**Ollama**), ocenia dopasowanie do profilu użytkownika i
prezentuje wyniki w dwupanelowym interfejsie.

Użytkownik tworzy **profile wyszukiwania**. Każdy profil ma:
- **must-have** (twarde filtry): miasto, liczba pokoi, opcjonalne widełki ceny i powierzchni,
- **preferencje** z **wagą 0–5 gwiazdek**: cena, powierzchnia, dzielnice, zwierzęta, parking.

Aplikacja jest uruchamiana lokalnie — nie ma logowania ani multi-tenancy.
Obsługuje wiele profili, ale jeden jest **aktywny** naraz (`SearchProfile.isActive`).

---

## 2. Stack i polecenia

**Stack:** Next.js 15 (App Router) · tRPC v11 · Prisma + SQLite · Tailwind v4 ·
TypeScript · React 19 · Playwright · Ollama.

```bash
npm run dev         # serwer deweloperski (Turbopack)
npm run build       # build produkcyjny (Turbopack — patrz §9)
npm run start       # serwer produkcyjny
npm run check       # lint + typecheck (główna bramka jakości)
npm run test        # testy jednostkowe (vitest)
npm run db:push     # sync schematu do SQLite (bez migracji)
npm run db:generate # prisma migrate dev (tworzy migrację)
npm run db:studio   # przeglądarka bazy
```

**Zawsze** przed uznaniem zmiany za gotową: `npm run check` + `npm run test`.
Build produkcyjny (`npm run build`) łapie dodatkowe błędy prerenderu.

Klient Prisma jest generowany do `generated/prisma` (NIE `node_modules`) — import
przez relatywną ścieżkę, np. `../../../../generated/prisma`. Uważaj na głębokość
ścieżki zależnie od położenia pliku.

---

## 3. Architektura

```
┌─ Next.js (App Router) ────────────────────────────────────────┐
│                                                               │
│  UI (React 19, "use client")          tRPC v11               │
│  ┌────────────────┬──────────────┐    ┌────────────────────┐  │
│  │ ProfilePanel   │ ListingList  │    │ profileRouter      │  │
│  │  + Switcher    │  + Cards     │◄───┤ listingRouter      │  │
│  │  + ScrapeCtrl  │              │    │ scrapeRouter       │  │
│  └────────────────┴──────────────┘    └─────────┬──────────┘  │
│                                                  │             │
│  ┌────────────────────────────────────────────── ▼──────────┐ │
│  │ ListingPipeline (server-only, fire-and-forget)          │ │
│  │  Scrape(OLX|Otodom|Mock) ▸ Dedupe ▸ HardFilter ▸        │ │
│  │  FetchDetails ▸ AiExtract ▸ AiVerify ▸ Score ▸ Persist  │ │
│  └───────┬─────────────────┬────────────────┬──────────────┘ │
│          │                 │                │                 │
│    smart-fetch        Ollama API      Prisma/SQLite           │
│    (http→browser)    (localhost)      (generated/prisma)      │
└───────────────────────────────────────────────────────────────┘
```

### Mapa katalogów (`src/`)

```
app/
  page.tsx                    # RSC, force-dynamic, prefetch profilu
  layout.tsx                  # motyw "cozy" (bg-cream / text-cocoa)
  _components/
    workspace-shell.tsx       # client: chowanie lewego panelu
    profile-panel.tsx         # formularz profilu (must-have + preferencje)
    profile-switcher.tsx      # lista profili: przełącz/dodaj/usuń
    collapsible.tsx           # akordeon sekcji
    star-rating.tsx           # ocena 0–5★ (waga preferencji)
    range-input.tsx           # para min/max
    scrape-controls.tsx       # "Szukaj" + polling postępu przebiegu
    listing-list.tsx          # środkowy panel: filtry + lista
    listing-card.tsx          # karta oferty (cena, score, badge, akcje)
server/
  db.ts                       # singleton PrismaClient
  api/
    root.ts                   # appRouter = { profile, listing, scrape }
    trpc.ts                   # kontekst + publicProcedure
    helpers/active-profile.ts # getActiveProfile(Id) z auto-promocją
    schemas/profile.ts        # Zod: profileInputSchema, parseDistricts
    routers/{profile,listing,scrape}.ts
  ai/
    ollama.ts                 # klient Ollama (structured outputs + Zod)
    extraction.ts             # schemat + prompt ekstrakcji
  scrapers/
    polite-fetch.ts           # HTTP z retry/throttle/cache + ScraperError
    browser-fetch.ts          # Playwright/Chromium (singleton + kolejka)
    smart-fetch.ts            # auto: http → fallback browser (pamięć per-domena)
    olx.ts / olx-map.ts       # OLX API v1 + mapowanie
    otodom.ts / otodom-map.ts # Otodom __NEXT_DATA__ + mapowanie
  pipeline/
    types.ts                  # ScrapedListing, PipelineStep, PipelineContext
    collection.ts             # ListingCollection (audyt odrzuceń)
    pipeline.ts               # ListingPipeline (łańcuch kroków)
    index.ts                  # buildDefaultPipeline + runPipeline (lifecycle)
    scoring.ts                # computeScore (czysta funkcja, testowana)
    text.ts                   # parsery/normalizacja (testowane)
    steps/*.ts                # 10 kroków pipeline'u
instrumentation.ts            # node-cron: harmonogram scrapowania
env.js                        # walidacja env (Zod, @t3-oss/env-nextjs)
```

---

## 4. Rdzeń: pipeline wyszukiwania

Serce aplikacji. Wzorzec **chain of steps**: `ListingCollection` (kolekcja ogłoszeń)
przechodzi przez łańcuch obiektów `PipelineStep`. Dodanie etapu = nowa klasa
implementująca `PipelineStep` + jedna linijka `.use(...)` w
`buildDefaultPipeline` (`pipeline/index.ts`).

**Kolejność kroków** (`pipeline/index.ts`):
```
Scrape(OLX + Otodom | Mock) ▸ Dedupe ▸ HardFilter ▸ FetchDetails
▸ AiExtract ▸ AiVerify ▸ Score ▸ Persist
```

Kluczowe zasady:
- **Odrzucone oferty nie znikają.** `ListingCollection.reject()` oznacza je
  `{ step, reason }` zamiast usuwać. Dzięki temu UI pokazuje audyt
  („odrzucono 37: 20 cena, 12 miasto, 5 AI"). `active()` = nieodrzucone.
- **Brak danych ≠ odrzucenie.** HardFilter odrzuca tylko przy jednoznacznej
  niezgodności; `undefined` przechodzi dalej (AI może uzupełnić).
- **AI tylko uzupełnia**, nigdy nie nadpisuje pewnych danych ze scrapera.
- **Degradacja AI:** gdy Ollama nie odpowiada, `AiExtract` ustawia `ai=null`
  i pipeline leci dalej (scoring traktuje braki jako „nieznane").

`runPipeline` (`pipeline/index.ts`) zarządza cyklem życia `ScrapeRun`
(RUNNING→DONE/ERROR), raportuje postęp do `statsJson`, a w `finally` zamyka
przeglądarkę (`closeBrowser`).

### Scoring (`pipeline/scoring.ts`)

Średnia ważona dopasowań, wagi = gwiazdki (0–5):
```
score = Σ(wᵢ · matchᵢ) / Σ(wᵢ)   ∈ [0,1]   (Σw=0 → 1)
```
- cena: liniowo, taniej = lepiej; powierzchnia: liniowo, więcej = lepiej,
- dzielnica: 1 gdy pasuje (po normalizacji diakrytyków), 0.4 nieznana, 0 obca,
- zwierzęta/parking: 1/0.5(nieznane)/0; dane z AI mają pierwszeństwo nad scraperem.

`computeScore` to czysta funkcja — pokryta testami (`scoring.test.ts`).

---

## 5. Warstwa scrapingu (najbardziej krucha część)

**Problem:** OLX (CloudFront) i Otodom (Cloudflare) blokują żądania z Node po
fingerprincie TLS — nagłówki nie pomagają (403 / interstitial).

**Rozwiązanie — trzy warstwy fetch:**
1. `polite-fetch.ts` — zwykły HTTP (retry, throttle 1s+jitter, cache 15 min).
2. `browser-fetch.ts` — headless Chromium (Playwright): singleton browser +
   kontekst PL + **kolejka 1 żądanie naraz**. HTML przez `page.goto()`;
   JSON API przez **same-origin `fetch` w rozgrzanej karcie** (cookies + pełny
   fingerprint JS). Przeglądarka zamykana po przebiegu.
3. `smart-fetch.ts` — strategia `auto`: próba HTTP → przy blokadzie przełączenie
   na przeglądarkę i **zapamiętanie decyzji per domena**. Sterowane przez
   `SCRAPE_ENGINE` = `auto` (domyślne) / `http` / `browser`.

**OLX** (`olx.ts`): nieoficjalne API v1 `/api/v1/offers/`. `city_id` rozwiązywany
przez geo-encoder (dokładniejszy niż `query`), filtry pokoi/ceny/powierzchni w URL.
**Otodom** (`otodom.ts`): parsowanie `<script id="__NEXT_DATA__">` →
`props.pageProps.data.searchAds.items`. Slugi lokalizacji to
`wojewodztwo/powiat/gmina/miasto` — twarda mapa `CITY_SLUGS` dla 16 miast
(krótkie slugi zwracają 404). Nieznane miasto → czytelny `ScraperError`.

Uwaga semantyczna Otodom: `totalPrice` = czynsz najmu, `rentPrice` = czynsz
administracyjny (mapowane jako `price` / `rentExtra`).

Scrapery zgłaszają `ScraperError` i **nie wywracają całego przebiegu** — jeśli
OLX padnie, Otodom i tak leci. Puste wyniki logują ostrzeżenie, nie błąd.

---

## 6. Warstwa AI (`server/ai/`)

Ollama przez `POST /api/chat` ze **structured outputs**: `format` = JSON Schema
wygenerowany z Zod (`zod-to-json-schema`) → model musi zwrócić poprawny JSON.
Jeden call łączy ekstrakcję danych (zwierzęta, parking, dzielnica, kaucja, czynsz
dodatkowy, umeblowanie) i weryfikację typu oferty (`isLongTermApartmentRental` —
odsiewa pokoje/doby/sprzedaż/zamianę). `AiExtract` i `AiVerify` czytają wspólny
wynik z `listing.ai`.

Konfiguracja: `OLLAMA_URL`, `OLLAMA_MODEL` (domyślnie `qwen2.5:7b-instruct`;
alternatywy: bielik dla lepszego PL, gemma dla szybkości). Health-check przed
analizą — brak Ollamy = pominięcie kroku, nie błąd. Wymaga `ollama pull <model>`.

---

## 7. Model danych (`prisma/schema.prisma`)

- **SearchProfile** — must-have (`city`, `rooms`) + preferencje (wartości + wagi
  0–5) + `isActive` (jeden aktywny). `districts` to JSON string (SQLite nie ma
  natywnych tablic) — parsowany przez `parseDistricts`.
- **Listing** — dane oferty + wynik pipeline'u (`score`, `aiSummary`, `aiExtracted`
  JSON, `status` NEW/PASSED/REJECTED, `rejectReason`). `hidden`/`favorite`
  ustawiane przez użytkownika w UI. Unikalność: `[profileId, source, externalId]`
  → upsert deduplikuje między przebiegami.
- **ScrapeRun** — cykl życia przebiegu (`status`, `currentStep`, `statsJson`).

Kaskada `onDelete: Cascade` — usunięcie profilu usuwa jego ogłoszenia i przebiegi.

### Aktywny profil

`helpers/active-profile.ts` (`getActiveProfile` / `getActiveProfileId`) jest
**jedynym** źródłem prawdy o aktywnym profilu — z auto-promocją najstarszego, gdy
żaden nie ma `isActive` (kompatybilność wsteczna). Wszystkie routery, pipeline
i cron przechodzą przez ten helper. **Zmieniając logikę wyboru profilu, zmieniaj
tylko ten plik.**

---

## 8. Konwencje UI

- Motyw „cozy" w `globals.css` jako tokeny Tailwind v4 `@theme` → utility:
  `bg-cream`, `bg-panel`, `bg-ecru`, `bg-beige`, `bg-sand`, `bg-clay`,
  `text-cocoa`, `text-mocha`, `border-linen`. **Nie używaj klas slate/blue** —
  trzymaj paletę.
- `@import "tailwindcss" source(none)` + jawne `@source "../app"` / `"../server"`
  — bez tego Tailwind skanuje katalog domowy (patrz §9).
- Stan serwera przez tRPC + React Query. Po zmianie aktywnego profilu
  `ProfileSwitcher` inwaliduje `profile.*`, `listing.*`, `scrape.status`.
- `ProfilePanel` resetuje lokalny formularz przy zmianie `profile.id`;
  `ScrapeControls` dostaje `key={profile.id}` (remount czyści stan przebiegu).
- Postęp przebiegu: polling `scrape.status` co 1.5 s gdy `RUNNING`
  (`refetchInterval`), stop po zakończeniu.

---

## 9. Pułapki specyficzne dla środowiska (Windows)

- **Build tylko na Turbopack.** `next build` (webpack) wywala się na
  `EPERM scandir C:\Users\...\Cookies` — Prisma globuje katalog domowy przez
  chronione złącza. `build` w package.json używa `--turbopack`, co to omija.
- `next.config.js`: `outputFileTracingRoot` przypięty do projektu +
  `serverExternalPackages: [prisma, playwright, ...]` (nie bundlować).
- Terminal to bash (MSYS): ścieżki POSIX w bash-builtins, ale natywne narzędzia
  (node/prisma) chcą `C:/...`. Scratch pod `$LOCALAPPDATA/Temp`, nie `/tmp`.
- Chromium (Playwright) instalowany raz: `npx playwright install chromium`.

---

## 10. Wąskie gardła i ograniczenia (świadome decyzje)

| Obszar | Wąskie gardło | Uwagi / mitygacja |
|---|---|---|
| **Scraping przeglądarką** | Playwright to kolejka **1 żądanie naraz** + throttle 1s. Kilka stron × 2 portale = dziesiątki sekund. Chromium zjada ~200–400 MB RAM na czas przebiegu. | Świadomie grzeczne tempo (anti-ban). RAM zwalniany przez `closeBrowser` w `finally`. Przy wielu stronach przebieg trwa minuty. |
| **AI (Ollama)** | Największy koszt czasowy. `AiExtract` leci **sekwencyjnie** (concurrency 1) — model lokalny, jeden request naraz. Przy 150+ ofertach to minuty (kilka s/ofertę na CPU). | Sekwencyjność chroni lokalny GPU/CPU. Realny przebieg live: ~260 ofert, AI dominuje czas. Skalowanie: mniejszy model (gemma), mniej stron, albo batching. |
| **SQLite** | Jeden plik, brak współbieżnego zapisu. Przy fire-and-forget pipeline zapisuje przez `upsert` w pętli (N zapytań). | OK dla single-user/lokalnie. Nie skaluje się na wielu równoległych użytkowników. |
| **Fire-and-forget w procesie Next** | Przebieg żyje w procesie serwera. **Restart/crash gubi run** → zostaje wiszący RUNNING. | `scrape.start` oznacza wiszące (>30 min) jako ERROR. Brak kolejki zadań/workerów — świadomie, bo lokalnie. |
| **Krucha zależność od struktury portali** | OLX API v1 i Otodom `__NEXT_DATA__` to nieoficjalne, niestabilne kontrakty. Zmiana po stronie portalu = ciche zero wyników lub błąd mapowania. `CITY_SLUGS` to twarda mapa 16 miast. | Defensywne mapowanie + `ScraperError` z czytelnym komunikatem. Reszta miast wymaga dopisania slugu. Warto trzymać fixture-testy mapperów. |
| **Blokady anti-bot** | CloudFront/Cloudflare mogą podnieść challenge, którego headless nie przejdzie. | `browser-fetch` czeka na challenge (do ~6 s), potem `ScraperError`. Twarda blokada = brak wyników z danego portalu. |
| **`listing.list` bez paginacji** | Zwraca wszystkie PASSED naraz. Przy setkach ofert rośnie payload i render. | OK dla realnych profili (dziesiątki wyników). Przy potrzebie — dodać limit/paginację w routerze i UI. |
| **Skalowanie profili** | Model zakłada jeden aktywny profil. Cron scrapuje tylko aktywny. | Świadome — aplikacja lokalna. Wielu profili naraz nie scrapuje. |

---

## 11. Testy

`vitest` — testy jednostkowe czystej logiki (bez sieci/bazy):
- `scoring.test.ts` — scoring i wagi,
- `text.test.ts` — parsery ceny/powierzchni/pokoi, normalizacja diakrytyków,
- `steps.test.ts` — Dedupe i HardFilter (audyt odrzuceń).

Mocki `SearchProfile` w testach muszą zawierać wszystkie pola schematu
(np. `isActive`) — inaczej tsc się wywali. Scrapery i AI testowane E2E na żywo
(`scripts/e2e-*.mjs`), nie w vitest.

---

## 12. Dodawanie funkcji — szybki przewodnik

- **Nowy etap pipeline'u:** klasa implementująca `PipelineStep` w `pipeline/steps/`
  + `.use(...)` w `buildDefaultPipeline`. Odrzucaj przez `col.reject(...)`, nie usuwaj.
- **Nowy portal:** `scrapers/<portal>.ts` + `<portal>-map.ts` (zwraca
  `ScrapedListing[]`), użyj `smartFetch*`, dodaj `Scrape<Portal>Step`.
- **Nowe pole profilu:** schema → migracja → `profileInputSchema` → `profileRouter`
  → `ProfilePanel` → (jeśli wpływa na scoring) `computeScore` + test.
- **Nowe miasto Otodom:** dopisz slug do `CITY_SLUGS` w `otodom.ts`
  (zweryfikuj na żywym URL-u, że nie zwraca 404).
