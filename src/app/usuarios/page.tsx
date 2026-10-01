"use client";
import { useEffect, useState } from "react";

type Usuario = { id: string; nome?: string; email?: string; ativo?: string; spreadsheet_url?: string };

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };

export default function UsuariosPage() {
  const [lista, setLista] = useState<Usuario[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", spreadsheet_url: "" });

  async function carregar() {
    setMsg("carregando...");
    const r = await fetch("/api/usuarios?limit=200", { cache: "no-store" });
    const j = await r.json();
    if (j.status === "error") setMsg(j.message);
    else {
      setLista(j.data || []);
      setMsg((j.total ?? 0) === 0 ? "nenhum usuário ainda" : `${j.total} encontrado(s)`);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("salvando...");
    const r = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        data: { nome: form.nome, email: form.email, ativo: "sim", spreadsheet_url: form.spreadsheet_url, criado_em: new Date().toISOString() },
      }),
    });
    const j = await r.json();
    if (j.status === "success") {
      setForm({ nome: "", email: "", spreadsheet_url: "" });
      await carregar();
    } else setMsg(j.message || "erro");
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Usuários</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input style={input} placeholder="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input style={input} placeholder="url da planilha do cliente (opcional)" inputMode="url" value={form.spreadsheet_url} onChange={(e) => setForm({ ...form, spreadsheet_url: e.target.value })} />
        <button style={btn} type="submit">Salvar usuário</button>
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((u) => (
          <li key={u.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <strong>{u.nome}</strong> · {u.email} · {u.ativo}
          </li>
        ))}
      </ul>
    </main>
  );
}
