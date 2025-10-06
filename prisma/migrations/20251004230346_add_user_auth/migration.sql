/*
  Warnings:

  - You are about to drop the column `firstplaceId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `secondplaceId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `thirdplaceId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Tournament" DROP CONSTRAINT "Tournament_firstplaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tournament" DROP CONSTRAINT "Tournament_secondplaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tournament" DROP CONSTRAINT "Tournament_thirdplaceId_fkey";

-- AlterTable
ALTER TABLE "Participants" ALTER COLUMN "points" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "lastWinner" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "firstplaceId",
DROP COLUMN "secondplaceId",
DROP COLUMN "thirdplaceId",
ADD COLUMN     "firstPlaceId" INTEGER,
ADD COLUMN     "secondPlaceId" INTEGER,
ADD COLUMN     "thirdPlaceId" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_firstPlaceId_fkey" FOREIGN KEY ("firstPlaceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_secondPlaceId_fkey" FOREIGN KEY ("secondPlaceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_thirdPlaceId_fkey" FOREIGN KEY ("thirdPlaceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
