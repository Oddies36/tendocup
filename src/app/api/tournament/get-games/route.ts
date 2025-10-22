import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/tournament/get-games?tournamentId=123
 * Récupère la liste des jeux associés à un tournoi donné.
 */
export async function GET(req: NextRequest) {
  try {
    const tournamentIdParam = req.nextUrl.searchParams.get("tournamentId");

    if (!tournamentIdParam || isNaN(Number(tournamentIdParam))) {
      return NextResponse.json(
        { error: "Paramètre 'tournamentId' manquant ou invalide." },
        { status: 400 }
      );
    }

    const tournamentId = Number(tournamentIdParam);

    const tournamentGames = await prisma.tournamentGame.findMany({
      where: { tournamentId },
      select: {
        id: true,
        name: true,
        gameId: true,
        playersPerTeam: true,
        numberOfTeams: true,
        tournamentId: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(tournamentGames);
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux du tournoi:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}