/*
  Warnings:

  - A unique constraint covering the columns `[request_id,zone_id]` on the table `target_zones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_participants" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "request_id" INTEGER NOT NULL,

    CONSTRAINT "match_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "target_zones_request_id_zone_id_key" ON "target_zones"("request_id", "zone_id");

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "transfer_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
