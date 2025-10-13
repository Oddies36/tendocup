import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UpdateTournamentBody {
  id: number;
  numberPlayers: string;
  numberGames: string;
  action: string;
  
}


export async function PATCH(req: NextRequest){

  const data = await req.json() as UpdateTournamentBody;

  switch (data.action) {
    case "updateNumberPlayers": {

      const response = await prisma.tournament.update({
        where: { id: data.id },
        data: { numberPlayers: Number(data.numberPlayers) }
      });
    
      return NextResponse.json(response);

    }
    case "updateNumberGames": {

      const response = await prisma.tournament.update({
        where: { id: data.id },
        data: { numberGames: Number(data.numberGames) }
      });
    
      return NextResponse.json(response);

    }
    default:
      return NextResponse.json( {error: "Action de mise à jour invalide"}, {status: 400});
  }

}