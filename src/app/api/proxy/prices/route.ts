import { NextRequest, NextResponse } from "next/server";

const OPBR_API = "http://111.229.9.51:3001/api";

// Tier GF dinamis — dibaca dari vendor via /api/getPriceConfig?server=..., bukan hardcoded.
// GET /api/proxy/prices?server=international|japan → { prices: string[] } (price_name apa adanya).
export async function GET(req: NextRequest) {
  try {
    const server = req.nextUrl.searchParams.get("server") || "international";
    const candidates = [
      `${OPBR_API}/getPriceConfig?server=${encodeURIComponent(server)}`,
      `${OPBR_API}/getPriceConfig`,
      `${OPBR_API}/prices`,
      `${OPBR_API}/price`,
      `${OPBR_API}/tiers`,
    ];
    const pick = (json: unknown): string[] => {
      const arr: unknown[] = Array.isArray(json)
        ? json
        : Array.isArray((json as any)?.data)
          ? (json as any).data
          : Array.isArray((json as any)?.prices)
            ? (json as any).prices
            : Array.isArray((json as any)?.list)
              ? (json as any).list
              : [];
      return arr
        .map((p) =>
          typeof p === "string"
            ? p
            : typeof (p as any)?.price_name === "string"
              ? (p as any).price_name
              : typeof (p as any)?.price === "string"
                ? (p as any).price
                : "",
        )
        .filter(Boolean);
    };
    for (const url of candidates) {
      try {
        const res = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) continue;
        const prices = pick(await res.json());
        if (prices.length) return NextResponse.json({ prices });
      } catch {
        continue;
      }
    }
    return NextResponse.json({ prices: [], error: "Vendor has no price-tier endpoint" }, { status: 502 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy failed";
    return NextResponse.json({ prices: [], error: msg }, { status: 500 });
  }
}
