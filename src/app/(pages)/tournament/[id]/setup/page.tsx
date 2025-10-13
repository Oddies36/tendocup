import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { useState } from "react";

interface Props {
  params: { id: string };
}

export default async function Tournamentsetup({ params }: Props){
  const [open, setOpen] = useState(false);
  const tournamentId = Number(params.id);
  const [numberPlayers, setNumberPlayers] = useState(null);
  const [selectedNumberPlayers, setSelectedNumberPlayers] = useState("Sélectionner...");
  const possibleNumPlayers = ["4", "6", "8"];

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId, status: "setup" }
  });

  if(!tournament){
    notFound();
  }

  return(
    <main>

      { numberPlayers === null && (


        <div className="relative inline-block text-left">
      {/* Dropdown button */}
      <button onClick={() => setOpen(!open)} className="bg-black/80 text-white px-4 py-2 rounded-md hover:bg-black transition">
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
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
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
      )}

    </main>
  );
}