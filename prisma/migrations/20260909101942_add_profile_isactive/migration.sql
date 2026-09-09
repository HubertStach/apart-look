-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SearchProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "city" TEXT NOT NULL,
    "rooms" INTEGER NOT NULL,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "priceWeight" INTEGER NOT NULL DEFAULT 0,
    "areaMin" INTEGER,
    "areaMax" INTEGER,
    "areaWeight" INTEGER NOT NULL DEFAULT 0,
    "districts" TEXT NOT NULL DEFAULT '[]',
    "districtWeight" INTEGER NOT NULL DEFAULT 0,
    "petsRequired" BOOLEAN NOT NULL DEFAULT false,
    "petsWeight" INTEGER NOT NULL DEFAULT 0,
    "parkingRequired" BOOLEAN NOT NULL DEFAULT false,
    "parkingWeight" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SearchProfile" ("areaMax", "areaMin", "areaWeight", "city", "createdAt", "districtWeight", "districts", "id", "name", "parkingRequired", "parkingWeight", "petsRequired", "petsWeight", "priceMax", "priceMin", "priceWeight", "rooms", "updatedAt") SELECT "areaMax", "areaMin", "areaWeight", "city", "createdAt", "districtWeight", "districts", "id", "name", "parkingRequired", "parkingWeight", "petsRequired", "petsWeight", "priceMax", "priceMin", "priceWeight", "rooms", "updatedAt" FROM "SearchProfile";
DROP TABLE "SearchProfile";
ALTER TABLE "new_SearchProfile" RENAME TO "SearchProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
