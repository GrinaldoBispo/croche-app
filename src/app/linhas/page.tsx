"use client";
import { useEffect, useState } from "react";

type Linha = {
  id: string;
  marca?: string;
  textura?: string;
  nome_linha?: string; // legado: fallback até migrar
  cor?: string;
  peso_novelo_g?: number;
  preco_pago?: number;
  preco_por_g?: number;
  quantidade?: number;
};

const emptyForm = { marca: "", textura: "", cor: "", peso_novelo_g: "", preco_pago: "", quantidade: "" };

export default function LinhasPage() {
  const [lista, setLista] = useState<Linha[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const [marcas, setMarcas] = useState<Array<{ id: string; nome?: string }>>([]);

  async function carregar() {
    setMsg("carregando...");
    const [rl, rm] = await Promise.all([
      fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" }),
      fetch("/api/marcas?limit=200", { cache: "no-store" }),
    ]);
    const j = await rl.json();
    const m = await rm.json();
    setLista(j.data || []);
    setMarcas(m.data || []);
    setMsg(j.total === 0 ? "nenhuma linha ainda" : `${j.total} encontrada(s)`);
  }

  useEffect(() => {
    carregar();
  }, []);

  function editar(l: Linha) {
    setEditId(l.id);
    setForm({
      marca: l.marca || "",
      textura: l.textura || l.nome_linha || "",
      cor: l.cor || "",
      peso_novelo_g: String(l.peso_novelo_g ?? ""),
      preco_pago: String(l.preco_pago ?? ""),
      quantidade: String(l.quantidade ?? ""),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("salvando...");
    const payload = editId
      ? {
          action: "update",
          table_name: "LINHAS",
          id: editId,
          data: {
            id: editId,
            marca: form.marca,
            textura: form.textura,
            cor: form.cor,
            peso_novelo_g: Number(form.peso_novelo_g),
            preco_pago: Number(form.preco_pago),
            quantidade: Number(form.quantidade || 0),
          },
        }
      : {
          action: "create",
          table_name: "LINHAS",
          data: {
            marca: form.marca,
            textura: form.textura,
            cor: form.cor,
            peso_novelo_g: Number(form.peso_novelo_g),
            preco_pago: Number(form.preco_pago),
            quantidade: Number(form.quantidade || 0),
          },
        };
    const r = await fetch("/api/linhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    if (j.status === "success") {
      cancelar();
      await carregar();
    } else setMsg(j.message || "erro");
  }

  async function excluir() {
    if (!editId || !confirm("Excluir esta linha?")) return;
    setMsg("excluindo...");
    const r = await fetch("/api/linhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", table_name: "LINHAS", id: editId }),
    });
    const j = await r.json();
    if (j.status === "success") {
      cancelar();
      await carregar();
    } else setMsg(j.message || "erro");
  }

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Linhas</h1>
      <form onSubmit={salvar} className="card">
        <select className="input" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required>
          <option value="">marca...</option>
          {marcas.map((m) => <option key={m.id} value={m.nome}>{m.nome}</option>)}
        </select>
        <input className="input" placeholder="textura da linha (ex: Anne, Barroco)" value={form.textura} onChange={(e) => setForm({ ...form, textura: e.target.value })} required />
        <input className="input" placeholder="cor" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} required />
        <input className="input" placeholder="peso novelo (g)" inputMode="decimal" value={form.peso_novelo_g} onChange={(e) => setForm({ ...form, peso_novelo_g: e.target.value })} required />
        <input className="input" placeholder="preço pago (R$)" inputMode="decimal" value={form.preco_pago} onChange={(e) => setForm({ ...form, preco_pago: e.target.value })} required />
        <input className="input" placeholder="quantidade (estoque novelos)" inputMode="numeric" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} required />
        <button className="btn btn-primary" type="submit">{editId ? "Atualizar linha" : "Salvar linha"}</button>
        {editId && (
          <>
            <button className="btn" type="button" onClick={cancelar}>Cancelar</button>
            <button className="btn" style={{ color: "red" }} type="button" onClick={excluir}>Excluir</button>
          </>
        )}
      </form>
      <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {lista.map((l) => {
          const tex = l.textura || l.nome_linha || "—";
          return (
            <li key={l.id} onClick={() => editar(l)} className="card card-click">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="novelo" title={l.cor || ""} aria-hidden="true" />
                <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                  <strong>{l.cor || "—"} · {tex}</strong>
                  <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="badge badge-primary">{l.marca || "—"}</span>
                    <span className="badge badge-accent">{tex}</span>
                    <span className="badge">qtd {Number(l.quantidade ?? 0)}</span>
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <span className="price">R$ {Number(l.preco_por_g || 0).toFixed(4).replace(".", ",")}/g</span>
                <small style={{ color: "var(--muted)" }}>R$ {Number(l.preco_pago || 0).toFixed(2).replace(".", ",")} · {Number(l.peso_novelo_g || 0)}g</small>
              </div>
              <small style={{ color: "var(--muted)" }}>toque para editar</small>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
