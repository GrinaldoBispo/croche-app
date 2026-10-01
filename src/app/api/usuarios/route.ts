import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "200";
  const offset = searchParams.get("offset") || "0";
  try {
    const data = await appsScriptGet({ table_name: "USUARIOS", limit, offset });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await appsScriptPost({ table_name: "USUARIOS", ...body });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
