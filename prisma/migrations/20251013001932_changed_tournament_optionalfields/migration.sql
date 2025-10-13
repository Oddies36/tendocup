-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "numberPlayers" DROP NOT NULL,
ALTER COLUMN "numberGames" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
