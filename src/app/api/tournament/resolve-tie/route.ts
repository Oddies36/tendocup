import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Ranking {
  id: string;
  playerId: number;
  playerName: string;
  rank: number;
  score: number;
}

export async function PATCH(req: NextRequest) {
  try {
    const { tournamentId, tournamentGameId, rankings } = await req.json();

    if (!tournamentId || !tournamentGameId || !rankings)
      return NextResponse.json(
        { error: "Paramètres manquants." },
        { status: 400 }
      );

    // --- Identify tied group from original tournament ---
    const participants = await prisma.participants.findMany({
      where: { tournamentId },
      orderBy: { points: "desc" },
      select: { id: true, playerId: true, points: true },
    });

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

    let tiedGroup: typeof participants = [];
    let anchorRank = 0;

    if (top1Group.length > 1) {
      tiedGroup = top1Group;
      anchorRank = 1;
    } else if (top2Group.length > 1) {
      tiedGroup = top2Group;
      anchorRank = 2;
    } else if (top3Group.length > 1) {
      tiedGroup = top3Group;
      anchorRank = 3;
    }

    if (tiedGroup.length === 0)
      return NextResponse.json({ message: "Aucune égalité à résoudre." });

    // --- Sort tied players according to tiebreaker result ---
    const sortedTie = rankings.sort((a: Ranking, b: Ranking) => a.rank - b.rank);

    // --- Assign tie-breaker points (for display only) ---
    const totalPlayers = sortedTie.length;
    for (const { playerId, rank } of sortedTie) {
      const pointsWon = totalPlayers - rank + 1; // 1st=N, 2nd=N-1, etc.
      await prisma.team.updateMany({
        where: { playerId, tournamentGameId },
        data: { pointsWon },
      });
    }

    // --- Build final ranking list ---
    const finalRanking: number[] = [];
    for (const p of participants) {
      if (tiedGroup.find((t) => t.playerId === p.playerId)) continue;
      finalRanking.push(p.playerId);
    }

    const anchorIndex = anchorRank - 1;
    const topBefore = finalRanking.slice(0, anchorIndex);
    const restAfter = finalRanking.slice(anchorIndex);
    const resolvedTies = sortedTie.map((r: Ranking) => r.playerId);
    const merged = [...topBefore, ...resolvedTies, ...restAfter];

    // --- Update tournament podium ---
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        status: "finished",
        firstPlaceId: merged[0] ?? null,
        secondPlaceId: merged[1] ?? null,
        thirdPlaceId: merged[2] ?? null,
      },
    });

    return NextResponse.json({
      status: "finished",
      message: "Résultats du tiebreaker appliqués.",
    });
  } catch (error) {
    console.error("Erreur resolve-tie:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
