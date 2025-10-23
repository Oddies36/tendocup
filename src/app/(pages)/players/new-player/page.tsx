import { requireAuth } from "@/lib/auth";
import { Quantico } from "next/font/google";
import AddPlayerClient from "./AddPlayerClient";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });

export default async function NewPlayerPage() {
  await requireAuth();

  return (
    <main className="pt-20 flex flex-col items-center">
      <h1 className={`${quantico.className} text-[40px] mb-8`}>
        AJOUTER UN JOUEUR
      </h1>
      <AddPlayerClient />
    </main>
  );
}
