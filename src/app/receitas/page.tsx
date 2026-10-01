"use client";
import { useEffect, useState } from "react";

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };

export default function ReceitasPage() {
  const [linhas, setLinhas] = useState<Array<{ id: string; textura?: string; nome_linha?: string; cor?: string; marca?: string }>>([]);
  const [difs, setDifs] = useState<Array<{ id: string; nome?: string }>>([]);
  const [lista, setLista] = useState<Array<{ id: string; nome_item?: string }>>([]);
  const [form, setForm] = useState({ nome_item: "", linha_usada: "", peso_necessario_g: "", dificuldade_id: "", valor_base_g: "", margem_pct: "" });
  const [msg, setMsg] = useState("");

  async function carregar() {
    const [rl, rd, rr] = await Promise.all([
      fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" }),
      fetch("/api/dificuldades?limit=200", { cache: "no-store" }),
      fetch("/api/receitas?limit=200", { cache: "no-store" }),
    ]);
    setLinhas(((await rl.json()).data) || []);
    setDifs(((await rd.json()).data) || []);
    const j = await rr.json();
    setLista(j.data || []);
    setMsg(`${j.total ?? 0} receita(s)`);
  }
  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/receitas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", data: { ...form, peso_necessario_g: Number(form.peso_necessario_g), valor_base_g: Number(form.valor_base_g), margem_pct: Number(form.margem_pct) } }),
    });
    const j = await r.json();
    if (j.status === "success") { setForm({ nome_item: "", linha_usada: "", peso_necessario_g: "", dificuldade_id: "", valor_base_g: "", margem_pct: "" }); carregar(); } else setMsg(j.message);
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Receitas</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome da peça" value={form.nome_item} onChange={(e) => setForm({ ...form, nome_item: e.target.value })} required />
        <select style={input} value={form.linha_usada} onChange={(e) => setForm({ ...form, linha_usada: e.target.value })} required>
          <option value="">linha...</option>
          {linhas.map((l) => <option key={l.id} value={l.id}>{l.textura || (l as { nome_linha?: string }).nome_linha} - {l.cor} ({l.marca})</option>)}
        </select>
        <select style={input} value={form.dificuldade_id} onChange={(e) => setForm({ ...form, dificuldade_id: e.target.value })} required>
          <option value="">dificuldade...</option>
          {difs.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <input style={input} placeholder="peso necessário (g)" inputMode="decimal" value={form.peso_necessario_g} onChange={(e) => setForm({ ...form, peso_necessario_g: e.target.value })} required />
        <input style={input} placeholder="valor base/g mão de obra" inputMode="decimal" value={form.valor_base_g} onChange={(e) => setForm({ ...form, valor_base_g: e.target.value })} required />
        <input style={input} placeholder="margem % (ex: 20)" inputMode="decimal" value={form.margem_pct} onChange={(e) => setForm({ ...form, margem_pct: e.target.value })} />
        <button style={btn} type="submit">Salvar receita</button>
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((x) => <li key={x.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>{x.nome_item}</li>)}
      </ul>
    </main>
  );
}
