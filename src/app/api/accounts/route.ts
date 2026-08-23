import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { EX_CHAR_NAMES } from "@/lib/mapping";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const server = searchParams.get("server");
  const characters = searchParams.get("characters");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const source = searchParams.get("source");
  const rawStatus = searchParams.get("status");
  const status = rawStatus === null ? "available" : rawStatus;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (server) where.server = server;
  if (source) where.source = source;

  if (characters) {
    const charList = characters.split(",").map((c) => c.trim()).filter(Boolean);
    if (charList.length > 0) {
      if (charList.includes("random")) {
        where.randomCount = { gt: 0 };
      } else {
        where.characters = { hasSome: charList };
      }
    }
  }

  const extreme = searchParams.get("extreme");
  const isEx = extreme === "1" || extreme === "ex";
  const isNoEx = extreme === "0" || extreme === "noex";
  if (isEx) where.OR = [{ characters: { hasSome: EX_CHAR_NAMES } }, { randomCount: { gt: 0 } }];
  if (isNoEx) where.NOT = { OR: [{ characters: { hasSome: EX_CHAR_NAMES } }, { randomCount: { gt: 0 } }] };

  if (search) {
    where.code = { contains: search, mode: "insensitive" };
  }

  const orderBy: Record<string, string> = {};
  const allowedSort = ["price", "diamonds", "fragments", "createdAt", "updatedAt", "code"];
  const field = allowedSort.includes(sortBy) ? sortBy : "updatedAt";
  orderBy[field] = sortOrder === "asc" ? "asc" : "desc";

  const [accounts, total] = await Promise.all([
    prisma.account.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.account.count({ where }),
  ]);

  return NextResponse.json({
    accounts,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  const username = await verifyToken();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const account = await prisma.account.create({
      data: {
        code: String(body.code || ""),
        server: String(body.server || "Global"),
        characters: body.characters || [],
        diamonds: Number(body.diamonds) || 0,
        fragments: Number(body.fragments) || 0,
        diamondsText: String(body.diamondsText || ""),
        fragmentsText: String(body.fragmentsText || ""),
        price: Number(body.price) || 0,
        priceUsd: Number(body.priceUsd) || 0,
        priceUsdText: String(body.priceUsdText || ""),
        source: String(body.source || "own"),
        char6: String(body.char6 ?? "").trim(),
        os: String(body.os || ""),
        loginVia: String(body.loginVia || ""),
        randomCount: Number(body.randomCount) || 0,
      },
    });
    return NextResponse.json(account, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create account";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
