import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";
import { hashSenha } from "@/app/api/usuarios/route";

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();
    if (!email || !senha) return NextResponse.json({ status: "error", message: "email e senha obrigatórios" }, { status: 400 });

    const base = await appsScriptGet({ table_name: "USUARIOS", limit: "500" });
    const lista = (base.data || []) as Array<{ id: string; email?: string; nome?: string; ativo?: string; papel?: string; senha_hash?: string }>;
    const user = lista.find((u) => String(u.email || "").toLowerCase() === String(email).toLowerCase());

    if (!user || String(user.ativo || "sim").toLowerCase() !== "sim")
      return NextResponse.json({ status: "error", message: "usuário não cadastrado ou inativo" }, { status: 401 });
    if (!user.senha_hash || user.senha_hash !== hashSenha(email, String(senha)))
      return NextResponse.json({ status: "error", message: "senha inválida" }, { status: 401 });

    await appsScriptPost({
      action: "create",
      table_name: "LOG_ACESSOS",
      data: { usuario_id: user.id, acao: "login", em: new Date().toISOString() },
    });

    return NextResponse.json({ status: "success", id: user.id, nome: user.nome, papel: user.papel || "user" });
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
