import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

import SetupClient from "./setupClient";
import { requireAuth } from "@/lib/auth";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TournamentSetup({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  const tournamentId = Number(id);

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId, status: "setup" },
  });

  if (!tournament) {
    notFound();
  }

  const games = await prisma.game.findMany({
    select: { id: true, name: true },
  });

  const players = await prisma.player.findMany({
    select: { id: true, name: true, lastWinner: true },
  });

  const tournamentGames = await prisma.tournamentGame.findMany({
    where: { tournamentId },
    select: {
      id: true,
      name: true,
      gameId: true,
      playersPerTeam: true,
      numberOfTeams: true,
      tournamentId: true,
      isTieBreaker: true,
    },
    orderBy: { id: "asc" },
  });

const tournamentPlayers = await prisma.participants.findMany({
  where: { tournamentId },
  select: {
    id: true,
    tournamentId: true,
    playerId: true,
    points: true,
  },
  orderBy: { id: "asc" },
});

  return (
    <SetupClient
      tournament={tournament}
      games={games}
      players={players}
      tournamentGames={tournamentGames}
      tournamentPlayers={tournamentPlayers}
    />
  );
}
