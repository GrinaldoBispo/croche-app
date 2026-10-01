import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";

export function hashSenha(email: string, senha: string) {
  return createHash("sha256").update(`${email.trim().toLowerCase()}:${senha}`).digest("hex");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "200";
  const offset = searchParams.get("offset") || "0";
  try {
    const data = await appsScriptGet({ table_name: "USUARIOS", limit, offset });
    const clean = { ...(data as object), data: ((data as { data?: Array<Record<string, unknown>> }).data || []).map((u) => {
      const { senha_hash, ...rest } = u;
      return rest;
    }) };
    return NextResponse.json(clean);
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = { ...(body.data || {}) } as Record<string, unknown>;
    if (data.senha) {
      const email = String(data.email || body.email || "");
      if (!email) return NextResponse.json({ status: "error", message: "email obrigatório p/ senha" }, { status: 400 });
      data.senha_hash = hashSenha(email, String(data.senha));
      delete data.senha;
    }
    const payload = { ...body, data };
    if (!payload.table_name) payload.table_name = "USUARIOS";
    const result = await appsScriptPost(payload);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
