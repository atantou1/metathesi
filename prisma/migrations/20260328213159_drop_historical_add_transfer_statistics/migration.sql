/*
  Warnings:

  - You are about to drop the `historical_transfer_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "historical_transfer_data" DROP CONSTRAINT "historical_transfer_data_division_id_fkey";

-- DropForeignKey
ALTER TABLE "historical_transfer_data" DROP CONSTRAINT "historical_transfer_data_origin_zone_id_fkey";

-- DropForeignKey
ALTER TABLE "historical_transfer_data" DROP CONSTRAINT "historical_transfer_data_specialty_id_fkey";

-- DropForeignKey
ALTER TABLE "historical_transfer_data" DROP CONSTRAINT "historical_transfer_data_target_zone_id_fkey";

-- DropTable
DROP TABLE "historical_transfer_data";

-- CreateTable
CREATE TABLE "transfer_statistics" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "success_count" INTEGER NOT NULL,
    "success_count_diff" INTEGER NOT NULL,
    "success_count_history" JSONB NOT NULL,
    "base_score" DOUBLE PRECISION,
    "base_score_diff" DOUBLE PRECISION,
    "base_score_history" JSONB NOT NULL,
    "avg_score" DOUBLE PRECISION,
    "avg_score_diff" DOUBLE PRECISION,
    "avg_score_history" JSONB NOT NULL,
    "avg_score_applicants" DOUBLE PRECISION,
    "avg_score_app_diff" DOUBLE PRECISION,
    "avg_score_app_history" JSONB NOT NULL,
    "leaving_count" INTEGER NOT NULL,
    "leaving_count_diff" INTEGER NOT NULL,
    "leaving_count_history" JSONB NOT NULL,
    "targeting_1st_count" INTEGER NOT NULL,
    "targeting_1st_count_diff" INTEGER NOT NULL,
    "targeting_1st_count_history" JSONB NOT NULL,
    "inflow_origins_json" JSONB NOT NULL,
    "outflow_targets_json" JSONB NOT NULL,
    "difficulty_category" TEXT NOT NULL,
    "difficulty_category_history" JSONB NOT NULL,
    "difficulty_category_trend" TEXT NOT NULL,

    CONSTRAINT "transfer_statistics_pkey" PRIMARY KEY ("id")
);
