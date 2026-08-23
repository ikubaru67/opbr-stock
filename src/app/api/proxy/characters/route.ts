import { NextResponse } from "next/server";

const OPBR_API = "http://111.229.9.51:3001/api";

export async function GET() {
  try {
    const res = await fetch(`${OPBR_API}/characters`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
