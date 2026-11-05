-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'BOOKED', 'WON', 'LOST', 'JUNK');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "contactedAt" TIMESTAMP(3),
ADD COLUMN     "followUpAt" TIMESTAMP(3),
-- formType is NOT NULL with no default in the schema, which would make this
-- ALTER fail on a table that already holds rows and leave the migration in
-- the failed state P3009. It is added with a temporary default instead,
-- backfilled from `source` below, and the default is then dropped so the
-- final shape matches schema.prisma exactly.
ADD COLUMN     "formType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "hot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "landingPath" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "outcome" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phoneCc" TEXT,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "segment" TEXT,
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmTerm" TEXT,
ADD COLUMN     "visitorId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- Backfill formType from the source each existing lead arrived under, using
-- the same mapping as lib/leads/scoring.js. Anything unrecognised becomes
-- 'contact', the lowest-scoring type, so an old row cannot jump the call list.
UPDATE "Lead" SET "formType" = CASE "source"
  WHEN 'book-readiness-scorecard' THEN 'readiness_scorecard'
  WHEN 'is-it-a-book'             THEN 'book_triage'
  WHEN 'opening-pages-appraisal'  THEN 'opening_pages'
  WHEN 'memoir-story-mapper'      THEN 'memoir_map'
  WHEN 'scope-cost-estimator'     THEN 'scope_estimator'
  WHEN 'call-me'                  THEN 'call_now'
  WHEN 'consultation'             THEN 'consultation'
  ELSE 'contact'
END
WHERE "formType" = '';

ALTER TABLE "Lead" ALTER COLUMN "formType" DROP DEFAULT;

-- CreateTable
CREATE TABLE "LeadEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "detail" TEXT,
    "actor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadEvent_leadId_createdAt_idx" ON "LeadEvent"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_formType_idx" ON "Lead"("formType");

-- CreateIndex
CREATE INDEX "Lead_status_hot_createdAt_idx" ON "Lead"("status", "hot", "createdAt");

-- AddForeignKey
ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

