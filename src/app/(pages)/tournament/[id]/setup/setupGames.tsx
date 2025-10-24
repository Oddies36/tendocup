"use client";

import { useEffect, useState } from "react";
import { Tournament, Game, TournamentGame } from "@prisma/client";

interface SetupGamesProps {
  tournament: Tournament;
  games: Game[];
  tournamentGames: TournamentGame[];
}

export default function SetupGames({ tournament, games }: SetupGamesProps) {
  const possibleNumGames = ["5", "6", "7", "8", "9", "10"];

  const [selectedNumberGames, setSelectedNumberGames] = useState(
    tournament.numberGames == null
      ? "Sélectionner..."
      : String(tournament.numberGames)
  );
  const [gamesOpen, setGamesOpen] = useState(false);

  const [selections, setSelections] = useState<
    { id: number | null; gameId: number | null; teamSize: number | null }[]
  >([]);

  useEffect(() => {
    async function refreshTournament() {
      const res = await fetch(`/api/tournament/get?id=${tournament.id}`);
      if (!res.ok) return;
      const data = await res.json();
      tournament.numberPlayers = data.numberPlayers;
    }
    refreshTournament();
  }, [tournament.id, selectedNumberGames]);

  useEffect(() => {
    refetchGames();
  }, [tournament.id, selectedNumberGames]);

  async function refetchGames() {
    try {
      const res = await fetch(
        `/api/tournament/get-games?tournamentId=${tournament.id}`
      );
      if (!res.ok) return;
      const data = await res.json();

      const totalGames = Number(selectedNumberGames);
      if (!totalGames || isNaN(totalGames)) return;

      const existingSelections = data.map(
        (g: {
          id: string | number;
          gameId: string | number;
          playersPerTeam: number;
        }) => ({
          id: g.id,
          gameId: g.gameId,
          teamSize: g.playersPerTeam,
        })
      );

      const remaining = Math.max(totalGames - existingSelections.length, 0);
      const empty = Array.from({ length: remaining }, () => ({
        id: null,
        gameId: null,
        teamSize: null,
      }));

      setSelections([...existingSelections, ...empty]);
    } catch (err) {
      console.error("Erreur de rechargement des jeux:", err);
    }
  }

  async function updateNumberGames(value: string) {
    try {
      const response = await fetch("/api/tournament/update-tournament", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateNumberGames",
          id: tournament.id,
          numberGames: value,
        }),
      });
      if (!response.ok)
        throw new Error("Erreur de mise à jour du nombre de jeux");
    } catch (error) {
      alert("Problème en mettant à jour le nombre de jeux: " + error);
    }
  }

  async function saveGameRow(
    id: number | null,
    selectedGameId: number,
    selectedGameName: string,
    teamSize: number
  ) {
    try {
      const numPlayers = Number(tournament.numberPlayers);
      const numTeams = numPlayers / teamSize;
      const response = await fetch("/api/tournament/update-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: selectedGameName,
          gameId: selectedGameId,
          tournamentId: tournament.id,
          playersPerTeam: teamSize,
          numberOfTeams: numTeams,
        }),
      });
      if (!response.ok)
        throw new Error("Problème lors de la mise à jour du jeu");
      const result = await response.json();
      if (!id && result.id) {
        setSelections((prev) => {
          const updated = [...prev];
          const m = updated.find(
            (s) => s.gameId === selectedGameId && s.teamSize === teamSize
          );
          if (m) m.id = result.id;
          return updated;
        });
      }
    } catch (error) {
      alert("Problème en mettant à jour le jeu : " + error);
    }
  }

  async function deleteGame(id: number | null) {
    if (!id) return;
    if (!confirm("Voulez-vous vraiment supprimer ce jeu ?")) return;
    try {
      const res = await fetch(`/api/tournament/delete-game?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du jeu");
      await refetchGames();
    } catch (err) {
      alert("Problème en supprimant le jeu : " + err);
    }
  }

  function handleChange(
    index: number,
    field: "gameId" | "teamSize",
    value: string
  ) {
    const updated = [...selections];
    updated[index][field] = value ? Number(value) : null;
    setSelections(updated);
  }

  function getValidTeamSizes(): number[] {
    const numPlayers = Number(tournament.numberPlayers);
    const sizes: number[] = [];
    if (!numPlayers || isNaN(numPlayers)) return sizes;
    for (let i = 1; i < numPlayers; i++)
      if (numPlayers % i === 0) sizes.push(i);
    return sizes;
  }

  return (
    <section className="mt-8 sm:mt-10">
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-gray-900">
          Sélection des jeux
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <span className="text-gray-800 font-medium text-sm sm:text-base">
            Nombre de jeux :
          </span>
          <div className="relative w-full sm:w-48">
            <button
              onClick={() => setGamesOpen(!gamesOpen)}
              className="bg-black/80 text-white px-4 py-2.5 w-full rounded-md flex justify-between items-center hover:bg-black transition"
            >
              <span>{selectedNumberGames}</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {gamesOpen && (
              <div className="absolute left-0 right-0 sm:right-auto mt-2 w-full sm:w-48 bg-white border rounded-md shadow-lg z-50">
                {possibleNumGames.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedNumberGames(option);
                      setGamesOpen(false);
                      updateNumberGames(option);
                    }}
                    className="block w-full text-left px-4 py-2.5 hover:bg-gray-100 transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedNumberGames !== "Sélectionner..." && (
          <div className="space-y-4 sm:space-y-5">
            {selections.map((sel, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border"
              >
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Jeu {i + 1}
                </label>

                <div className="flex flex-col gap-3">
                  <select
                    className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={sel.gameId ?? ""}
                    onChange={(e) => handleChange(i, "gameId", e.target.value)}
                  >
                    <option value="">Sélectionner un jeu...</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={sel.teamSize ?? ""}
                    onChange={(e) =>
                      handleChange(i, "teamSize", e.target.value)
                    }
                  >
                    <option value="">
                      Sélectionner taille d&apos;équipe...
                    </option>
                    {getValidTeamSizes().map((s) => (
                      <option key={s} value={s}>
                        {s === 1 ? "Free for all" : `${s}v${s}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition"
                    onClick={() => {
                      if (!sel.gameId || !sel.teamSize) {
                        alert("Veuillez compléter les champs");
                        return;
                      }
                      const g = games.find((x) => x.id === sel.gameId);
                      if (!g) return;
                      saveGameRow(sel.id, sel.gameId, g.name, sel.teamSize);
                    }}
                  >
                    Ajouter
                  </button>

                  <button
                    className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => deleteGame(sel.id)}
                    disabled={!sel.id}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
