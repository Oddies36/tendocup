import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tournamentId } = await req.json();
    if (!tournamentId)
      return NextResponse.json(
        { error: "ID du tournoi manquant." },
        { status: 400 }
      );

    // --- Load participants sorted by points ---
    const participants = await prisma.participants.findMany({
      where: { tournamentId },
      select: {
        id: true,
        playerId: true,
        points: true,
        player: { select: { name: true } },
      },
      orderBy: { points: "desc" },
    });

    if (participants.length === 0)
      return NextResponse.json({ message: "Aucun participant." });

    // --- Get distinct score values (desc) ---
    const uniqueScores = [...new Set(participants.map((p) => p.points))].sort(
      (a, b) => b - a
    );

    const top3Scores = uniqueScores.slice(0, 3);

    const top1Group = participants.filter((p) => p.points === top3Scores[0]);
    const top2Group =
      top3Scores[1] !== undefined
        ? participants.filter((p) => p.points === top3Scores[1])
        : [];
    const top3Group =
      top3Scores[2] !== undefined
        ? participants.filter((p) => p.points === top3Scores[2])
        : [];

    let tiedPlayers: typeof participants = [];

    // --- Detect tie only if it impacts top 3 podium positions ---
    if (top1Group.length > 1) {
      // Tie for 1st → only those players
      tiedPlayers = top1Group;
    } else if (top2Group.length > 1) {
      // Tie for 2nd → only those players
      tiedPlayers = top2Group;
    } else if (top3Group.length > 1) {
      // Tie for 3rd → only those players
      tiedPlayers = top3Group;
    }

    // --- No tie affecting top 3 → finish tournament ---
    if (tiedPlayers.length === 0) {
      await prisma.tournament.update({
        where: { id: tournamentId },
        data: { status: "finished" },
      });

      return NextResponse.json({
        status: "finished",
        message: "Top 3 unique. Tournoi terminé.",
      });
    }

    // --- Check if a tiebreaker already exists ---
    const existingTieBreaker = await prisma.tournamentGame.findFirst({
      where: { tournamentId, isTieBreaker: true },
    });

    if (existingTieBreaker) {
      return NextResponse.json({
        message: "Tie-breaker déjà créé.",
        tieBreakerId: existingTieBreaker.id,
      });
    }

    // --- Create the tiebreaker game ---
    const newGame = await prisma.tournamentGame.create({
      data: {
        name: "Deathmatch",
        numberOfTeams: tiedPlayers.length,
        playersPerTeam: 1,
        isTieBreaker: true,
        tournament: { connect: { id: tournamentId } },
      },
    });

    // --- Create single-player teams for each tied player ---
    const teamsData = tiedPlayers.map((p, index) => ({
      teamNumber: index + 1,
      playerId: p.playerId,
      tournamentGameId: newGame.id,
    }));

    await prisma.team.createMany({ data: teamsData });

    return NextResponse.json({
      message: "Match de départage créé.",
      tieBreakerId: newGame.id,
      players: tiedPlayers.map((p) => p.player.name),
    });
  } catch (error) {
    console.error("Erreur check-tie:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
