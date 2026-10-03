"use client";
import { useEffect, useState } from "react";

type LinhaOpt = { id: string; textura?: string; nome_linha?: string; cor?: string; marca?: string };
type Receita = { id: string; nome_item?: string; linha_usada?: string; dificuldade_id?: string };

function labelLinha(l: LinhaOpt) {
  const tex = l.textura || (l as { nome_linha?: string }).nome_linha || "—";
  return `${l.cor || "—"} · ${tex} · ${l.marca || "—"}`;
}

export default function ReceitasPage() {
  const [linhas, setLinhas] = useState<LinhaOpt[]>([]);
  const [difs, setDifs] = useState<Array<{ id: string; nome?: string }>>([]);
  const [lista, setLista] = useState<Receita[]>([]);
  const [form, setForm] = useState({ nome_item: "", dificuldade_id: "" });
  const [sel, setSel] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(false);

  async function carregar() {
    setMsg("carregando...");
    setErro(false);
    try {
      const [rl, rd, rr] = await Promise.all([
        fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" }),
        fetch("/api/dificuldades?limit=200", { cache: "no-store" }),
        fetch("/api/receitas?limit=200", { cache: "no-store" }),
      ]);
      if (!rl.ok || !rd.ok || !rr.ok) throw new Error("falha na rede");
      setLinhas(((await rl.json()).data) || []);
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

  function adicionar(id: string) {
    setSel((s) => (s.includes(id) ? s : [...s, id]));
  }

  function remover(id: string) {
    setSel((s) => s.filter((x) => x !== id));
  }

  function editar(r: Receita) {
    setEditId(r.id);
    setBusca("");
    setForm({
      nome_item: r.nome_item || "",
      dificuldade_id: r.dificuldade_id || "",
    });
    setSel(String(r.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditId(null);
    setBusca("");
    setForm({ nome_item: "", dificuldade_id: "" });
    setSel([]);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (sel.length === 0) { setMsg("adicione ao menos 1 linha"); return; }
    setMsg("salvando...");
    const data = {
      nome_item: form.nome_item,
      linha_usada: sel.join(","),
      dificuldade_id: form.dificuldade_id,
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
  const termo = busca.trim().toLowerCase();
  const resultados = (termo
    ? linhas.filter((l) => labelLinha(l).toLowerCase().includes(termo))
    : linhas
  ).filter((l) => !sel.includes(l.id)).slice(0, 6);

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Receitas</h1>
      <form onSubmit={salvar} className="card">
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Nome da peça</span>
          <input className="input" placeholder="ex: Sousplat" value={form.nome_item} onChange={(e) => setForm({ ...form, nome_item: e.target.value })} required />
        </label>
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Dificuldade</span>
          <select className="input" value={form.dificuldade_id} onChange={(e) => setForm({ ...form, dificuldade_id: e.target.value })}>
            <option value="">dificuldade (opcional)...</option>
            {difs.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </label>
        <fieldset style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 8, display: "grid", gap: 8, margin: 0, minWidth: 0 }}>
          <legend style={{ fontSize: 14, color: "var(--muted)" }}>Linhas ({sel.length})</legend>
          <input className="input" placeholder="pesquisar cor, textura ou marca..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          {sel.length > 0 && (
            <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sel.map((id) => (
                <span key={id} className="badge badge-accent" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {mapLinha.get(id) || id}
                  <button type="button" aria-label="remover linha" onClick={() => remover(id)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 16, lineHeight: 1, minWidth: 24, minHeight: 24 }}>×</button>
                </span>
              ))}
            </span>
          )}
          {resultados.length === 0 ? (
            <small style={{ color: "var(--muted)" }}>{termo ? "nada encontrado para essa busca" : "todas as linhas já foram adicionadas"}</small>
          ) : (
            resultados.map((l) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 12, padding: "8px 12px", background: "var(--surface)", minHeight: 44 }}>
                <span style={{ minWidth: 0, flex: 1 }}>{labelLinha(l)}</span>
                <button className="btn" type="button" onClick={() => adicionar(l.id)} style={{ minHeight: 44, flexShrink: 0 }}>Adicionar</button>
              </div>
            ))
          )}
        </fieldset>
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
          const ids = String(x.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean);
          const nomes = ids.map((id) => mapLinha.get(id) || id);
          return (
            <li key={x.id} onClick={() => editar(x)} className="card card-click">
              <strong>{x.nome_item}</strong>
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="badge badge-accent">{ids.length} {ids.length === 1 ? "cor" : "cores"}</span>
              </span>
              <small style={{ color: "var(--muted)" }}>{nomes.join(" + ") || "—"}</small>
              <small style={{ color: "var(--muted)" }}>toque para editar</small>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
