import { NextRequest, NextResponse } from "next/server";
import { getOpbrServer, buildOpbrCharsAny, buildOpbrCharsCandidates, parseOpbrChars, getServerFullLabel, sortAccounts } from "@/lib/mapping";
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
    const price: string | undefined = body.price;
    const page = Math.max(1, parseInt(body.page) || 1);

    const server = getOpbrServer(servers);
    const chars = buildOpbrCharsAny(characters);

    // ponytail: guard chars kosong cuma di route; upgrade path: validasi di page.tsx handleSearch.
    if (!chars && characters.length > 0) {
      return NextResponse.json({ error: "Character mapping failed", detail: characters }, { status: 400 });
    }
    // ponytail: vendor match strict string CN; English lolos = nol hasil. upgrade: map per-char + sebutkan yg gagal.
    if (/[A-Za-z]/.test(chars)) {
      return NextResponse.json({ error: "Character not supported by vendor", detail: characters }, { status: 400 });
    }

    const fetchVendor = async (charsParam: string) => {
      const url = new URL(`${OPBR_API}/search`);
      url.searchParams.set("server", server);
      if (charsParam) url.searchParams.set("characters", charsParam);
      if (search) url.searchParams.set("account_name", search);
      if (price) url.searchParams.set("price", price);
      console.log(`[customv2] Vendor request: ${url.toString()}`);
      const res = await fetch(url.toString(), {
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`[customv2] Vendor API error: ${res.status} ${text.slice(0, 200)}`);
        return { ok: false as const, error: `Vendor API returned ${res.status}`, raw: [] as any[] };
      }
      const json: unknown = await res.json();
      const raw: any[] = Array.isArray(json)
        ? json
        : Array.isArray((json as any)?.data)
          ? (json as any).data
          : Array.isArray((json as any)?.list)
            ? (json as any).list
            : [];
      if (!raw.length && !Array.isArray(json)) {
        console.error("[customv2] Vendor response is not an array:", JSON.stringify(json).slice(0, 200));
        return { ok: false as const, error: "Invalid vendor response format", raw: [] as any[] };
      }
      return { ok: true as const, raw };
    };

    // ponytail: alias query ganda per request — murah di sini krn kandidat biasanya 1-2.
    // upgrade path: cache hasil per kandidat di page.tsx bila vendor lambat.
    let rawAccounts: any[] = [];
    for (const candidate of buildOpbrCharsCandidates(characters)) {
      const r = await fetchVendor(candidate);
      if (!r.ok) {
        return NextResponse.json({ error: r.error }, { status: 502 });
      }
      rawAccounts = r.raw;
      if (rawAccounts.length) break;
    }

    // Vendor price tier already constrains GF range — no local min/max filter.
    const seen = new Map<string, ProxyAccount>();
    for (const a of rawAccounts) {
      const code: string = String(a.account_name ?? a.accountName ?? a.code ?? "");
      if (!code || seen.has(code)) continue;
      const charsRaw = Array.isArray(a.characters) ? a.characters.join("-") : (a.characters || "");
      seen.set(code, {
        code,
        server: getServerFullLabel(servers),
        characters: parseOpbrChars(charsRaw),
        diamonds: Number(a.diamonds ?? 0) || 0,
        fragments: Number(a.fragments ?? 0) || 0,
        source: "customv2" as const,
        char6: a.char6 != null ? String(a.char6) : undefined,
        price: a.calculatedPrice != null ? Number(a.calculatedPrice) || undefined : undefined,
      });
    }
    const accounts = sortAccounts([...seen.values()], sortBy, sortOrder);

    const total = accounts.length;
    const totalPages = Math.max(1, Math.ceil(total / 20));
    const start = (page - 1) * 20;
    return NextResponse.json({ accounts: accounts.slice(start, start + 20), total, page, totalPages });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy failed";
    console.error("[customv2] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
