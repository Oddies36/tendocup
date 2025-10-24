"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Player {
  id: number;
  name: string;
}

interface Participant {
  id: number;
  points: number;
  player: Player;
}

interface Game {
  id: number;
  name: string;
  playersPerTeam: number;
  numberOfTeams: number;
}

interface Tournament {
  id: number;
  title: string | null;
  status: string;
}

interface Team {
  id: number;
  teamNumber: number;
  player: Player;
  pointsWon: number;
  tournamentGameId: number;
}

interface Props {
  tournament: Tournament;
  games: Game[];
  participants: Participant[];
}

export default function SetupClient({
  tournament,
  games,
  participants,
}: Props) {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(
    games[0] ?? null
  );
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Participant[]>(participants);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [rankings, setRankings] = useState<{ [key: number]: number }>({});
  const [message, setMessage] = useState("");
  const [validatedGames, setValidatedGames] = useState<number[]>([]);

  const isFFA = selectedGame?.playersPerTeam === 1;

  useEffect(() => {
    fetchAllTeams();
  }, []);

  async function fetchAllTeams() {
    try {
      const res = await fetch(
        `/api/teams/get-all?tournamentId=${tournament.id}`
      );
      const data = await res.json();
      setAllTeams(data);
    } catch (err) {
      console.error("Erreur chargement de toutes les équipes:", err);
    }
  }

  useEffect(() => {
    if (selectedGame) fetchTeams(selectedGame.id);
  }, [selectedGame]);

  async function fetchTeams(gameId: number) {
    try {
      const res = await fetch(
        `/api/teams/get-teams?tournamentGameId=${gameId}`
      );
      const data = await res.json();
      setTeams(data);

      const alreadyValidated = data.some((t: Team) => t.pointsWon > 0);
      setValidatedGames((prev) =>
        alreadyValidated
          ? [...new Set([...prev, gameId])]
          : prev.filter((id) => id !== gameId)
      );

      if (isFFA) {
        const ranks: { [key: number]: number } = {};
        for (const t of data) {
          if (t.pointsWon === 3) ranks[t.player.id] = 1;
          else if (t.pointsWon === 2) ranks[t.player.id] = 2;
          else if (t.pointsWon === 1) ranks[t.player.id] = 3;
        }
        setRankings(ranks);
      }

      if (!isFFA) {
        const winningTeam =
          data.find((t: Team) => t.pointsWon > 0)?.teamNumber ?? null;
        setSelectedTeam(winningTeam);
      }
    } catch (err) {
      console.error("Erreur chargement équipes:", err);
    }
  }

  async function fetchParticipants() {
  try {
    const res = await fetch(`/api/participants/get?tournamentId=${tournament.id}`);
    if (!res.ok) throw new Error("Erreur chargement participants");
    const data = await res.json();
    setPlayers(data);
  } catch (err) {
    console.error("Erreur lors du rechargement des participants:", err);
  }
}

async function handleFinishTournament() {
  if (!confirm("Voulez-vous vraiment terminer le tournoi ?")) return;

  const res = await fetch("/api/tournament/check-tie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tournamentId: tournament.id }),
  });

  const data = await res.json();

  if (data.status === "finished") {
    alert("Tournoi terminé !");
    router.push(`/tournament/${tournament.id}/finished`);
  } else if (data.tieBreakerId) {
    router.push(`/tournament/${tournament.id}/tiebreaker/${data.tieBreakerId}`);
  } else {
    console.log(data);
    alert("Erreur lors de la vérification des égalités.");
  }
}

  async function handleRandomize() {
    if (!selectedGame) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/teams/randomize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentGameId: selectedGame.id,
          tournamentId: tournament.id,
        }),
      });

      if (!res.ok) throw new Error("Erreur de randomisation");
      await fetchTeams(selectedGame.id);
      await fetchAllTeams();
      setMessage("Équipes randomisées !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la randomisation des équipes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectWinner() {
    if (!selectedGame) return;
    setLoading(true);
    setMessage("");

    try {
      if (isFFA) {
        const rankingsArray = Object.entries(rankings).map(([pid, rank]) => ({
          playerId: Number(pid),
          rank,
        }));

        if (rankingsArray.length < 3) {
          alert("Veuillez sélectionner les 3 premiers joueurs.");
          setLoading(false);
          return;
        }

        await fetch("/api/teams/select-winner", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tournamentGameId: selectedGame.id,
            rankings: rankingsArray,
          }),
        });
      } else {
        if (!selectedTeam) {
          alert("Veuillez sélectionner une équipe gagnante.");
          setLoading(false);
          return;
        }

        await fetch("/api/teams/select-winner", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tournamentGameId: selectedGame.id,
            teamNumber: selectedTeam,
          }),
        });
      }

      await Promise.all([
  fetchTeams(selectedGame.id),
  fetchAllTeams(),
  fetchParticipants(),
]);

      setMessage("Résultats enregistrés !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde des résultats.");
    } finally {
      setLoading(false);
    }
  }

  function getPlayerPointsForGame(playerId: number, gameId: number) {
    const team = allTeams.find(
      (t) => t.player.id === playerId && t.tournamentGameId === gameId
    );
    return team ? team.pointsWon : 0;
  }

  return (
    <main className="pt-24 px-4 space-y-10">
      <h1 className="text-center text-3xl font-semibold mb-6">
        {tournament.title ?? "Tendo Cup"}
      </h1>

      <section className="overflow-x-auto max-w-6xl mx-auto">
        <table className="min-w-full border text-sm text-center bg-white shadow-md rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Joueur</th>
              <th className="p-2 border">Total Points</th>
              {games.map((g) => (
                <th key={g.id} className="p-2 border">
                  {g.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{p.player.name}</td>
                <td className="p-2 border">{p.points}</td>
                {games.map((g) => (
                  <td key={g.id} className="p-2 border">
                    {getPlayerPointsForGame(p.player.id, g.id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex justify-center gap-3 flex-wrap">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedGame(g);
              setSelectedTeam(null);
              setRankings({});
            }}
            className={`px-4 py-2 rounded-md text-sm shadow-md transition ${
              selectedGame?.id === g.id
                ? "bg-rose-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {selectedGame && (
        <section className="bg-zinc-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {selectedGame.name}
          </h2>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleRandomize}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow-md disabled:opacity-50"
            >
              Randomiser les équipes
            </button>
          </div>

          {isFFA ? (
            <div>
              <p className="text-gray-700 mb-4 text-center">
                Sélectionnez les 3 premiers joueurs :
              </p>

              <div className="space-y-2">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between bg-white border p-2 rounded"
                  >
                    <span>{t.player.name}</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={rankings[t.player.id] || ""}
                      onChange={(e) => {
                        const rank = Number(e.target.value);
                        setRankings((prev) => {
                          const updated = { ...prev };
                          for (const [pid, r] of Object.entries(updated)) {
                            if (r === rank && Number(pid) !== t.player.id) {
                              delete updated[Number(pid)];
                            }
                          }
                          updated[t.player.id] = rank;
                          return updated;
                        });
                      }}
                    >
                      <option value="">—</option>
                      <option value="1">🥇 1er</option>
                      <option value="2">🥈 2e</option>
                      <option value="3">🥉 3e</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4 text-center">
                Sélectionnez l&apos;équipe gagnante :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from(new Set(teams.map((t) => t.teamNumber))).map(
                  (num) => (
                    <div
                      key={num}
                      className={`border rounded-lg p-3 shadow-sm bg-white transition cursor-pointer ${
                        selectedTeam === num
                          ? "ring-2 ring-rose-500 bg-rose-50"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTeam(num)}
                    >
                      <h3 className="font-semibold mb-2 text-center text-gray-800">
                        Équipe {num}
                      </h3>
                      <ul className="text-sm space-y-1">
                        {teams
                          .filter((t) => t.teamNumber === num)
                          .map((t) => (
                            <li key={t.id} className="text-center">
                              {t.player.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSelectWinner}
              disabled={loading || validatedGames.includes(selectedGame.id)}
              className={`px-5 py-2 rounded shadow-md transition ${
                validatedGames.includes(selectedGame.id)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {loading
                ? "Enregistrement..."
                : validatedGames.includes(selectedGame.id)
                ? "Déjà validé"
                : "Valider les résultats"}
            </button>
          </div>

          {message && (
            <p className="text-green-600 text-center mt-3 font-semibold">
              {message}
            </p>
          )}
        </section>
      )}
<div className="flex justify-center mt-10">
  <button
    onClick={handleFinishTournament}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow-md disabled:opacity-50"
  >
    Terminer le tournoi
  </button>
</div>
    </main>
  );
}
