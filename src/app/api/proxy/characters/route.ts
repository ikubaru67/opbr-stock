import { NextResponse } from "next/server";

const OPBR_API = "http://111.229.9.51:3001/api";

export async function GET() {
  try {
    const res = await fetch(`${OPBR_API}/characters`, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[proxy/characters] Vendor API error: ${res.status} ${text.slice(0, 200)}`);
      return NextResponse.json({ error: `Vendor API returned ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy failed";
    console.error("[proxy/characters] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
