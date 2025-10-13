import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

import SetupClient from "./setupClient";

interface Props {
  params: Promise<{ id: string}>;
}

export default async function Tournamentsetup({ params }: Props){

  const { id } = await params;
  
  const tournamentId = Number(id);

  

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId, status: "setup" }
  });

  const games = await prisma.game.findMany({
    select: { id: true, name: true}
  });

  const players = await prisma.player.findMany({
    select: {id: true, name: true, lastWinner: true}
  });

  if(!tournament){
    notFound();
  }

  return <SetupClient tournament={tournament} players={players} games={games} />
}