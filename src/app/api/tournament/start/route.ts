import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing tournament ID" }, { status: 400 });
    }

    const tournament = await prisma.tournament.update({
      where: { id },
      data: { status: "ongoing" },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error starting tournament:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
