import prisma from "@/lib/prisma";
import CurrentChampionClient from "./CurrentChampionClient";

export default async function CurrentChampion() {
  const champion = await prisma.player.findFirst({
    where: { lastWinner: true },
    select: { name: true },
  });

  return <CurrentChampionClient champion={champion} />;
}