"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { parseDistricts } from "~/server/api/schemas/profile";
import { StarRating } from "./star-rating";
import { RangeInput } from "./range-input";
import { ScrapeControls } from "./scrape-controls";

interface FormState {
  id?: string;
  name: string;
  city: string;
  rooms: number;
  priceMin: number | null;
  priceMax: number | null;
  priceWeight: number;
  areaMin: number | null;
  areaMax: number | null;
  areaWeight: number;
  districtsText: string;
  districtWeight: number;
  petsRequired: boolean;
  petsWeight: number;
  parkingRequired: boolean;
  parkingWeight: number;
}

const EMPTY: FormState = {
  name: "Mój profil",
  city: "",
  rooms: 2,
  priceMin: null,
  priceMax: null,
  priceWeight: 0,
  areaMin: null,
  areaMax: null,
  areaWeight: 0,
  districtsText: "",
  districtWeight: 0,
  petsRequired: false,
  petsWeight: 0,
  parkingRequired: false,
  parkingWeight: 0,
};

export function ProfilePanel() {
  const utils = api.useUtils();
  const { data: profile, isLoading } = api.profile.get.useQuery();
  const [form, setForm] = useState<FormState | null>(null);

  // inicjalizacja formularza po pobraniu profilu
  const state: FormState =
    form ??
    (profile
      ? {
          id: profile.id,
          name: profile.name,
          city: profile.city,
          rooms: profile.rooms,
          priceMin: profile.priceMin,
          priceMax: profile.priceMax,
          priceWeight: profile.priceWeight,
          areaMin: profile.areaMin,
          areaMax: profile.areaMax,
          areaWeight: profile.areaWeight,
          districtsText: parseDistricts(profile.districts).join(", "),
          districtWeight: profile.districtWeight,
          petsRequired: profile.petsRequired,
          petsWeight: profile.petsWeight,
          parkingRequired: profile.parkingRequired,
          parkingWeight: profile.parkingWeight,
        }
      : EMPTY);

  const upsert = api.profile.upsert.useMutation({
    onSuccess: async () => {
      await utils.profile.get.invalidate();
    },
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm({ ...state, [key]: value });

  const save = () => {
    upsert.mutate({
      id: state.id,
      name: state.name || "Mój profil",
      city: state.city,
      rooms: state.rooms,
      priceMin: state.priceMin,
      priceMax: state.priceMax,
      priceWeight: state.priceWeight,
      areaMin: state.areaMin,
      areaMax: state.areaMax,
      areaWeight: state.areaWeight,
      districts: state.districtsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      districtWeight: state.districtWeight,
      petsRequired: state.petsRequired,
      petsWeight: state.petsWeight,
      parkingRequired: state.parkingRequired,
      parkingWeight: state.parkingWeight,
    });
  };

  if (isLoading) {
    return <aside className="w-80 shrink-0 border-r border-slate-200 p-4">Ładowanie…</aside>;
  }

  const err = upsert.error?.data?.zodError?.fieldErrors;

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <h1 className="text-lg font-bold">🏠 apart-look</h1>
        <p className="text-xs text-slate-500">Profil wyszukiwania</p>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* MUST-HAVE */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Wymagane
          </h2>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Nazwa profilu</span>
            <input
              value={state.name}
              onChange={(e) => set("name", e.target.value)}
              className="rounded border border-slate-300 px-2 py-1"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Miasto *</span>
            <input
              value={state.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="np. Kraków"
              className="rounded border border-slate-300 px-2 py-1"
            />
            {err?.city && <span className="text-xs text-red-500">{err.city[0]}</span>}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Liczba pokoi *</span>
            <select
              value={state.rooms}
              onChange={(e) => set("rooms", Number(e.target.value))}
              className="rounded border border-slate-300 px-2 py-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "pokój" : "pokoje"}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* PREFERENCJE */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Preferencje (waga = gwiazdki)
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cena (zł/mies)</span>
              <StarRating
                label="cena"
                value={state.priceWeight}
                onChange={(v) => set("priceWeight", v)}
              />
            </div>
            <RangeInput
              min={state.priceMin}
              max={state.priceMax}
              onMinChange={(v) => set("priceMin", v)}
              onMaxChange={(v) => set("priceMax", v)}
              step={100}
              unit="zł"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Powierzchnia</span>
              <StarRating
                label="powierzchnia"
                value={state.areaWeight}
                onChange={(v) => set("areaWeight", v)}
              />
            </div>
            <RangeInput
              min={state.areaMin}
              max={state.areaMax}
              onMinChange={(v) => set("areaMin", v)}
              onMaxChange={(v) => set("areaMax", v)}
              unit="m²"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dzielnice</span>
              <StarRating
                label="dzielnica"
                value={state.districtWeight}
                onChange={(v) => set("districtWeight", v)}
              />
            </div>
            <input
              value={state.districtsText}
              onChange={(e) => set("districtsText", e.target.value)}
              placeholder="np. Centrum, Podgórze"
              className="rounded border border-slate-300 px-2 py-1 text-sm"
            />
            <span className="text-xs text-slate-400">oddziel przecinkami</span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={state.petsRequired}
                onChange={(e) => set("petsRequired", e.target.checked)}
              />
              Zwierzęta dozwolone
            </label>
            <StarRating
              label="zwierzęta"
              value={state.petsWeight}
              onChange={(v) => set("petsWeight", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={state.parkingRequired}
                onChange={(e) => set("parkingRequired", e.target.checked)}
              />
              Miejsce parkingowe
            </label>
            <StarRating
              label="parking"
              value={state.parkingWeight}
              onChange={(v) => set("parkingWeight", v)}
            />
          </div>
        </section>

        <button
          onClick={save}
          disabled={upsert.isPending || !state.city}
          className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40"
        >
          {upsert.isPending ? "Zapisywanie…" : "💾 Zapisz profil"}
        </button>
        {upsert.isSuccess && (
          <span className="text-center text-xs text-green-600">Zapisano ✓</span>
        )}
      </div>

      {/* KONTROLKI SCRAPOWANIA */}
      {profile && (
        <div className="mt-auto border-t border-slate-200 p-4">
          <ScrapeControls hasProfile={!!profile} />
        </div>
      )}
    </aside>
  );
}
