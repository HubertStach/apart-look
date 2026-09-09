/**
 * Next.js instrumentation hook — uruchamiany raz przy starcie serwera.
 * Konfiguruje opcjonalny harmonogram scrapowania (node-cron) wg env SCRAPE_CRON.
 */
export async function register() {
  // tylko po stronie Node.js (nie edge), tylko gdy skonfigurowano cron
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const cronExpr = process.env.SCRAPE_CRON;
  if (!cronExpr || cronExpr.trim() === "") {
    console.log("[cron] SCRAPE_CRON pusty — harmonogram wyłączony.");
    return;
  }

  const cron = await import("node-cron");
  if (!cron.validate(cronExpr)) {
    console.error(`[cron] Niepoprawne wyrażenie cron: "${cronExpr}" — pomijam.`);
    return;
  }

  const { db } = await import("~/server/db");
  const { runPipeline } = await import("~/server/pipeline");
  const { getActiveProfile } = await import("~/server/api/helpers/active-profile");

  console.log(`[cron] Harmonogram scrapowania: "${cronExpr}"`);

  cron.schedule(cronExpr, () => {
    void (async () => {
      const profile = await getActiveProfile(db);
      if (!profile) return;

      // pomiń, jeśli przebieg już trwa
      const running = await db.scrapeRun.findFirst({
        where: { profileId: profile.id, status: "RUNNING" },
      });
      if (running) {
        console.log("[cron] Przebieg już trwa — pomijam tick.");
        return;
      }

      const run = await db.scrapeRun.create({
        data: { profileId: profile.id, status: "RUNNING", currentStep: "Start (cron)" },
      });
      console.log(`[cron] Start przebiegu ${run.id}`);
      await runPipeline(db, profile, run.id);
    })();
  });
}
