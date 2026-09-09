# apart-look — plan implementacji

Lokalna aplikacja (T3: Next.js 15 + tRPC v11 + Prisma/SQLite + Tailwind v4), single-user, bez auth.
Scraping: OLX + Otodom. AI: Ollama (HTTP API, `http://localhost:11434`).

---

## 1. Architektura wysokopoziomowa

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js (App Router)                                       │
│                                                             │
│  UI (React 19)                tRPC routers                  │
│  ┌──────────┬─────────────┐   ┌──────────────────────────┐  │
│  │ Profil   │ Lista       │   │ profileRouter            │  │
│  │ (lewy    │ mieszkań    │◄──┤ listingRouter            │  │
│  │  panel)  │ (środek)    │   │ scrapeRouter             │  │
│  └──────────┴─────────────┘   └───────────┬──────────────┘  │
│                                           │                 │
│  ┌────────────────────────────────────────▼──────────────┐  │
│  │  ListingPipeline (server-only)                        │  │
│  │  ScrapeOlx ▸ ScrapeOtodom ▸ Dedupe ▸ HardFilter ▸     │  │
│  │  FetchDetails ▸ AiExtract ▸ AiVerify ▸ Score ▸ Persist│  │
│  └───────┬───────────────────────┬───────────────────────┘  │
│          │                       │                          │
│     Prisma/SQLite           Ollama API                      │
└─────────────────────────────────────────────────────────────┘
```

Scraping uruchamiany mutacją tRPC (fire-and-forget + tabela `ScrapeRun` do śledzenia
postępu, klient polluje statusem) oraz opcjonalnie cyklicznie przez `node-cron`
w `src/instrumentation.ts`.

---

## 2. Model danych (prisma/schema.prisma)

```prisma
model SearchProfile {
  id        String   @id @default(cuid())
  name      String
  // MUST-HAVE (twarde filtry)
  city      String
  rooms     Int                  // dokładna liczba pokoi (lub roomsMin/roomsMax)
  // PREFERENCJE — wartość + waga 0..5 gwiazdek (0 = nieistotne)
  priceMin       Int?
  priceMax       Int?
  priceWeight    Int      @default(0)
  areaMin        Int?
  areaMax        Int?
  areaWeight     Int      @default(0)
  districts      String   @default("[]") // JSON string[] — preferowane dzielnice
  districtWeight Int      @default(0)
  petsRequired   Boolean  @default(false)
  petsWeight     Int      @default(0)
  parkingRequired Boolean @default(false)
  parkingWeight  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  listings  Listing[]
  runs      ScrapeRun[]
}

model Listing {
  id          String   @id @default(cuid())
  source      String   // "OLX" | "OTODOM"
  externalId  String
  url         String
  title       String
  description String?
  price       Int?     // zł/mies (czynsz najmu)
  rentExtra   Int?     // czynsz administracyjny, jeśli AI go wyłuska
  area        Float?
  rooms       Int?
  city        String?
  district    String?
  petsAllowed Boolean? // null = nieznane
  hasParking  Boolean?
  imageUrl    String?
  // wynik pipeline'u
  score        Float?
  aiSummary    String?  // 2-3 zdania podsumowania po polsku
  aiExtracted  String?  // JSON — surowy wynik ekstrakcji AI
  status       String   @default("NEW") // NEW|PASSED|REJECTED
  rejectReason String?
  hidden       Boolean  @default(false) // "odrzuć" w UI
  favorite     Boolean  @default(false)
  scrapedAt   DateTime @default(now())
  profileId   String
  profile     SearchProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@unique([profileId, source, externalId])
  @@index([profileId, status, score])
}

model ScrapeRun {
  id         String    @id @default(cuid())
  profileId  String
  profile    SearchProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  status     String    @default("RUNNING") // RUNNING|DONE|ERROR
  currentStep String?
  statsJson  String    @default("{}") // { scraped, deduped, filtered, aiChecked, saved }
  error      String?
  startedAt  DateTime  @default(now())
  finishedAt DateTime?
}
```

Uwagi:
- SQLite nie ma natywnego `Json`/`String[]` w Prisma — trzymamy JSON jako `String`,
  parsowanie/walidacja przez Zod na granicy.
- `@@unique([profileId, source, externalId])` → naturalna deduplikacja przy `upsert`.

---

## 3. Pipeline — rdzeń logiki (`src/server/pipeline/`)

Zgodnie z pomysłem użytkownika: kolekcja mieszkań jako klasa, na której wykonuje się
łańcuch operacji. Wzorzec: **chain of steps** (jak middleware) — każdy krok dostaje
kolekcję, zwraca (przefiltrowaną/wzbogaconą) kolekcję. Dodanie nowego etapu = nowa
klasa + jedna linijka w konfiguracji łańcucha.

```
src/server/pipeline/
├── types.ts          // ScrapedListing, PipelineContext, PipelineStep
├── collection.ts     // ListingCollection
├── pipeline.ts       // ListingPipeline (orkiestracja + raportowanie postępu)
├── steps/
│   ├── scrape-olx.ts
│   ├── scrape-otodom.ts
│   ├── dedupe.ts
│   ├── hard-filter.ts
│   ├── fetch-details.ts
│   ├── ai-extract.ts
│   ├── ai-verify.ts
│   ├── score.ts
│   └── persist.ts
└── index.ts          // buildDefaultPipeline(profile)
```

### 3.1 Typy

```ts
// types.ts
export interface ScrapedListing {
  source: "OLX" | "OTODOM";
  externalId: string;
  url: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  rooms?: number;
  city?: string;
  district?: string;
  petsAllowed?: boolean;
  hasParking?: boolean;
  imageUrl?: string;
  ai?: AiExtraction;         // wynik kroku AI
  score?: number;
  rejected?: { step: string; reason: string };
}

export interface PipelineContext {
  profile: SearchProfile;    // typ z Prisma
  runId: string;
  db: PrismaClient;
  log: (msg: string) => void;
  reportProgress: (step: string, stats?: Record<string, number>) => Promise<void>;
}

export interface PipelineStep {
  readonly name: string;
  run(col: ListingCollection, ctx: PipelineContext): Promise<ListingCollection>;
}
```

### 3.2 ListingCollection

```ts
export class ListingCollection {
  constructor(private items: ScrapedListing[] = []) {}
  get size() { return this.items.length; }
  all() { return [...this.items]; }
  add(...listings: ScrapedListing[]) { this.items.push(...listings); return this; }
  filter(pred: (l: ScrapedListing) => boolean, step: string, reason: (l) => string) {
    // nie usuwa — oznacza rejected (zachowujemy audyt: dlaczego odpadło)
  }
  active() { return this.items.filter(l => !l.rejected); }
  async mapAsync(fn, { concurrency = 4 } = {}) { /* pula workerów */ }
}
```

Kluczowa decyzja: **odrzucone mieszkania nie znikają** — dostają `rejected.reason`.
Dzięki temu w UI można pokazać "odrzucono 37: 20 cena, 12 miasto, 5 AI".

### 3.3 ListingPipeline

```ts
export class ListingPipeline {
  private steps: PipelineStep[] = [];
  use(step: PipelineStep): this { this.steps.push(step); return this; }
  async execute(ctx: PipelineContext): Promise<ListingCollection> {
    let col = new ListingCollection();
    for (const step of this.steps) {
      await ctx.reportProgress(step.name, { in: col.active().length });
      col = await step.run(col, ctx);
    }
    return col;
  }
}

export const buildDefaultPipeline = () =>
  new ListingPipeline()
    .use(new ScrapeOlxStep())
    .use(new ScrapeOtodomStep())
    .use(new DedupeStep())
    .use(new HardFilterStep())
    .use(new FetchDetailsStep())
    .use(new AiExtractStep())
    .use(new AiVerifyStep())
    .use(new ScoreStep())
    .use(new PersistStep());
```

### 3.4 Opis kroków

| Krok | Co robi | Uwagi |
|---|---|---|
| **ScrapeOlxStep** | pobiera listę ogłoszeń najmu z OLX dla miasta+pokoi+ceny | OLX ma nieoficjalne JSON API: `GET https://www.olx.pl/api/v1/offers/?category_id=15&city_id=…&filter_float_price:from=…` — stabilniejsze niż HTML. Fallback: cheerio na HTML |
| **ScrapeOtodomStep** | j.w. dla Otodom | Otodom to Next.js — parsujemy `<script id="__NEXT_DATA__">` z JSON-em wyników (cheerio + JSON.parse). Filtry w URL: `/pl/wyniki/wynajem/mieszkanie/<miasto>?priceMin=…&roomsNumber=…` |
| **DedupeStep** | usuwa duplikaty w ramach przebiegu + te same oferty OLX/Otodom (grupa OLX!) | klucz: znormalizowany tytuł + cena + powierzchnia; drugi poziom: URL canonical |
| **HardFilterStep** | twarde filtry z profilu: miasto, najem, liczba pokoi, price/area min-max | to co scraper już przefiltrował w URL weryfikujemy drugi raz na danych (portale bywają niedokładne). Brakująca wartość (null) ≠ odrzucenie — przechodzi dalej, AI spróbuje wyłuskać |
| **FetchDetailsStep** | dociąga pełny opis ogłoszenia (strona szczegółów) | tylko dla ofert, które przeszły HardFilter → minimalizuje ruch. Rate-limit: 1 req / 1-2 s + jitter, wspólny `polite-fetch` helper |
| **AiExtractStep** | Ollama wyciąga z opisu strukturalne dane: zwierzęta, parking, dzielnica, kaucja, czynsz dodatkowy, umeblowanie + 2-zdaniowe podsumowanie PL | `format: <json-schema>` w Ollama (structured outputs), walidacja Zod, retry 1× przy niepoprawnym JSON. Uzupełnia pola null z scrapera, nie nadpisuje pewnych danych |
| **AiVerifyStep** | sanity-check AI: czy to na pewno najem długoterminowy mieszkania (nie pokój, nie dobowy, nie sprzedaż, nie zamiana)? | zwraca `{ ok: boolean, reason }`; odrzuca z powodem `AI: …` |
| **ScoreStep** | scoring wg gwiazdek | patrz §4 |
| **PersistStep** | `upsert` do bazy po `[profileId, source, externalId]`; zapisuje też odrzucone (status REJECTED) — do audytu, z TTL-owym czyszczeniem | ogłoszenia już PASSED nie są ponownie przepuszczane przez AI (oszczędność) — pipeline pomija externalId już obecne w bazie na etapie Dedupe |

### 3.5 Scoring (ScoreStep)

Średnia ważona dopasowań, wagi = gwiazdki (0–5):

```
score = Σ(wᵢ · matchᵢ) / Σ(wᵢ)    ∈ [0, 1]   (Σw = 0 → score = 1)
```

- **cena**: 1.0 gdy ≤ priceMin…priceMax idealnie; liniowy spadek w widełkach
  (im bliżej priceMin, tym lepiej): `match = (priceMax - price)/(priceMax - priceMin)`,
  clamp [0,1]
- **powierzchnia**: analogicznie, ale rosnąco (więcej = lepiej) — clamp [0,1]
- **dzielnica**: 1.0 gdy `district ∈ profile.districts` (porównanie po normalizacji
  diakrytyków), 0.4 gdy dzielnica nieznana, 0.0 gdy inna
- **zwierzęta / parking**: 1.0 = tak, 0.0 = nie, 0.5 = nieznane (null)

Wynik zapisywany jako `score` (0–100 w UI), lista sortowana malejąco.

---

## 4. Warstwa AI (`src/server/ai/ollama.ts`)

```ts
// klient: POST http://localhost:11434/api/chat, stream: false
export async function ollamaJson<T>(opts: {
  system: string; prompt: string; schema: z.ZodType<T>; model?: string;
}): Promise<T>
```

- `format` = JSON Schema wygenerowany z Zod (`zod-to-json-schema`) → Ollama structured
  outputs gwarantuje poprawny JSON.
- Konfiguracja w `.env`: `OLLAMA_URL=http://localhost:11434`,
  `OLLAMA_MODEL=qwen2.5:7b-instruct` (dobra jakość PL przy 7B; alternatywy:
  `SpeakLeash/bielik-11b-v2.3-instruct` — najlepszy polski, `gemma3:4b` — najszybszy).
- Dodać do `src/env.js` (zod walidacja env).
- Timeout 60 s/request, kolejka z concurrency=1–2 (lokalny GPU/CPU), graceful degradation:
  gdy Ollama nie odpowiada → krok AI oznacza `ai: null` i pipeline działa dalej
  (scoring traktuje jak "nieznane"), a UI pokazuje ostrzeżenie.

Prompt ekstrakcji (skrót): system po polsku, wejście = tytuł+opis, wyjście wg schematu
`{ petsAllowed: bool|null, hasParking: bool|null, district: string|null, deposit: number|null,
adminRent: number|null, furnished: bool|null, isLongTermApartmentRental: bool, summary: string }`.
Jeden call łączy Extract+Verify (mniej requestów) — kroki AiExtract/AiVerify czytają
wspólny wynik z `listing.ai`.

---

## 5. Scrapery — szczegóły techniczne (`src/server/scrapers/`)

```
scrapers/
├── polite-fetch.ts   // fetch z UA przeglądarki, retry+backoff, delay 1-2s+jitter, cache 15 min
├── olx.ts            // searchOlx(params) + fetchOlxDetails(url)
└── otodom.ts         // searchOtodom(params) + fetchOtodomDetails(url)
```

- **OLX**: `https://www.olx.pl/api/v1/offers/` z parametrami: `category_id` (najem
  mieszkań = 15), `region_id`/`city_id` (mapa miast → id trzymana w kodzie lub
  pobierana z `https://www.olx.pl/api/v1/geo-encoder/`), `filter_float_price:from/to`,
  `filter_enum_rooms[]`. Odpowiedź JSON zawiera tytuł, cenę, params[], zdjęcia, url.
- **Otodom**: strona wyników → `__NEXT_DATA__` →
  `props.pageProps.data.searchAds.items` (struktura do zweryfikowania na żywo w fazie 3
  — pierwsze zadanie tej fazy to zrzut i analiza aktualnego JSON-a). Paginacja `&page=N`.
- Oba scrapery zwracają `ScrapedListing[]`; mapowanie liczby pokoi/ceny defensywne
  (parsowanie "1 200 zł", "kawalerka" → 1 pokój itd.) w `scrapers/normalize.ts` +
  testy jednostkowe (vitest) na fixture'ach HTML/JSON zapisanych w repo.
- Selektory/kształt API się zmieniają → każdy scraper zgłasza `ScraperError` z
  czytelnym komunikatem do `ScrapeRun.error`, a UI pokazuje "scraper Otodom wymaga
  aktualizacji" zamiast cichego zera wyników.
- Limit stron na przebieg (np. 3 strony/portal, konfigurowalne) — lokalna apka,
  grzeczne tempo.

---

## 6. tRPC API (`src/server/api/routers/`)

- **profileRouter**
  - `get` — zwraca (jedyny) profil lub null
  - `upsert` — zapis profilu (Zod: wagi 0–5, min≤max, miasto niepuste)
- **listingRouter**
  - `list({ status?, sort?, includeHidden? })` — domyślnie PASSED, sort po score desc
  - `hide(id)` / `favorite(id)` — akcje z UI
  - `rejectedSummary()` — agregacja powodów odrzuceń z ostatniego runa
- **scrapeRouter**
  - `start()` — tworzy `ScrapeRun`, odpala `runPipeline(profile, runId)` **bez await**
    (fire-and-forget w procesie Next), zwraca `runId`; blokada: tylko 1 RUNNING run
  - `status(runId?)` — bieżący run + statsJson (klient polluje co 2 s przez
    `refetchInterval` React Query)
  - `history()` — ostatnie runy

Usunąć `postRouter` + model `Post` + komponent `post.tsx`.

### Harmonogram (cyklicznie co X minut)

- `src/instrumentation.ts` (Next.js instrumentation hook, `register()`): `node-cron`
  startuje harmonogram, interwał z env `SCRAPE_CRON` (np. `*/30 * * * *`), wyłączalny.
  Guard: pomiń tick, gdy poprzedni run RUNNING. Działa tylko przy `next start`/`next dev`
  uruchomionym — dla lokalnej apki OK.

---

## 7. UI (App Router, Tailwind v4)

```
src/app/
├── layout.tsx            // istnieje
├── page.tsx              // główny widok 2-panelowy
└── _components/
    ├── profile-panel.tsx     // lewy panel
    ├── star-rating.tsx       // 0-5 gwiazdek (klikalne, aria)
    ├── range-input.tsx       // min/max (cena, powierzchnia)
    ├── listing-list.tsx      // środkowy panel
    ├── listing-card.tsx      // karta mieszkania
    └── scrape-controls.tsx   // przycisk "Szukaj" + pasek postępu runa
```

**Layout** (`page.tsx`): grid `grid-cols-[320px_1fr]`, pełna wysokość.

- **Lewy panel — profil**: formularz edytowalny in-place. Sekcja "Must-have":
  miasto (input), liczba pokoi (select 1–5+). Sekcja "Preferencje": każda pozycja =
  wiersz [nazwa | wartość(y) | ★★★☆☆]. Cena i powierzchnia mają dodatkowo min/max.
  Przycisk Zapisz (tRPC `profile.upsert`, optimistic update). Na dole:
  `scrape-controls` — "🔍 Szukaj mieszkań", podczas runa pasek: nazwa kroku + liczniki
  (np. "AI: 12/40"), po zakończeniu podsumowanie ("znaleziono 14, odrzucono 37 ▸").
- **Środkowy panel — lista**: karty sortowane po score. Karta: miniatura, tytuł,
  **cena** (duża), powierzchnia, pokoje, dzielnica, badge'e (🐾 zwierzęta OK,
  🅿️ parking, 🛋️ umeblowane — z `aiExtracted`), score jako pierścień/pasek %,
  `aiSummary` (2 zdania), link "Zobacz ogłoszenie ↗" (target=_blank), akcje:
  ukryj / ★ ulubione. Filtry nad listą: źródło, tylko ulubione, pokaż ukryte.
- Stan serwerowy przez tRPC + React Query (już skonfigurowane w szablonie);
  po zakończonym runie invalidacja `listing.list`.

---

## 8. Plan wdrożenia — fazy (każda kończy się działającym stanem)

**Faza 0 — porządki (0.5 h)**
- usunąć Post (schema, router, komponent), migracja `prisma migrate dev`
- `.env`: `DATABASE_URL="file:./db.sqlite"`, `OLLAMA_URL`, `OLLAMA_MODEL`, `SCRAPE_CRON`
- doinstalować: `cheerio`, `node-cron`, `zod-to-json-schema`; dev: `vitest`

**Faza 1 — model danych + profil (2-3 h)**
- schema (§2) + migracja
- `profileRouter` + lewy panel UI (formularz, gwiazdki, min/max)
- ✅ weryfikacja: profil zapisuje się i wczytuje po restarcie

**Faza 2 — szkielet pipeline'u (2-3 h)**
- `ListingCollection`, `ListingPipeline`, typy, `HardFilterStep`, `ScoreStep`,
  `PersistStep`, `DedupeStep` + **MockScrapeStep** (fixture'y z ręcznie zapisanych
  danych OLX/Otodom)
- `scrapeRouter.start/status` + testy vitest dla filtra i scoringu
- ✅ weryfikacja: run na mockach zapisuje listingi do bazy z sensownym score

**Faza 3 — scraper OLX (2-4 h)**
- `polite-fetch`, `olx.ts` (API offers + geo-encoder), `normalize.ts` + fixtures/testy
- podmiana mocka na `ScrapeOlxStep`
- ✅ weryfikacja: realny run zwraca prawdziwe oferty z OLX dla profilu

**Faza 4 — scraper Otodom (2-4 h)**
- zrzut żywej strony wyników, analiza `__NEXT_DATA__`, `otodom.ts`, `FetchDetailsStep`
  (pełne opisy dla obu portali)
- ✅ weryfikacja: run łączy oba źródła, dedupe łapie dublowane oferty OLX↔Otodom

**Faza 5 — AI (2-3 h)**
- `ollama.ts` (structured outputs + Zod), `AiExtractStep`/`AiVerifyStep`,
  scoring korzysta z danych AI; degradacja gdy Ollama offline
- ✅ weryfikacja: opisy z 🐾/🅿️/dzielnicą poprawnie wyłuskane na ~10 realnych ofertach

**Faza 6 — UI listy mieszkań (3-4 h)**
- `listing-list`, `listing-card`, pasek postępu runa, akcje hide/favorite,
  podsumowanie odrzuceń
- ✅ weryfikacja: pełny przepływ profil → Szukaj → lista z linkami

**Faza 7 — harmonogram + szlif (1-2 h)**
- `instrumentation.ts` + node-cron, przełącznik auto-odświeżania w UI,
  `npm run check` czysto, README z instrukcją (ollama pull, npm run dev)

Razem: ~2-3 dni robocze. Kolejność faz 3↔4 dowolna; fazę 5 można rozwijać
niezależnie po fazie 2 (na mockach).

---

## 9. Ryzyka i decyzje

| Ryzyko | Mitygacja |
|---|---|
| Otodom/OLX zmieniają strukturę / blokują boty (Cloudflare na Otodom) | fixture-testy wykrywają zmiany; polite-fetch z realnym UA i wolnym tempem; w razie twardej blokady → fallback na Playwright (osobny krok pipeline, wymiana tylko warstwy fetch) |
| Halucynacje / słaby polski w małym modelu | structured outputs + pole `null` dozwolone wszędzie; AI tylko **uzupełnia**, nigdy nie nadpisuje danych ze scrapera; verify z progiem ostrożności (odrzuca tylko przy wyraźnej pewności) |
| Długi run blokuje wrażenie responsywności | fire-and-forget + polling statusu; AI z concurrency 1-2 i licznikiem postępu |
| Duplikaty OLX↔Otodom (jedna grupa kapitałowa, wspólne oferty) | DedupeStep po tytule+cenie+metrażu |
| Restart dev-serwera ubija runa | run oznaczany ERROR przy starcie procesu, jeśli wisi RUNNING > 30 min |
```
