import { requireAuth } from "@/lib/auth";
import { Quantico } from "next/font/google";
import AddGameClient from "./AddGameClient";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });

export default async function NewGamePage() {
  await requireAuth();

  return (
    <main className="pt-20 flex flex-col items-center">
      <h1 className={`${quantico.className} text-[40px] mb-8`}>
        AJOUTER UN JEU
      </h1>
      <AddGameClient />
    </main>
  );
}
