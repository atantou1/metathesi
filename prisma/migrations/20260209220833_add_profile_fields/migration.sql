/*
  Warnings:

  - You are about to drop the column `bio` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "bio",
ADD COLUMN     "hire_date" TIMESTAMP(3) NOT NULL DEFAULT '2020-01-01 00:00:00 +00:00',
ADD COLUMN     "service_days" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "service_months" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "service_years" INTEGER NOT NULL DEFAULT 10;
