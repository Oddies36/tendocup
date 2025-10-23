import prisma from "@/lib/prisma";
import SetupClient from "./setupClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const tournamentIdParam = Number(id);

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentIdParam },
    select: { id: true, title: true, status: true },
  });

  if (!tournament) {
    return <div className="pt-24 text-center text-red-600">Tournoi introuvable.</div>;
  }

  const games = await prisma.tournamentGame.findMany({
    where: { tournamentId: tournamentIdParam },
    select: {
      id: true,
      name: true,
      numberOfTeams: true,
      playersPerTeam: true,
    },
  });

  const participants = await prisma.participants.findMany({
    where: { tournamentId: tournamentIdParam },
    include: { player: true },
  });

    if (!tournament || tournament.status !== "ongoing") {
    return (
      <main className="pt-24 text-center text-red-600 font-medium text-lg">
        Tournoi non accessible.
      </main>
    );
  }

  return (
    <main className="pt-5 px-4">
      <SetupClient
        tournament={tournament}
        games={games}
        participants={participants}
      />
    </main>
  );
}
