/*
  Warnings:

  - Added the required column `origin_zone_id` to the `transfer_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'inactive';

-- DropIndex
DROP INDEX "transfer_requests_profile_id_key";

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "completed_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "full_name" TEXT;

-- AlterTable
ALTER TABLE "transfer_requests" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "origin_zone_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_origin_zone_id_fkey" FOREIGN KEY ("origin_zone_id") REFERENCES "posting_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
