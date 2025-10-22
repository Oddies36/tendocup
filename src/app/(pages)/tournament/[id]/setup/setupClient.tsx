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

  async function handleStartTournament() {
    if (
      !confirm("Voulez-vous lancer le tournoi ? Cette action est définitive.")
    )
      return;

    try {
      const res = await fetch("/api/tournament/start", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tournament.id }),
      });

      if (!res.ok) throw new Error("Erreur lors du lancement du tournoi");

      alert("Le tournoi a démarré !");
      router.push(`/tournament/${tournament.id}/ongoing`); // pas oublier de changer cette route!
    } catch (err) {
      alert("Impossible de lancer le tournoi : " + err);
    }
  }
  return (
    <main className="pt-30 px-10">
      <h1 className="text-2xl font-semibold mb-6">Configuration du tournoi</h1>

      <SetupPlayers tournament={tournament} players={players} />

      <SetupGames
        tournament={tournament}
        games={games}
        tournamentGames={tournamentGames}
      />

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleStartTournament}
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          Lancer le tournoi
        </button>
      </div>
    </main>
  );
}
