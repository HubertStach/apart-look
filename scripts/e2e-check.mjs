const BASE = "http://localhost:3000/api/trpc";

async function mutate(path, input) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: input }),
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}: ${txt}`);
  return JSON.parse(txt);
}
async function query(path, input) {
  const url = `${BASE}/${path}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
  const res = await fetch(url);
  const txt = await res.text();
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}: ${txt}`);
  return JSON.parse(txt);
}
const val = (r) => r.result.data.json;

const profile = val(await mutate("profile.upsert", {
  name: "Test Kraków",
  city: "Kraków",
  rooms: 2,
  priceMin: 2000, priceMax: 4000, priceWeight: 5,
  areaMin: 40, areaMax: 80, areaWeight: 3,
  districts: ["Centrum", "Podgórze"], districtWeight: 4,
  petsRequired: true, petsWeight: 5,
  parkingRequired: true, parkingWeight: 2,
}));
console.log("PROFIL:", profile.id, profile.city);

const run = val(await mutate("scrape.start", { useMock: true }));
console.log("RUN:", run.runId);

let status;
for (let i = 0; i < 30; i++) {
  await new Promise(r => setTimeout(r, 1000));
  status = val(await query("scrape.status", { runId: run.runId }));
  console.log(`  [${i}] status=${status.status} step=${status.currentStep} stats=${JSON.stringify(status.stats)}`);
  if (status.status !== "RUNNING") break;
}

const listings = val(await query("listing.list", { status: "PASSED", source: "ALL", onlyFavorites: false, includeHidden: false }));
console.log(`\nPASSED: ${listings.length}`);
for (const l of listings) {
  console.log(`  [${(l.score*100).toFixed(0)}%] ${l.source} ${l.price}zl ${l.area}m2 ${l.district} - ${l.title.slice(0,40)}`);
}

const rej = val(await query("listing.rejectedSummary", undefined));
console.log(`\nODRZUCONO: ${rej.total}`);
for (const r of rej.byReason) console.log(`  ${r.count}x ${r.reason}`);
