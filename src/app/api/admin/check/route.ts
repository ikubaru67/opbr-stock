import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const username = await verifyToken();
  return NextResponse.json({ admin: !!username });
}