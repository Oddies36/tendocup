import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tournamentId = Number(req.nextUrl.searchParams.get("tournamentId"));
    if (!tournamentId)
      return NextResponse.json({ error: "ID du tournoi manquant" }, { status: 400 });

    const teams = await prisma.team.findMany({
      where: { tournamentGame: { tournamentId } },
      include: { player: true },
    });

    return NextResponse.json(teams);
  } catch (err) {
    console.error("Erreur /get-all:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
