import prisma from "@/lib/prisma";
import { Quantico } from "next/font/google";
import Link from "next/link";
import { Crown } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });

export default async function PlayersPage() {
  const session = await getServerSession(authOptions);

  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, lastWinner: true },
  });

  return (
<main className="pt-20">
  <div className="flex flex-col items-center mb-10">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <h1
        className={`${quantico.className} text-[40px] text-center`}
      >
        JOUEURS
      </h1>

      {session && (
        <Link href="/players/new-player">
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md shadow-md transition-all duration-300 text-sm">
            + Ajouter un joueur
          </button>
        </Link>
      )}
    </div>
  </div>

      <div className="content-center">
        <div className="max-w-6xl mx-auto p-4 grid place-items-center">
          {players.length === 0 ? (
            <p className="text-gray-500 italic">Aucun joueur enregistré.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="text-center border p-4 rounded-md bg-stone-200 w-60 h-40 transition duration-300 hover:scale-110 hover:border-red-400 shadow-md"
                >
                  <h2 className={`${quantico.className} text-[20px]`}>
                    {p.name}
                  </h2>
                  <div className="mt-3">
                    {p.lastWinner ? (
                      <div className="flex justify-center items-center gap-2 text-yellow-600 font-semibold">
                        <Crown size={18} />
                        <span>Champion</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Participant</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
