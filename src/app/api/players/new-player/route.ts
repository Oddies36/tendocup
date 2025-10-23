import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Le nom est obligatoire." },
        { status: 400 }
      );
    }

    const existing = await prisma.player.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "Ce joueur existe déjà." },
        { status: 400 }
      );
    }

    await prisma.player.create({ data: { name } });

    return NextResponse.json({ message: "Joueur ajouté avec succès." });
  } catch (err) {
    console.error("Erreur création joueur:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
