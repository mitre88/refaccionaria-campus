import { NextRequest, NextResponse } from "next/server";
import { fetchVPS } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params;
  const searchParams = req.nextUrl.searchParams;
  const phone = searchParams.get("phone") || "";
  const limit = searchParams.get("limit") || "200";
  const offset = searchParams.get("offset") || "0";

  const qs = `?limit=${limit}&offset=${offset}${phone ? `&phone=${encodeURIComponent(phone)}` : ""}`;

  try {
    const data = await fetchVPS(`/api/bots/${botId}/messages${qs}`);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "No se pudo obtener mensajes", details: String(e) },
      { status: 502 }
    );
  }
}
