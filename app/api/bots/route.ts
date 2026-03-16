import { NextResponse } from "next/server";
import { fetchVPS } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchVPS("/api/bots");
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "No se pudo conectar con la VPS", details: String(e) },
      { status: 502 }
    );
  }
}
