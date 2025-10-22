import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "Missing participant id" }, { status: 400 });
    }

    await prisma.participants.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
