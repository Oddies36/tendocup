import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {

    const tournaments = await prisma.tournament.findMany({
      select: {
        id: true,
        date: true,
        location: true,
        numberPlayers: true,
        numberGames: true,
        status: true,
        firstPlaceId: true,
        secondPlaceId: true,
        thirdPlaceId: true
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error("Erreur lors de la récupération des tournois:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}