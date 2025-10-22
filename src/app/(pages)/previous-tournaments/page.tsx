import { Quantico } from "next/font/google";
import Link from "next/link";
import prisma from "@/lib/prisma";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });




export default async function Previoustournaments() {

    const tournaments = await prisma.tournament.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        numberPlayers: true,
        numberGames: true,
        status: true,
        firstPlaceId: true,
        secondPlaceId: true,
        thirdPlaceId: true
      },
      orderBy: { date: "asc" },
    });

  return (
    <main className="pt-20">
      {/* Div titre */}
      <div>
        <h1 className={`${quantico.className} text-[40px] text-center p-10 mb-5`}>
          TOURNOIS PRÉCÉDENTS
        </h1>
      </div>
      {/* Div body */}
      <div className="content-center">
        <div className="max-w-6xl mx-auto p-4 grid place-items-center">

          {/* Div totalité des cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">



            {
              tournaments.map((t) => (
                <div key={t.id}>
                  <Link href={`/previous-tournaments/${t.title}`}>
                    <div className="text-center cursor-pointer border p-4 rounded-md bg-stone-200 w-60 h-40 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:border-red-400 shadow-md">
                        <div className="text-center mb-2">
                          <h2 className={`${quantico.className} text-[20px] `}>{t.title}</h2>
                        </div>
                        <p>Date: {t.date.toLocaleDateString("fr-FR")}</p>
                        <p>Location: {t.location}</p>
                    </div>
                  </Link>
                </div>
              ))
            }













          </div>
        </div>
        </div>
    </main>
  );
}
