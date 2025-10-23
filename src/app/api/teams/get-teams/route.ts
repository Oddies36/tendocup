import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tournamentGameId = Number(req.nextUrl.searchParams.get("tournamentGameId"));
    if (!tournamentGameId)
      return NextResponse.json({ error: "ID du jeu manquant." }, { status: 400 });

    const teams = await prisma.team.findMany({
      where: { tournamentGameId },
      include: { player: true },
      orderBy: [{ teamNumber: "asc" }, { id: "asc" }],
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Erreur get-teams:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
