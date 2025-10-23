import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { tournamentGameId, teamNumber, rankings } = await req.json();

    if (!tournamentGameId)
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });

    // Check game type
    const game = await prisma.tournamentGame.findUnique({
      where: { id: tournamentGameId },
      select: { playersPerTeam: true },
    });

    if (!game)
      return NextResponse.json({ error: "Jeu introuvable." }, { status: 404 });

    // Reset all teams for this game
    await prisma.team.updateMany({
      where: { tournamentGameId },
      data: { pointsWon: 0 },
    });

    if (game.playersPerTeam > 1) {
      // TEAM-BASED MODE (2v2, 4v4, etc.)
      if (!teamNumber)
        return NextResponse.json({ error: "Numéro d'équipe manquant." }, { status: 400 });

      // Mark the winning team
      await prisma.team.updateMany({
        where: { tournamentGameId, teamNumber },
        data: { pointsWon: 1 },
      });

      // Increment player tournament points
      const winners = await prisma.team.findMany({
        where: { tournamentGameId, teamNumber },
        select: { playerId: true },
      });

      for (const { playerId } of winners) {
        await prisma.participants.updateMany({
          where: { playerId },
          data: { points: { increment: 1 } },
        });
      }
    } else {
      // FREE-FOR-ALL MODE (solo)
      if (!rankings || !Array.isArray(rankings))
        return NextResponse.json({ error: "Classement manquant pour FFA." }, { status: 400 });

      const pointsMap: Record<number, number> = { 1: 3, 2: 2, 3: 1 };

      for (const { playerId, rank } of rankings) {
        const points = pointsMap[rank] ?? 0;

        await prisma.team.updateMany({
          where: { tournamentGameId, playerId },
          data: { pointsWon: points },
        });

        await prisma.participants.updateMany({
          where: { playerId },
          data: { points: { increment: points } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur select-winner:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
