-- AlterTable
ALTER TABLE "transfer_statistics" ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "popularity_history" JSONB;
