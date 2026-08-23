import { NextRequest, NextResponse } from "next/server";
import { getOpbrServer, buildOpbrCharsAny, parseOpbrChars, getServerFullLabel, sortAccounts } from "@/lib/mapping";
import type { ProxyAccount, ServerKey, SortBy, SortOrder } from "@/lib/mapping";

const OPBR_API = "http://111.229.9.51:3001/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const servers: ServerKey[] = body.servers || ["android_global"];
    const characters: string[] = body.characters || [];
    const search = (body.search || "").trim();
    const sortBy: SortBy | undefined = body.sortBy;
    const sortOrder: SortOrder | undefined = body.sortOrder || "desc";
    const minGf: number | undefined = body.minGf;
    const maxGf: number | undefined = body.maxGf;
    const price: string | undefined = body.price;
    const page = Math.max(1, parseInt(body.page) || 1);

    const server = getOpbrServer(servers);
    const chars = buildOpbrCharsAny(characters);

    const url = new URL(`${OPBR_API}/search`);
    url.searchParams.set("server", server);
    if (chars) url.searchParams.set("characters", chars);
    if (search) url.searchParams.set("account_name", search);
    if (price) url.searchParams.set("price", price);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    const rawAccounts: any[] = await res.json();
    const seen = new Map<string, ProxyAccount>();
    for (const a of rawAccounts || []) {
      if (seen.has(a.account_name)) continue;
      const frags = a.fragments || 0;
      if (minGf !== undefined && frags < minGf) continue;
      if (maxGf !== undefined && frags > maxGf) continue;
      seen.set(a.account_name, {
        code: a.account_name,
        server: getServerFullLabel(servers),
        characters: parseOpbrChars(a.characters || ""),
        diamonds: a.diamonds || 0,
        fragments: frags,
        source: "customv2" as const,
        char6: a.char6 ?? undefined,
        price: a.calculatedPrice ?? undefined,
      });
    }
    const accounts = sortAccounts([...seen.values()], sortBy, sortOrder);

    const total = accounts.length;
    const totalPages = Math.max(1, Math.ceil(total / 20));
    const start = (page - 1) * 20;
    return NextResponse.json({ accounts: accounts.slice(start, start + 20), total, page, totalPages });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
