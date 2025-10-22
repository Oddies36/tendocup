import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, playerId, tournamentId, points = 0 } = body;

    if (!playerId || !tournamentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let participant;

    if (id) {
      // Update existing participant (e.g. modify points)
      participant = await prisma.participants.update({
        where: { id },
        data: { playerId, points },
      });
    } else {
      // Create new participant
      participant = await prisma.participants.create({
        data: { playerId, tournamentId, points },
      });
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Error updating participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
