import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const characters = await prisma.character.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(characters);
}
