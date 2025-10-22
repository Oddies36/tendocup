import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { title, location } = await req.json();
  try {
    const newTournament = await prisma.tournament.create({
      data: {
        date: new Date(),
        status: "setup",
        location,
        title
      },
    });

    return NextResponse.json(newTournament);
  } catch (error) {
    console.error("Erreur lors de la création au niveau API. Erreur: ", error);
    return NextResponse.json(
      { error: "Erreur lors de la création au niveau API."},
      { status: 500 }
    );
  }
}
