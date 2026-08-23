import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await prisma.account.findUnique({ where: { code: id } });
  if (!account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(account);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const username = await verifyToken();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const account = await prisma.account.update({
      where: { id },
      data: {
        code: String(body.code || ""),
        server: String(body.server || "Global"),
        characters: body.characters,
        diamonds: body.diamonds ?? 0,
        fragments: body.fragments ?? 0,
        diamondsText: String(body.diamondsText || ""),
        fragmentsText: String(body.fragmentsText || ""),
        price: body.price ?? 0,
        priceUsd: body.priceUsd ?? 0,
        priceUsdText: String(body.priceUsdText || ""),
        status: body.status,
        char6: String(body.char6 ?? "").trim(),
        os: String(body.os || ""),
        loginVia: String(body.loginVia || ""),
        randomCount: body.randomCount ?? 0,
      },
    });
    return NextResponse.json(account);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const username = await verifyToken();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.account.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to delete";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
