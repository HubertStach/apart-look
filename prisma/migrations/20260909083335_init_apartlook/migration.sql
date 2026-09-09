-- CreateTable
CREATE TABLE "SearchProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "rentExtra" INTEGER,
    "area" REAL,
    "rooms" INTEGER,
    "city" TEXT,
    "district" TEXT,
    "petsAllowed" BOOLEAN,
    "hasParking" BOOLEAN,
    "imageUrl" TEXT,
    "score" REAL,
    "aiSummary" TEXT,
    "aiExtracted" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "rejectReason" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,
    CONSTRAINT "Listing_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "SearchProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScrapeRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "currentStep" TEXT,
    "statsJson" TEXT NOT NULL DEFAULT '{}',
    "error" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    CONSTRAINT "ScrapeRun_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "SearchProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Listing_profileId_status_score_idx" ON "Listing"("profileId", "status", "score");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_profileId_source_externalId_key" ON "Listing"("profileId", "source", "externalId");

-- CreateIndex
CREATE INDEX "ScrapeRun_profileId_startedAt_idx" ON "ScrapeRun"("profileId", "startedAt");
