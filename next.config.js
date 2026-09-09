/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const config = {
  // Trzymaj file-tracing w obrębie projektu (na Windows skan katalogu domowego
  // trafia na chronione złącza typu C:\Users\...\Cookies).
  outputFileTracingRoot: projectRoot,
  // Prisma jako pakiet zewnętrzny serwera — nie jest bundlowana (jej detekcja
  // silnika/platformy skanuje katalog domowy).
  serverExternalPackages: ["@prisma/client", "prisma", "@prisma/engines", "playwright"],
};

export default config;
