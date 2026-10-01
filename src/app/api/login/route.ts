import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ status: "error", message: "email obrigatório" }, { status: 400 });

    const base = await appsScriptGet({ table_name: "USUARIOS", limit: "500" });
    const lista = (base.data || []) as Array<{ id: string; email?: string; nome?: string; ativo?: string }>;
    const user = lista.find(
      (u) => String(u.email || "").toLowerCase() === String(email).toLowerCase() && String(u.ativo || "sim").toLowerCase() === "sim"
    );
    if (!user) return NextResponse.json({ status: "error", message: "usuário não cadastrado ou inativo" }, { status: 401 });

    await appsScriptPost({
      action: "create",
      table_name: "LOG_ACESSOS",
      data: { usuario_id: user.id, acao: "login", em: new Date().toISOString() },
    });

    return NextResponse.json({ status: "success", id: user.id, nome: user.nome });
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
