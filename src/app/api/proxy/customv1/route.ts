import { NextRequest, NextResponse } from "next/server";
import { buildShokanRoles, parseShokanRoles, detectServerFullLabel, sortAccounts } from "@/lib/mapping";
import type { ProxyAccount, ServerKey, CharKey, SortBy, SortOrder } from "@/lib/mapping";

const SHOKAN_URL = "https://www.shokan.org";
const GAME_ID = 39;
const PAGE_SIZE = 20;

interface ShokanItem {
  code: string;
  roles: string;
  aa: number | null;
  bb: number | null;
}

async function fetchShokan(params: URLSearchParams, p: number): Promise<{ valid: boolean; content: ShokanItem[]; pages: number; pageNum: number }> {
  const pParams = new URLSearchParams(params);
  pParams.set("pageNum", String(p));
  pParams.set("page", String(p));
  const r = await fetch(`${SHOKAN_URL}/getAccount`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: pParams.toString(),
    signal: AbortSignal.timeout(15000),
  });
  return r.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const servers: ServerKey[] = body.servers || ["android_global"];
    const characters: CharKey[] = body.characters || [];
    const search = (body.search || "").trim();
    const sortBy: SortBy | undefined = body.sortBy;
    const sortOrder: SortOrder | undefined = body.sortOrder || "desc";
    const page = Math.max(1, parseInt(body.page) || 1);

    const roles = buildShokanRoles(servers, characters);
    const params = new URLSearchParams();
    params.set("accountId", search);
    params.set("gameId", String(GAME_ID));
    params.set("sort", "1");
    params.set("roles", roles);

    // Fetch page 1 first to get total pages count
    const first = await fetchShokan(params, 1);
    if (!first.valid || !first.content) {
      return NextResponse.json({ accounts: [], total: 0, page, totalPages: 0 });
    }

    const totalPagesFromVendor = first.pages || 1;

    // Fetch all pages in parallel (shokan has ~5-20 pages typically)
    const pagePromises: Promise<{ valid: boolean; content: ShokanItem[] }>[] = [];
    for (let p = 1; p <= totalPagesFromVendor; p++) {
      pagePromises.push(fetchShokan(params, p));
    }
    const allPageResults = await Promise.all(pagePromises);

    // Deduplicate globally across all pages
    const seen = new Map<string, ProxyAccount>();
    for (const res of allPageResults) {
      if (!res.valid || !res.content) continue;
      for (const item of res.content) {
        if (seen.has(item.code)) continue;
        seen.set(item.code, {
          code: item.code,
          server: detectServerFullLabel(item.roles),
          characters: parseShokanRoles(item.roles),
          diamonds: item.aa || 0,
          fragments: item.bb || 0,
          source: "customv1" as const,
        });
      }
    }

    // Sort globally, then paginate
    const allAccounts = sortAccounts([...seen.values()], sortBy, sortOrder);
    const total = allAccounts.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const accounts = allAccounts.slice(start, start + PAGE_SIZE);

    return NextResponse.json({ accounts, total, page, totalPages });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
