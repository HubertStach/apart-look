# apart-look 

Lokalna aplikacja webowa do wyszukiwania mieszkań na wynajem: scrapuje ogłoszenia
z **OLX** i **Otodom**, przepuszcza je przez łańcuch filtrów i lokalny model AI
(**Ollama**), a dopasowane oferty pokazuje w prostym, dwupanelowym interfejsie.

Stack: **T3** (Next.js 15 App Router · tRPC v11 · Prisma + SQLite · Tailwind v4 · TypeScript).
Aplikacja jest single-user i uruchamiana lokalnie.

---

## Jak to działa

```
Profil wyszukiwania (miasto, pokoje, preferencje z wagą 0–5 ★)
        │
        ▼
ListingPipeline — łańcuch kroków wykonywanych na kolekcji ogłoszeń:
  ScrapeOLX ▸ ScrapeOtodom ▸ Dedupe ▸ FiltrTwardy ▸ PobranieOpisów
  ▸ AnalizaAI ▸ WeryfikacjaAI ▸ Ocena ▸ Zapis
        │
        ▼
Baza (SQLite) → UI: lewy panel = profil, środek = lista mieszkań ze score
```

Kluczowe założenie: **odrzucone oferty nie znikają** — dostają powód odrzucenia,
więc UI pokazuje audyt („odrzucono 37: 20 cena, 12 miasto, 5 AI”).

Dodanie nowego etapu wyszukiwania = jedna klasa implementująca `PipelineStep`
+ jedna linijka `.use(...)` w `src/server/pipeline/index.ts`.

---

## Wymagania

- Node.js 20+
- (opcjonalnie) [Ollama](https://ollama.com) dla analizy AI opisów

## Uruchomienie

```bash
# 1. zależności
npm install

# 2. plik .env (skopiuj z przykładu)
cp .env.example .env

# 3. baza danych
npm run db:push        # tworzy tabele w prisma/db.sqlite

# 4. (opcjonalnie) model AI
ollama serve
ollama pull SpeakLeash/bielik-minitron-7B-v3.0-instruct:Q4_K_M 

# 5. dev
npm run dev            # http://localhost:3000
```

W UI: uzupełnij profil po lewej → **„🔍 Szukaj mieszkań”**. Jeśli portale
zablokują scrapowanie z serwera, użyj **„Tryb demo (dane mock)”** aby zobaczyć
działanie całego pipeline'u na przykładowych danych.

## Konfiguracja (`.env`)

| Zmienna | Opis | Domyślnie |
|---|---|---|
| `DATABASE_URL` | ścieżka SQLite | `file:./db.sqlite` |
| `OLLAMA_URL` | adres Ollamy | `http://localhost:11434` |
| `OLLAMA_MODEL` | model do ekstrakcji | `gemma4:e2b` |
| `SCRAPE_CRON` | harmonogram (cron); pusty = wyłączony | — |
| `SCRAPE_MAX_PAGES` | limit stron na portal / przebieg | `3` |

## Skrypty

```bash
npm run dev         # serwer deweloperski
npm run test        # testy jednostkowe (vitest): scoring, filtry, dedupe, parsery
npm run check       # lint + typecheck
npm run db:studio   # przeglądarka bazy (Prisma Studio)
```

---

## Architektura

```
src/
├── env.js                       # walidacja zmiennych środowiskowych (Zod)
├── instrumentation.ts           # harmonogram cron (node-cron)
├── app/
│   ├── page.tsx                 # widok dwupanelowy
│   └── _components/             # profile-panel, listing-list/card, star-rating…
└── server/
    ├── api/routers/             # profile · listing · scrape (tRPC)
    ├── ai/                      # klient Ollama (structured outputs) + prompty
    ├── scrapers/                # polite-fetch · olx · otodom + mapowanie
    └── pipeline/                # collection · pipeline · scoring + steps/
```

### Ważna uwaga o scrapowaniu

OLX (CloudFront) i Otodom (Cloudflare) stosują detekcję botów opartą m.in. na
fingerprincie TLS — żądania z serwera Node mogą zwracać **403 / interstitial**
niezależnie od nagłówków. Scrapery są napisane defensywnie (raportują
`ScraperError`, nie wywracają przebiegu), ale przy twardej blokadzie wymagany
jest **fallback na realną przeglądarkę** (Playwright) — wymienia się wtedy tylko
warstwę `politeFetch`, reszta pipeline'u zostaje bez zmian. Do rozwoju i testów
UI służy **tryb demo** (deterministyczne dane mock).

### AI (Ollama)

Jeden call łączy ekstrakcję danych (zwierzęta, parking, dzielnica, kaucja, czynsz
dodatkowy, umeblowanie) i weryfikację typu oferty (długoterminowy najem vs
pokój/doba/sprzedaż). Wymuszony JSON przez structured outputs (`format` = JSON
Schema z Zod). Gdy Ollama jest niedostępna, krok AI jest pomijany, a pipeline
działa dalej (score traktuje brakujące pola jako „nieznane”).