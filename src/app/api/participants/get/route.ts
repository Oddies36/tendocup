import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tournamentId = Number(req.nextUrl.searchParams.get("tournamentId"));
  if (!tournamentId) {
    return NextResponse.json({ error: "ID du tournoi manquant." }, { status: 400 });
  }

  const participants = await prisma.participants.findMany({
    where: { tournamentId },
    include: { player: true },
    orderBy: { points: "desc" },
  });

  return NextResponse.json(participants);
}
