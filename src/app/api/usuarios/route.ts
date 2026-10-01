import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";

export function hashSenha(email: string, senha: string) {
  return createHash("sha256").update(`${email.trim().toLowerCase()}:${senha}`).digest("hex");
}

async function papelSessao() {
  try {
    const jar = await cookies();
    const raw = jar.get("croche_user")?.value;
    if (!raw) return null;
    return (JSON.parse(Buffer.from(raw, "base64").toString()) as { papel?: string }).papel || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  if ((await papelSessao()) !== "admin")
    return NextResponse.json({ status: "error", message: "somente admin" }, { status: 403 });
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
  if ((await papelSessao()) !== "admin")
    return NextResponse.json({ status: "error", message: "somente admin" }, { status: 403 });
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
