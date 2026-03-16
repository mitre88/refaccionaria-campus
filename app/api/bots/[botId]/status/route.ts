import { NextRequest, NextResponse } from "next/server";
import { fetchVPS } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params;
  try {
    const data = await fetchVPS(`/api/bots/${botId}/status`);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "No se pudo obtener estado", details: String(e) },
      { status: 502 }
    );
  }
}
