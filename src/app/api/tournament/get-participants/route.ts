import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const tournamentId = Number(req.nextUrl.searchParams.get("tournamentId"));
    if (!tournamentId) {
      return NextResponse.json({ error: "Missing tournamentId" }, { status: 400 });
    }

    const participants = await prisma.participants.findMany({
      where: { tournamentId },
      select: {
        id: true,
        tournamentId: true,
        playerId: true,
        points: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
