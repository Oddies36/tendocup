"use client";

import { Tournament } from "@prisma/client";
import { useState } from "react";

interface SetupClientProps {
  tournament: Tournament;
}

export default function SetupClient({ tournament }: SetupClientProps) {
  const [open, setOpen] = useState(false);
  const possibleNumPlayers = ["4", "6", "8"];
  const [numberPlayers, setNumberPlayers] = useState<number | null>(null);
  const [selectedNumberPlayers, setSelectedNumberPlayers] = useState("Sélectionner...");

  async function updateNumberPlayers(){
    try{
        const response = await fetch("/api/tournament/update-tournament", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: tournament.id,
                numberPlayers: numberPlayers
            })
        });
    }
    catch (error) {

    }
  }

  return (
    <main className="pt-30 px-10">
      {numberPlayers === null && (
        <div className="flex items-center gap-4">
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
    </main>
  );
}
