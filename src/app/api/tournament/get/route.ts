import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tournamentId = Number(req.nextUrl.searchParams.get("id"));
    if (!tournamentId)
      return NextResponse.json(
        { error: "ID du tournoi manquant." },
        { status: 400 }
      );

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        title: true,
        numberPlayers: true,
        numberGames: true,
        status: true,
      },
    });

    if (!tournament)
      return NextResponse.json(
        { error: "Tournoi introuvable." },
        { status: 404 }
      );

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Erreur GET /api/tournament/get:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
