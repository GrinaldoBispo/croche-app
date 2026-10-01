import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const raw = jar.get("croche_user")?.value;
  if (!raw) return NextResponse.json({ status: "error", message: "não logado" }, { status: 401 });
  try {
    const user = JSON.parse(Buffer.from(raw, "base64").toString());
    return NextResponse.json({ status: "success", ...user });
  } catch {
    return NextResponse.json({ status: "error", message: "sessão inválida" }, { status: 401 });
  }
}
