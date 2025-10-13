"use client";

import { Tournament, Game, Player } from "@prisma/client";
import { useState } from "react";

interface SetupClientProps {
  tournament: Tournament;
  games: Game[];
  players: Player[];
}

export default function SetupClient({
  tournament,
  games,
  players,
}: SetupClientProps) {
  const [open, setOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);

  const possibleNumPlayers = ["4", "6", "8"];
  const possibleNumGames = ["5", "6", "7", "8", "9", "10"];

  const [selectedNumberPlayers, setSelectedNumberPlayers] = useState(
    tournament.numberPlayers === null
      ? "Sélectionner..."
      : String(tournament.numberPlayers)
  );
  const [selectedNumberGames, setSelectedNumbergames] = useState(
    tournament.numberGames === null
      ? "Sélectionner..."
      : String(tournament.numberGames)
  );

  const [selections, setSelections] = useState<
    { gameId: number | null; teamSize: number | null }[]
  >(
    Array.from({ length: Number(selectedNumberGames) }, () => ({
      gameId: null,
      teamSize: null,
    }))
  );

  async function updateNumberPlayers(value: string) {
    try {
      const response = await fetch("/api/tournament/update-tournament", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateNumberPlayers",
          id: tournament.id,
          numberPlayers: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Problème lors de la mise à jour du nombre de joueurs");
      }
    } catch (error) {
      alert("Problème en mettant à jour le nombre de joueurs" + error);
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

      if (!response.ok) {
        throw new Error("Problème lors de la mise à jour du nombre de joueurs");
      }
    } catch (error) {
      alert("Problème en mettant à jour le nombre de joueurs" + error);
    }
  }

  async function updateGames(
    selectedGameId: number,
    selectedGameName: string,
    tournamentId: number,
    teamSize: number,
    numberPlayers: number
  ) {
    try {
      const response = await fetch("/api/tournament/update-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedGameName,
          gameId: selectedGameId,
          tournamentId: tournamentId,
          playersPerTeam: teamSize,
          numberOfTeams: numberPlayers / teamSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Problème lors de la mise à jour du jeu");
      }

      alert("Jeu ajouté avec succès !");
    } catch (error) {
      alert("Problème en mettant à jour le jeu : " + error);
    }
  }

  function getValidTeamSizes(numberPlayers: number): number[] {
    const teamSizes: number[] = [];

    for (let size = 1; size <= numberPlayers; size++) {
      if (numberPlayers % size === 0 && size !== numberPlayers) {
        teamSizes.push(size);
      }
    }

    return teamSizes;
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

  return (
    <main className="pt-30 px-10">
      <div className="flex items-center gap-4 mb-10">
        {/* Label */}
        <span className="text-gray-800 font-medium">
          Choisissez le nombre de joueurs :
        </span>

        {/* Dropdown container */}
        <div className="relative inline-block text-left w-48">
          {/* Dropdown button */}
          <button
            onClick={() => setOpen(!open)}
            className="bg-black/80 text-white px-4 py-2 w-48 rounded-md hover:bg-black transition flex justify-between items-center"
          >
            {selectedNumberPlayers}
            <svg
              className="ml-2 inline-block w-4 h-4"
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

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              {possibleNumPlayers.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedNumberPlayers(option);
                    setOpen(false);
                    updateNumberPlayers(option);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNumberPlayers !== "Sélectionner..." && (
        <div className="flex items-center gap-4">
          {/* Label */}
          <span className="text-gray-800 font-medium">
            Choisissez le nombre de jeux :
          </span>

          {/* Dropdown container */}
          <div className="relative inline-block text-left w-48">
            {/* Dropdown button */}
            <button
              onClick={() => setGamesOpen(!gamesOpen)}
              className="bg-black/80 text-white px-4 py-2 w-48 rounded-md hover:bg-black transition flex justify-between items-center"
            >
              {selectedNumberGames}
              <svg
                className="ml-2 inline-block w-4 h-4"
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

            {/* Dropdown menu */}
            {gamesOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                {possibleNumGames.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedNumbergames(option);
                      setGamesOpen(false);
                      updateNumberGames(option);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedNumberPlayers !== "Sélectionner..." &&
        selectedNumberGames !== "Sélectionner..." && (
          <div className="mt-5">
            {selections.map((selection, index) => (
              <div key={index} className="p-2 flex items-center gap-3">
                <label>Jeu {index + 1}</label>

                <select
                  className="border p-2 rounded w-60"
                  value={selection.gameId ?? ""}
                  onChange={(e) =>
                    handleChange(index, "gameId", e.target.value)
                  }
                >
                  <option value="">Sélectionner un jeu...</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>

                <label>Nombre Teams</label>

                <select
                  className="border p-2 rounded w-60"
                  value={selection.teamSize ?? ""}
                  onChange={(e) =>
                    handleChange(index, "teamSize", e.target.value)
                  }
                >
                  <option value="">Sélectionner un nombre...</option>
                  {getValidTeamSizes(Number(selectedNumberPlayers)).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size === 1 ? "Free for all" : `${size}v${size}`}
                      </option>
                    )
                  )}
                </select>

                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => {
                    const { gameId, teamSize } = selection;

                    if (!gameId || !teamSize) {
                      alert(
                        "Veuillez sélectionner un jeu et un nombre d'équipes."
                      );
                      return;
                    }

                    const selectedGame = games.find((g) => g.id === gameId);
                    if (!selectedGame) {
                      alert("Jeu introuvable.");
                      return;
                    }

                    updateGames(
                      gameId,
                      selectedGame.name,
                      tournament.id,
                      teamSize,
                      Number(selectedNumberPlayers)
                    );
                  }}
                >
                  Ajouter
                </button>
              </div>
            ))}
          </div>
        )}
    </main>
  );
}
