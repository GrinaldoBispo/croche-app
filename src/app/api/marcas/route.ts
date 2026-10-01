import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";

const TABLE = "MARCAS";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const data = await appsScriptGet({ table_name: TABLE, limit: searchParams.get("limit") || "200", offset: searchParams.get("offset") || "0" });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json(await appsScriptPost({ table_name: TABLE, ...body }));
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
