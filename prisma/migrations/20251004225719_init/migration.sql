-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastWinner" BOOLEAN NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participants" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "numberPlayers" INTEGER NOT NULL,
    "numberGames" INTEGER NOT NULL,
    "firstplaceId" INTEGER,
    "secondplaceId" INTEGER,
    "thirdplaceId" INTEGER,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "tournamentGameId" INTEGER NOT NULL,
    "pointsWon" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentGame" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "numberOfTeams" INTEGER NOT NULL,
    "playersPerTeam" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    CONSTRAINT "TournamentGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Participants_playerId_tournamentId_key" ON "Participants"("playerId", "tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentGame_name_key" ON "TournamentGame"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_firstplaceId_fkey" FOREIGN KEY ("firstplaceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_secondplaceId_fkey" FOREIGN KEY ("secondplaceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_thirdplaceId_fkey" FOREIGN KEY ("thirdplaceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentGameId_fkey" FOREIGN KEY ("tournamentGameId") REFERENCES "TournamentGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentGame" ADD CONSTRAINT "TournamentGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentGame" ADD CONSTRAINT "TournamentGame_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
