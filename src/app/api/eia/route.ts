import { NextResponse } from "next/server";
import { fetchEiaData } from "@/lib/eia-client";

export async function GET() {
  try {
    const data = await fetchEiaData();
    return NextResponse.json({ data }, { headers: { "Cache-Control": "s-maxage=3600" } });
  } catch {
    return NextResponse.json({ error: "EIA unavailable" }, { status: 503 });
  }
}
