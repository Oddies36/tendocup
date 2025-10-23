"use client";

import { useEffect, useMemo, useState } from "react";
import { Tournament, Player } from "@prisma/client";

interface SetupPlayersProps {
  tournament: Tournament;
  players: Player[];
}

type Slot = { id: number | null; playerId: number | null };

export default function SetupPlayers({ tournament, players }: SetupPlayersProps) {
  const possibleNumPlayers = ["4", "6", "8"];

  const [selectedNumberPlayers, setSelectedNumberPlayers] = useState(
    tournament.numberPlayers == null ? "Sélectionner..." : String(tournament.numberPlayers)
  );
  const [open, setOpen] = useState(false);

  const [selections, setSelections] = useState<Slot[]>([]);

  useEffect(() => {
    refetchParticipants();
  }, [tournament.id, selectedNumberPlayers]);

  async function updateNumberPlayers(value: string) {
  try {
    setSelectedNumberPlayers(value);
    await fetch("/api/tournament/update-tournament", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateNumberPlayers",
        id: tournament.id,
        numberPlayers: value,
      }),
    });

    await resetParticipants(Number(value));
  } catch (error) {
    alert("Problème en mettant à jour le nombre de joueurs: " + error);
  }
}

async function resetParticipants(total: number) {
  try {
    await fetch(`/api/tournament/delete-all-participants?tournamentId=${tournament.id}`, {
      method: "DELETE",
    });

    const empty: Slot[] = Array.from({ length: total }, () => ({
      id: null,
      playerId: null,
    }));
    setSelections(empty);
  } catch (err) {
    console.error("Erreur reset participants:", err);
  }
}

async function refetchParticipants() {
  try {
    const res = await fetch(`/api/tournament/get-participants?tournamentId=${tournament.id}`);
    if (!res.ok) return;
    const data = await res.json();

    const total = Number(selectedNumberPlayers);
    if (!total || isNaN(total)) return;

    const existing: Slot[] = data.map((p: any) => ({
      id: p.id,
      playerId: p.playerId,
    }));

    const emptySlots = Array.from({ length: Math.max(total - existing.length, 0) }, () => ({
      id: null,
      playerId: null,
    }));

    setSelections([...existing, ...emptySlots]);
  } catch (err) {
    console.error("Erreur lors du chargement des participants:", err);
  }
}

  async function saveParticipant(id: number | null, playerId: number) {
    try {
      const response = await fetch("/api/tournament/update-participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, tournamentId: tournament.id, playerId }),
      });
      if (!response.ok) throw new Error("Erreur de mise à jour du participant");
      const result = await response.json();

      if (!id && result.id) {
        setSelections((prev) => {
          const updated = [...prev];
          const target = updated.find((s) => s.playerId === playerId && s.id === null);
          if (target) target.id = result.id;
          return updated;
        });
      }
    } catch (err) {
      alert("Problème en sauvegardant le participant : " + err);
    }
  }

  async function deleteParticipant(id: number | null) {
    if (!id) return;
    if (!confirm("Voulez-vous vraiment supprimer ce participant ?")) return;
    try {
      const res = await fetch(`/api/tournament/delete-participants?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression du participant");
      await refetchParticipants();
    } catch (err) {
      alert("Erreur de suppression : " + err);
    }
  }

  const chosenIds = useMemo(() => new Set(selections.map((s) => s.playerId).filter(Boolean) as number[]), [selections]);

  function handlePlayerSelect(index: number, value: string) {
    const playerId = value ? Number(value) : null;
    setSelections((prev) => {
      const next = [...prev];
      next[index].playerId = playerId;
      return next;
    });
    if (playerId) saveParticipant(selections[index].id, playerId);
  }

  return (
    <section className="mb-8 sm:mb-10">
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-gray-900">
          Sélection des joueurs
        </h2>
      

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <span className="text-gray-800 font-medium text-sm sm:text-base">
          Nombre de joueurs :
        </span>
        <div className="relative w-full sm:w-48">
          <button
            onClick={() => setOpen(!open)}
            className="bg-black/80 text-white px-4 py-2.5 w-full rounded-md flex justify-between items-center hover:bg-black transition"
          >
            <span>{selectedNumberPlayers}</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute left-0 right-0 sm:right-auto mt-2 w-full sm:w-48 bg-white border rounded-md shadow-lg z-50">
              {possibleNumPlayers.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedNumberPlayers(option);
                    setOpen(false);
                    updateNumberPlayers(option);
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

      {selectedNumberPlayers !== "Sélectionner..." && (
        <div className="space-y-3 sm:space-y-4">
          {selections.map((sel, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border"
            >
              <label className="text-sm sm:text-base font-medium text-gray-700 sm:w-24">
                Joueur {i + 1}
              </label>

              <select
                className="flex-1 border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sel.playerId ?? ""}
                onChange={(e) => handlePlayerSelect(i, e.target.value)}
              >
                <option value="">Sélectionner un joueur...</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id} disabled={chosenIds.has(p.id) && p.id !== sel.playerId}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                className="w-full sm:w-auto bg-red-600 text-white px-4 py-2.5 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => deleteParticipant(sel.id)}
                disabled={!sel.id}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
        
      )}
      </div>
    </section>
  );
}