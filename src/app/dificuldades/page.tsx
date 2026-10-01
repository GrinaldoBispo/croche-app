"use client";
import { useEffect, useState } from "react";

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };

export default function DificuldadesPage() {
  const [lista, setLista] = useState<Array<{ id: string; nome?: string; fator_multiplicador?: number }>>([]);
  const [form, setForm] = useState({ nome: "", fator_multiplicador: "", descricao: "" });
  const [msg, setMsg] = useState("");

  async function carregar() {
    const r = await fetch("/api/dificuldades?limit=200", { cache: "no-store" });
    const j = await r.json();
    setLista(j.data || []);
    setMsg(`${j.total ?? 0} dificuldade(s)`);
  }
  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/dificuldades", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", data: { ...form, fator_multiplicador: Number(form.fator_multiplicador) } }),
    });
    const j = await r.json();
    if (j.status === "success") { setForm({ nome: "", fator_multiplicador: "", descricao: "" }); carregar(); } else setMsg(j.message);
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Dificuldades</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome (ex: Fácil)" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input style={input} placeholder="fator (ex: 1.3)" inputMode="decimal" value={form.fator_multiplicador} onChange={(e) => setForm({ ...form, fator_multiplicador: e.target.value })} required />
        <input style={input} placeholder="descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        <button style={btn} type="submit">Salvar dificuldade</button>
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((d) => <li key={d.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>{d.nome} · ×{d.fator_multiplicador}</li>)}
      </ul>
    </main>
  );
}
