import prisma from "@/lib/prisma";
import { Quantico } from "next/font/google";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const dynamic = "force-dynamic";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });

export default async function GamesPage() {
  const session = await getServerSession(authOptions);

  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
<main className="pt-20">
  <div className="flex flex-col items-center mb-10">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <h1
        className={`${quantico.className} text-[40px] text-center`}
      >
        JEUX
      </h1>

      {session && (
        <Link href="/games/new-game">
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md shadow-md transition-all duration-300 text-sm">
            + Ajouter un jeu
          </button>
        </Link>
      )}
    </div>
  </div>

      <div className="content-center">
        <div className="max-w-6xl mx-auto p-4 grid place-items-center">
          {games.length === 0 ? (
            <p className="text-gray-500 italic">Aucun jeu enregistré.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((g) => (
                <div
                  key={g.id}
                  className="text-center border p-4 rounded-md bg-stone-200 w-60 h-40 transition duration-300 hover:scale-110 hover:border-red-400 shadow-md flex flex-col justify-center"
                >
                  <Gamepad2 className="text-red-600 mx-auto mb-2" size={28} />
                  <h2 className={`${quantico.className} text-[20px]`}>
                    {g.name}
                  </h2>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
