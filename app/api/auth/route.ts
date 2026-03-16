import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (validateCredentials(username, password)) {
    return NextResponse.json({ ok: true, user: username });
  }
  return NextResponse.json({ ok: false, error: "Credenciales incorrectas" }, { status: 401 });
}
