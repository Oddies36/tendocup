import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tournamentGameId, tournamentId } = await req.json();

    if (!tournamentGameId || !tournamentId) {
      return NextResponse.json(
        { error: "Paramètres manquants." },
        { status: 400 }
      );
    }

    const game = await prisma.tournamentGame.findUnique({
      where: { id: tournamentGameId },
      select: {
        numberOfTeams: true,
        playersPerTeam: true,
      },
    });

    if (!game)
      return NextResponse.json({ error: "Jeu introuvable." }, { status: 404 });

    const participants = await prisma.participants.findMany({
      where: { tournamentId },
      select: { playerId: true },
    });

    if (participants.length === 0)
      return NextResponse.json(
        { error: "Aucun participant trouvé pour ce tournoi." },
        { status: 404 }
      );

    // Nombre total de places dans le jeu
    const totalSlots = game.numberOfTeams * game.playersPerTeam;

    if (participants.length < totalSlots) {
      return NextResponse.json(
        {
          error: `Pas assez de joueurs (${participants.length}) pour remplir ${totalSlots} places.`,
        },
        { status: 400 }
      );
    }

    // Mélange aléatoire des joueurs
    const shuffled = [...participants].sort(() => Math.random() - 0.5);

    const teamsData: {
      teamNumber: number;
      playerId: number;
      tournamentGameId: number;
    }[] = [];

    let index = 0;
    for (let teamNum = 1; teamNum <= game.numberOfTeams; teamNum++) {
      const members = shuffled.slice(index, index + game.playersPerTeam);
      for (const member of members) {
        teamsData.push({
          teamNumber: teamNum,
          playerId: member.playerId,
          tournamentGameId,
        });
      }
      index += game.playersPerTeam;
    }

    // Supprime les anciennes équipes avant de réinsérer les nouvelles
    await prisma.team.deleteMany({
      where: { tournamentGameId },
    });

    await prisma.team.createMany({
      data: teamsData,
    });

    const updatedTeams = await prisma.team.findMany({
      where: { tournamentGameId },
      include: { player: true },
      orderBy: { teamNumber: "asc" },
    });

    return NextResponse.json({ success: true, teams: updatedTeams });
  } catch (error) {
    console.error("Erreur randomize:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
