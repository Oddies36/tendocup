import prisma from "@/lib/prisma";
import TieBreakerClient from "./tieBreakerClient";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string; gameId: string }>;
}

export default async function TieBreakerPage({ params }: Props) {
  const { id, gameId } = await params;
  const tournamentId = Number(id);
  const tournamentGameId = Number(gameId);

  const [tournament, game, teams, allGames] = await Promise.all([
    prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { id: true, title: true, status: true },
    }),
    prisma.tournamentGame.findUnique({
      where: { id: tournamentGameId },
      select: {
        id: true,
        name: true,
        tournamentId: true,
        isTieBreaker: true,
        playersPerTeam: true,
        numberOfTeams: true,
      },
    }),
    prisma.team.findMany({
      where: { tournamentGameId },
      include: { player: true },
      orderBy: { teamNumber: "asc" },
    }),
    prisma.game.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!tournament)
    return (
      <div className="pt-24 text-center text-red-600">
        Tournoi introuvable.
      </div>
    );

  if (tournament.status === "finished")
    return (
      <div className="pt-24 text-center text-gray-600">
        Ce tournoi est terminé.
      </div>
    );

  if (!game || !game.isTieBreaker)
    return (
      <div className="pt-24 text-center text-red-600">
        Match de départage introuvable.
      </div>
    );

  return (
    <main className="pt-24 px-4">
      <TieBreakerClient
        tournament={tournament}
        game={game}
        teams={teams}
        allGames={allGames}
      />
    </main>
  );
}
