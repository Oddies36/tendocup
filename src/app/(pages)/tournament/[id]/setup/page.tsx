import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

import SetupClient from "./setupClient";

interface Props {
  params: { id: string };
}

export default async function Tournamentsetup({ params }: Props){
  
  const tournamentId = Number(params.id);

  

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId, status: "setup" }
  });

  if(!tournament){
    notFound();
  }

  return <SetupClient tournament={tournament} />
}