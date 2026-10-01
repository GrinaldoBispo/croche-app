"use client";
import { useEffect, useState } from "react";

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };
const checkRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, minHeight: 44, border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px", cursor: "pointer" };

type LinhaOpt = { id: string; textura?: string; nome_linha?: string; cor?: string; marca?: string };
type Receita = { id: string; nome_item?: string; linha_usada?: string; peso_necessario_g?: number; dificuldade_id?: string; valor_base_g?: number; margem_pct?: number };

function numBR(v: string) {
  if (v === "" || v === undefined) return 0;
  return Number(String(v).replace(",", ".").trim());
}

function labelLinha(l: LinhaOpt) {
  const tex = l.textura || (l as { nome_linha?: string }).nome_linha || "—";
  return `${l.cor || "—"} · ${tex} · ${l.marca || "—"}`;
}

export default function ReceitasPage() {
  const [linhas, setLinhas] = useState<LinhaOpt[]>([]);
  const [difs, setDifs] = useState<Array<{ id: string; nome?: string }>>([]);
  const [lista, setLista] = useState<Receita[]>([]);
  const [form, setForm] = useState({ nome_item: "", peso_necessario_g: "", dificuldade_id: "", valor_base_g: "", margem_pct: "" });
  const [sel, setSel] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
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

  function toggle(id: string) {
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function editar(r: Receita) {
    setEditId(r.id);
    setForm({
      nome_item: r.nome_item || "",
      peso_necessario_g: r.peso_necessario_g !== undefined && r.peso_necessario_g !== null ? String(r.peso_necessario_g).replace(".", ",") : "",
      dificuldade_id: r.dificuldade_id || "",
      valor_base_g: r.valor_base_g !== undefined && r.valor_base_g !== null ? String(r.valor_base_g).replace(".", ",") : "",
      margem_pct: r.margem_pct !== undefined && r.margem_pct !== null ? String(r.margem_pct).replace(".", ",") : "",
    });
    setSel(String(r.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditId(null);
    setForm({ nome_item: "", peso_necessario_g: "", dificuldade_id: "", valor_base_g: "", margem_pct: "" });
    setSel([]);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (sel.length === 0) { setMsg("marque ao menos 1 linha"); return; }
    setMsg("salvando...");
    const data = {
      nome_item: form.nome_item,
      linha_usada: sel.join(","),
      peso_necessario_g: numBR(form.peso_necessario_g),
      dificuldade_id: form.dificuldade_id,
      valor_base_g: numBR(form.valor_base_g),
      margem_pct: form.margem_pct === "" ? 0 : numBR(form.margem_pct),
    };
    const payload = editId ? { action: "update", id: editId, data: { id: editId, ...data } } : { action: "create", data };
    const r = await fetch("/api/receitas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    if (j.status === "success") { cancelar(); carregar(); } else setMsg(j.message);
  }

  async function excluir() {
    if (!editId || !confirm("Excluir esta receita?")) return;
    setMsg("excluindo...");
    const r = await fetch("/api/receitas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: editId }),
    });
    const j = await r.json();
    if (j.status === "success") { cancelar(); carregar(); } else setMsg(j.message);
  }

  const mapLinha = new Map(linhas.map((l) => [l.id, labelLinha(l)]));

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Receitas</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome da peça" value={form.nome_item} onChange={(e) => setForm({ ...form, nome_item: e.target.value })} required />
        <select style={input} value={form.dificuldade_id} onChange={(e) => setForm({ ...form, dificuldade_id: e.target.value })} required>
          <option value="">dificuldade...</option>
          {difs.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <fieldset style={{ border: "1px solid #ddd", borderRadius: 8, padding: 8, display: "grid", gap: 8, margin: 0 }}>
          <legend>Linhas — pode marcar várias ({sel.length})</legend>
          {linhas.map((l) => (
            <label key={l.id} style={checkRow}>
              <input type="checkbox" checked={sel.includes(l.id)} onChange={() => toggle(l.id)} style={{ width: 22, height: 22 }} />
              <span>{labelLinha(l)}</span>
            </label>
          ))}
        </fieldset>
        <input style={input} placeholder="peso necessário total (g)" inputMode="decimal" value={form.peso_necessario_g} onChange={(e) => setForm({ ...form, peso_necessario_g: e.target.value })} required />
        <input style={input} placeholder="valor base/g mão de obra" inputMode="decimal" value={form.valor_base_g} onChange={(e) => setForm({ ...form, valor_base_g: e.target.value })} required />
        <input style={input} placeholder="margem % (ex: 20)" inputMode="decimal" value={form.margem_pct} onChange={(e) => setForm({ ...form, margem_pct: e.target.value })} />
        <button style={btn} type="submit">{editId ? "Atualizar receita" : "Salvar receita"}</button>
        {editId && (
          <>
            <button style={btn} type="button" onClick={cancelar}>Cancelar</button>
            <button style={{ ...btn, color: "red" }} type="button" onClick={excluir}>Excluir</button>
          </>
        )}
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((x) => {
          const ids = String(x.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean);
          const nomes = ids.map((id) => mapLinha.get(id) || id);
          return (
            <li key={x.id} onClick={() => editar(x)} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, cursor: "pointer" }}>
              <strong>{x.nome_item}</strong>
              <br />{nomes.join(" + ") || "—"}
              <br /><small>toque para editar</small>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
