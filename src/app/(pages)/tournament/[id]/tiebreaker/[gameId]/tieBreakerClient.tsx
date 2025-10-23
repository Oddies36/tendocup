"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Player {
  id: number;
  name: string;
}

interface Team {
  id: number;
  teamNumber: number;
  player: Player;
}

interface Game {
  id: number;
  name: string;
}

interface Tournament {
  id: number;
  title: string | null;
  status: string;
}

interface Props {
  tournament: Tournament;
  game: Game;
  teams: Team[];
  allGames: Game[];
}

export default function TieBreakerClient({
  tournament,
  game,
  teams,
  allGames,
}: Props) {
  const router = useRouter();
  const [rankings, setRankings] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  async function handleSelectGame(gameId: number) {
    setSelectedGameId(gameId);
    const selected = allGames.find((g) => g.id === gameId);
    if (!selected) return;

    try {
      await fetch("/api/tournament/update-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: game.id,
          gameId: selected.id,
          name: selected.name,
          tournamentId: tournament.id,
          playersPerTeam: 1,
          numberOfTeams: teams.length,
        }),
      });
      setMessage(`Jeu sélectionné : ${selected.name}`);
    } catch {
      alert("Erreur lors de la sélection du jeu.");
    }
  }

  async function handleValidateResults() {
    if (loading) return;
    setLoading(true);
    setMessage("");

    const rankingsArray = Object.entries(rankings).map(([pid, rank]) => ({
      playerId: Number(pid),
      rank,
    }));

    if (rankingsArray.length < teams.length) {
      if (!confirm("Tous les joueurs n'ont pas été classés. Continuer ?")) {
        setLoading(false);
        return;
      }
    }

    const res = await fetch("/api/tournament/resolve-tie", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournamentId: tournament.id,
        tournamentGameId: game.id,
        rankings: rankingsArray,
      }),
    });

    const data = await res.json();

    if (data.status === "finished") {
      alert("Tournoi terminé !");
      router.push(`/tournament/${tournament.id}/finished`);
    } else {
      setMessage("Résultats enregistrés !");
    }

    setLoading(false);
  }

  return (
    <section className="bg-zinc-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {game.name}
      </h2>

      <div className="mb-6 text-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner le jeu pour ce match :
        </label>
        <select
          className="border rounded px-3 py-2"
          value={selectedGameId ?? ""}
          onChange={(e) => handleSelectGame(Number(e.target.value))}
        >
          <option value="">— Choisir un jeu —</option>
          {allGames.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-gray-700 mb-4 text-center">
        Classez les joueurs :
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
              {Array.from({ length: teams.length }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}e
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleValidateResults}
          disabled={loading}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded shadow-md disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Valider les résultats"}
        </button>
      </div>

      {message && (
        <p className="text-green-600 text-center mt-3 font-semibold">
          {message}
        </p>
      )}
    </section>
  );
}
