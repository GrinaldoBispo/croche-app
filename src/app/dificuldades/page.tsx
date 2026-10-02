"use client";
import { useEffect, useState } from "react";

function numBR(v: string) {
  return Number(String(v ?? "").replace(",", ".").trim());
}

function fmtBR(n?: number) {
  if (n === undefined || n === null || Number.isNaN(Number(n))) return "—";
  return String(n).replace(".", ",");
}

export default function DificuldadesPage() {
  const [lista, setLista] = useState<Array<{ id: string; nome?: string; fator_multiplicador?: number; descricao?: string }>>([]);
  const [form, setForm] = useState({ nome: "", fator_multiplicador: "", descricao: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function carregar() {
    const r = await fetch("/api/dificuldades?limit=200", { cache: "no-store" });
    const j = await r.json();
    setLista(j.data || []);
    setMsg(`${j.total ?? 0} dificuldade(s)`);
  }
  useEffect(() => { carregar(); }, []);

  function editar(d: { id: string; nome?: string; fator_multiplicador?: number; descricao?: string }) {
    setEditId(d.id);
    setForm({
      nome: d.nome || "",
      fator_multiplicador: d.fator_multiplicador !== undefined && d.fator_multiplicador !== null ? String(d.fator_multiplicador).replace(".", ",") : "",
      descricao: d.descricao || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditId(null);
    setForm({ nome: "", fator_multiplicador: "", descricao: "" });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const fator = numBR(form.fator_multiplicador);
    if (Number.isNaN(fator)) { setMsg("fator inválido (ex: 1,3)"); return; }
    setMsg("salvando...");
    const payload = editId
      ? { action: "update", id: editId, data: { id: editId, nome: form.nome, fator_multiplicador: fator, descricao: form.descricao } }
      : { action: "create", data: { nome: form.nome, fator_multiplicador: fator, descricao: form.descricao } };
    const r = await fetch("/api/dificuldades", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    if (j.status === "success") { cancelar(); carregar(); } else setMsg(j.message);
  }

  async function excluir() {
    if (!editId || !confirm("Excluir esta dificuldade?")) return;
    setMsg("excluindo...");
    const r = await fetch("/api/dificuldades", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: editId }),
    });
    const j = await r.json();
    if (j.status === "success") { cancelar(); carregar(); } else setMsg(j.message);
  }

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Dificuldades</h1>
      <form onSubmit={salvar} className="card">
        <input className="input" placeholder="nome (ex: Fácil)" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input className="input" placeholder="fator (ex: 1,3)" inputMode="decimal" value={form.fator_multiplicador} onChange={(e) => setForm({ ...form, fator_multiplicador: e.target.value })} required />
        <input className="input" placeholder="descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        <button className="btn btn-primary" type="submit">{editId ? "Atualizar dificuldade" : "Salvar dificuldade"}</button>
        {editId && (
          <>
            <button className="btn" type="button" onClick={cancelar}>Cancelar</button>
            <button className="btn" style={{ color: "red" }} type="button" onClick={excluir}>Excluir</button>
          </>
        )}
      </form>
      <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {lista.map((d) => (
          <li key={d.id} onClick={() => editar(d)} className="card card-click">
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <strong>{d.nome}</strong>
              <span className="badge badge-accent">÷ {fmtBR(d.fator_multiplicador)}</span>
            </div>
            {d.descricao && <small style={{ color: "var(--muted)" }}>{d.descricao}</small>}
            <small style={{ color: "var(--muted)" }}>toque para editar</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
