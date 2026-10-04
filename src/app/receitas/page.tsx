"use client";
import { useEffect, useState } from "react";

type Receita = { id: string; nome_item?: string; dificuldade_id?: string; qtd_cores?: number; linha_usada?: string };

function qtdDe(r: Receita) {
  const q = Number(r.qtd_cores || 0);
  if (q > 0) return q;
  const ids = String(r.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean);
  return ids.length || 1;
}

export default function ReceitasPage() {
  const [difs, setDifs] = useState<Array<{ id: string; nome?: string }>>([]);
  const [lista, setLista] = useState<Receita[]>([]);
  const [form, setForm] = useState({ nome_item: "", dificuldade_id: "" });
  const [qtd, setQtd] = useState("1");
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(false);

  async function carregar() {
    setMsg("carregando...");
    setErro(false);
    try {
      const [rd, rr] = await Promise.all([
        fetch("/api/dificuldades?limit=200", { cache: "no-store" }),
        fetch("/api/receitas?limit=200", { cache: "no-store" }),
      ]);
      if (!rd.ok || !rr.ok) throw new Error("falha na rede");
      setDifs(((await rd.json()).data) || []);
      const j = await rr.json();
      if (j.status === "error") throw new Error(j.message || "erro receitas");
      setLista(j.data || []);
      setMsg(`${j.total ?? 0} receita(s)`);
    } catch (e) {
      setErro(true);
      setMsg("falha ao carregar — toque em tentar de novo");
    }
  }
  useEffect(() => { carregar(); }, []);

  function editar(r: Receita) {
    setEditId(r.id);
    setForm({
      nome_item: r.nome_item || "",
      dificuldade_id: r.dificuldade_id || "",
    });
    setQtd(String(qtdDe(r)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditId(null);
    setForm({ nome_item: "", dificuldade_id: "" });
    setQtd("1");
  }

  function mudarQtd(delta: number) {
    setQtd((q) => {
      const n = Math.max(1, Math.min(20, (Number(String(q).replace(",", ".")) || 1) + delta));
      return String(n);
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const n = Math.max(1, Math.min(20, Math.floor(Number(String(qtd).replace(",", ".")) || 1)));
    setMsg("salvando...");
    const data = {
      nome_item: form.nome_item,
      dificuldade_id: form.dificuldade_id,
      qtd_cores: n,
      linha_usada: "",
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

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Receitas</h1>
      <form onSubmit={salvar} className="card">
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Nome da peça</span>
          <input className="input" placeholder="ex: Trilho turco" value={form.nome_item} onChange={(e) => setForm({ ...form, nome_item: e.target.value })} required />
        </label>
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Dificuldade</span>
          <select className="input" value={form.dificuldade_id} onChange={(e) => setForm({ ...form, dificuldade_id: e.target.value })}>
            <option value="">dificuldade (opcional)...</option>
            {difs.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </label>
        <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Qtd de cores da peça</span>
          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            <button className="btn" type="button" aria-label="diminuir cores" onClick={() => mudarQtd(-1)} style={{ flex: "0 0 48px", width: 48, minHeight: 48, fontSize: 20, padding: 0 }}>−</button>
            <input className="input" style={{ textAlign: "center", flex: 1, minWidth: 0 }} inputMode="numeric" value={qtd} onChange={(e) => setQtd(e.target.value)} />
            <button className="btn" type="button" aria-label="aumentar cores" onClick={() => mudarQtd(1)} style={{ flex: "0 0 48px", width: 48, minHeight: 48, fontSize: 20, padding: 0 }}>+</button>
          </div>
          <small style={{ color: "var(--muted)" }}>as cores são escolhidas na precificação</small>
        </div>
        <button className="btn btn-primary" type="submit">{editId ? "Atualizar receita" : "Salvar receita"}</button>
        {editId && (
          <>
            <button className="btn" type="button" onClick={cancelar}>Cancelar</button>
            <button className="btn" style={{ color: "red" }} type="button" onClick={excluir}>Excluir</button>
          </>
        )}
      </form>
      <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{msg}</p>
      {erro && (
        <button className="btn" type="button" onClick={carregar}>Tentar de novo</button>
      )}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {lista.map((x) => {
          const n = qtdDe(x);
          return (
            <li key={x.id} onClick={() => editar(x)} className="card card-click">
              <strong>{x.nome_item}</strong>
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="badge badge-accent">{n} {n === 1 ? "cor" : "cores"}</span>
              </span>
              <small style={{ color: "var(--muted)" }}>toque para editar</small>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
