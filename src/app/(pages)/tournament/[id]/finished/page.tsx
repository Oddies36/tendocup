import prisma from "@/lib/prisma";
import { Quantico } from "next/font/google";
import { Trophy } from "lucide-react";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FinishedTournamentPage({ params }: Props) {
  const { id } = await params;
  const tournamentId = Number(id);

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: {
      id: true,
      title: true,
      status: true,
      firstPlace: { select: { name: true } },
      secondPlace: { select: { name: true } },
      thirdPlace: { select: { name: true } },
    },
  });

  if (!tournament)
    return (
      <main className="pt-24 text-center text-red-600">
        Tournoi introuvable.
      </main>
    );

  if (tournament.status !== "finished")
    return (
      <main className="pt-24 text-center text-gray-600">
        Ce tournoi n&apos;est pas encore terminé.
      </main>
    );

  const participants = await prisma.participants.findMany({
    where: { tournamentId },
    include: { player: true },
    orderBy: { points: "desc" },
  });

  const allGames = await prisma.tournamentGame.findMany({
    where: { tournamentId },
    select: {
      id: true,
      name: true,
      isTieBreaker: true,
    },
    orderBy: { id: "asc" },
  });

  const normalGames = allGames.filter((g) => !g.isTieBreaker);
  const tieBreakers = allGames.filter((g) => g.isTieBreaker);

  const teams = await prisma.team.findMany({
    where: { tournamentGame: { tournamentId } },
    include: {
      player: true,
      tournamentGame: { select: { id: true, name: true, isTieBreaker: true } },
    },
  });

  function getPlayerPointsForGame(playerId: number, gameId: number) {
    const team = teams.find(
      (t) => t.player.id === playerId && t.tournamentGame.id === gameId
    );
    return team ? team.pointsWon : 0;
  }

  const podium = [
    { label: "Premier", player: tournament.firstPlace?.name, color: "text-yellow-500" },
    { label: "Deuxième", player: tournament.secondPlace?.name, color: "text-gray-400" },
    { label: "Troisième", player: tournament.thirdPlace?.name, color: "text-yellow-800" },
  ];

  const others = participants.filter(
    (p) =>
      p.player.name !== tournament.firstPlace?.name &&
      p.player.name !== tournament.secondPlace?.name &&
      p.player.name !== tournament.thirdPlace?.name
  );

  return (
    <main className="pt-20">
      <div className="bg-stone-200">
        <h1
          className={`${quantico.className} text-[40px] text-center mb-5 p-10`}
        >
          {tournament.title ?? "Tendo Cup"}
        </h1>
      </div>

      <div className="p-2 md:p-0">
        <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-stone-200 shadow-md">
          <div className="border-l-4">
            <p className="ml-4 font-bold text-2xl">Participants</p>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {podium.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Trophy className={p.color} />
                  {p.label}: {p.player ?? "—"}
                </li>
              ))}
              <hr />
              {others.map((p) => (
                <li key={p.id} className="flex items-center gap-2 ml-7">
                  <Trophy className="text-stone-400" />
                  {p.player.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-stone-200 mt-4 shadow-md">
          <div className="border-l-4">
            <p className="ml-4 font-bold text-2xl">Jeux</p>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {normalGames.map((g) => (
                <li key={g.id} className="flex items-center ml-2">
                  {g.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-stone-200 mt-4 shadow-md">
          <div className="border-l-4">
            <p className="ml-4 font-bold text-2xl">Classement</p>
          </div>

          <div className="p-5 max-w-full overflow-x-auto">
            <table className="table-auto border-collapse border border-stone-400 text-center min-w-full">
              <thead className="bg-stone-200">
                <tr>
                  <th className="border border-stone-400 px-4 py-2">Joueur</th>
                  {normalGames.map((g) => (
                    <th
                      key={g.id}
                      className="border border-stone-400 px-4 py-2"
                    >
                      {g.name}
                    </th>
                  ))}
                  <th className="border border-stone-400 px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td className="border border-stone-400 px-4 py-2">
                      {p.player.name}
                    </td>
                    {normalGames.map((g) => (
                      <td
                        key={g.id}
                        className="border border-stone-400 px-4 py-2"
                      >
                        {getPlayerPointsForGame(p.player.id, g.id)}
                      </td>
                    ))}
                    <td className="border border-stone-400 px-4 py-2 font-semibold">
                      {p.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {tieBreakers.length > 0 && (
          <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-red-50 mt-4 shadow-md mb-4">
            <div className="border-l-4 border-red-600">
              <p className="ml-4 font-bold text-2xl text-red-700">
                {`Deathmatch en cas d'égalités`}
              </p>
            </div>

            <div className="p-5 space-y-6">
              {tieBreakers.map((g) => {
                const tieTeams = teams.filter(
                  (t) => t.tournamentGame.id === g.id
                );
                const sorted = [...tieTeams].sort(
                  (a, b) => b.pointsWon - a.pointsWon
                );

                return (
                  <div key={g.id}>
                    <p className="text-lg font-semibold mb-2">
                      {g.name}
                    </p>
                    <table className="table-auto border-collapse border border-stone-400 text-center min-w-[300px]">
                      <thead className="bg-stone-200">
                        <tr>
                          <th className="border border-stone-400 px-4 py-2">
                            Classement
                          </th>
                          <th className="border border-stone-400 px-4 py-2">
                            Joueur
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((t, i) => (
                          <tr key={t.id}>
                            <td className="border border-stone-400 px-4 py-2 font-semibold">
                              {i + 1}
                            </td>
                            <td className="border border-stone-400 px-4 py-2">
                              {t.player.name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-2 text-green-700 font-semibold">
                      Gagnant : {sorted[0]?.player.name ?? "Non défini"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
