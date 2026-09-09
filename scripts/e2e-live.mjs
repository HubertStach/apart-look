// E2E na ŻYWYCH portalach (bez mocka): profil → scrape.start(useMock:false) → wyniki
const BASE = "http://localhost:3000/api/trpc";

async function mutate(path, input) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: input }),
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}: ${txt.slice(0, 300)}`);
  return JSON.parse(txt);
}
async function query(path, input) {
  const url = `${BASE}/${path}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
  const res = await fetch(url);
  const txt = await res.text();
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}: ${txt.slice(0, 300)}`);
  return JSON.parse(txt);
}
const val = (r) => r.result.data.json;

// profil: Kraków, 2 pokoje, 2000-4500 zł
const existing = val(await query("profile.get", undefined));
const profile = val(await mutate("profile.upsert", {
  id: existing?.id,
  name: "Live Kraków",
  city: "Kraków",
  rooms: 2,
  priceMin: 2000, priceMax: 4500, priceWeight: 5,
  areaMin: 35, areaMax: 80, areaWeight: 3,
  districts: ["Krowodrza", "Podgórze"], districtWeight: 3,
  petsRequired: false, petsWeight: 0,
  parkingRequired: false, parkingWeight: 0,
}));
console.log("PROFIL:", profile.id, profile.city, profile.rooms, "pokoje");

const run = val(await mutate("scrape.start", { useMock: false }));
console.log("RUN (live):", run.runId);

let status;
for (let i = 0; i < 150; i++) {
  await new Promise((r) => setTimeout(r, 2000));
  status = val(await query("scrape.status", { runId: run.runId }));
  if (i % 5 === 0 || status.status !== "RUNNING") {
    console.log(`  [${i * 2}s] ${status.status} | ${status.currentStep} | ${JSON.stringify(status.stats)}`);
  }
  if (status.status !== "RUNNING") break;
}

const listings = val(await query("listing.list", { status: "PASSED", source: "ALL", onlyFavorites: false, includeHidden: false }));
console.log(`\nPASSED: ${listings.length}`);
const bySource = {};
for (const l of listings) bySource[l.source] = (bySource[l.source] ?? 0) + 1;
console.log("Źródła:", JSON.stringify(bySource));
for (const l of listings.slice(0, 8)) {
  console.log(`  [${Math.round((l.score ?? 0) * 100)}%] ${l.source} ${l.price}zl ${l.area}m2 ${l.rooms}pok ${l.district ?? "?"} - ${l.title.slice(0, 45)}`);
  console.log(`      ${l.url.slice(0, 90)}`);
}

const rej = val(await query("listing.rejectedSummary", undefined));
console.log(`\nODRZUCONO: ${rej.total}`);
for (const r of rej.byReason.slice(0, 8)) console.log(`  ${r.count}x ${r.reason}`);
