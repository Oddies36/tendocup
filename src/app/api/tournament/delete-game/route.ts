import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  await prisma.tournamentGame.delete({ where: { id } });
  return NextResponse.json({ success: true });
}