-- DropForeignKey
ALTER TABLE "public"."TournamentGame" DROP CONSTRAINT "TournamentGame_gameId_fkey";

-- AlterTable
ALTER TABLE "TournamentGame" ALTER COLUMN "gameId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TournamentGame" ADD CONSTRAINT "TournamentGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
