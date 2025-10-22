import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UpdateTournamentGameBody {
  id: number;
  gameId: number;
  name: string;
  tournamentId: number;
  playersPerTeam: number;
  numberOfTeams: number;
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as UpdateTournamentGameBody;

    if (
      !data.gameId ||
      !data.name ||
      !data.tournamentId ||
      !data.playersPerTeam ||
      !data.numberOfTeams
    ) {
      return NextResponse.json(
        { error: "Champs manquants dans la requête." },
        { status: 400 }
      );
    }

    if(data?.id){

      const updatedTournamentGame = await prisma.tournamentGame.update({
        data: {
          gameId: data.gameId,
          name: data.name,
          tournamentId: data.tournamentId,
          playersPerTeam: data.playersPerTeam,
          numberOfTeams: data.numberOfTeams,
        },
        where: {
          id: data.id
        }
      });

      return NextResponse.json(updatedTournamentGame);

    }

      const newTournamentGame = await prisma.tournamentGame.create({
        data: {
          gameId: data.gameId,
          name: data.name,
          tournamentId: data.tournamentId,
          playersPerTeam: data.playersPerTeam,
          numberOfTeams: data.numberOfTeams,
        },
      });
  
      return NextResponse.json(newTournamentGame);

  } catch (error) {
    console.error("Erreur lors de la création du tournoi :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
