import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";
import { hashSenha } from "@/app/api/usuarios/route";

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json();
    if (!nome || !email || !senha) return NextResponse.json({ status: "error", message: "nome, email e senha obrigatórios" }, { status: 400 });

    const base = await appsScriptGet({ table_name: "USUARIOS", limit: "500" });
    const lista = (base.data || []) as Array<{ email?: string }>;
    if (lista.some((u) => String(u.email || "").toLowerCase() === String(email).toLowerCase()))
      return NextResponse.json({ status: "error", message: "email já cadastrado" }, { status: 409 });

    const result = await appsScriptPost({
      action: "create",
      table_name: "USUARIOS",
      data: { nome, email, senha_hash: hashSenha(email, String(senha)), papel: "user", ativo: "sim", criado_em: new Date().toISOString() },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
