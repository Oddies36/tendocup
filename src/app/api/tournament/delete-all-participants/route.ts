import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tournamentId = Number(searchParams.get("tournamentId"));
  if (!tournamentId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  await prisma.participants.deleteMany({
    where: { tournamentId },
  });

  return NextResponse.json({ message: "Participants supprimés." });
}
