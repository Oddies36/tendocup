/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_title_key" ON "Tournament"("title");
