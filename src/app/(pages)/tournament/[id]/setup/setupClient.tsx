"use client";

import {
  Tournament,
  Game,
  Player,
  TournamentGame,
  Participants,
} from "@prisma/client";
import SetupGames from "./setupGames";
import SetupPlayers from "./setupPlayers";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SetupClientProps {
  tournament: Tournament;
  games: Game[];
  players: Player[];
  tournamentGames: TournamentGame[];
  tournamentPlayers: Participants[];
}

export default function SetupClient({
  tournament,
  games,
  players,
  tournamentGames,
}: SetupClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"players" | "games">("players");

  async function handleStartTournament() {
    if (
      !confirm("Voulez-vous lancer le tournoi?")
    )
      return;

    try {
      const res = await fetch("/api/tournament/start", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tournament.id }),
      });

      if (!res.ok) throw new Error("Erreur lors du lancement du tournoi");

      alert("Le tournoi a démarré");
      router.push(`/tournament/${tournament.id}/ongoing`);
    } catch (err) {
      alert("Impossible de lancer le tournoi : " + err);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-6 px-4 sm:px-6 lg:px-10 pb-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900">
          Configuration du tournoi
        </h1>

        <div className="md:hidden mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("players")}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === "players"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Joueurs
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === "games"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Jeux
          </button>
        </div>

        <div className={`${activeTab === "players" ? "block" : "hidden"} md:block`}>
          <SetupPlayers tournament={tournament} players={players} />
        </div>

        <div className={`${activeTab === "games" ? "block" : "hidden"} md:block`}>
          <SetupGames
            tournament={tournament}
            games={games}
            tournamentGames={tournamentGames}
          />
        </div>

        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={handleStartTournament}
            className="w-full sm:w-auto bg-green-700 text-white px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-800 transition shadow-lg"
          >
            Lancer le tournoi
          </button>
        </div>
      </div>
    </main>
  );
}