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

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };
const btnSmall: React.CSSProperties = { minHeight: 44, fontSize: 15, fontWeight: 600, padding: "0 12px" };

const emptyForm = { marca: "", textura: "", cor: "", peso_novelo_g: "", preco_pago: "", quantidade: "" };

export default function LinhasPage() {
  const [lista, setLista] = useState<Linha[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  function iniciarEdicao(l: Linha) {
    setEditingId(l.id);
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
    setEditingId(null);
    setForm(emptyForm);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("salvando...");
    const payload = {
      action: editingId ? "update" : "create",
      table_name: "LINHAS",
      ...(editingId ? { id: editingId } : {}),
      data: {
        ...(editingId ? { id: editingId } : {}),
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

  async function excluir(id: string) {
    if (!confirm("Excluir esta linha?")) return;
    setMsg("excluindo...");
    const r = await fetch("/api/linhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", table_name: "LINHAS", id }),
    });
    const j = await r.json();
    if (j.status === "success") {
      if (editingId === id) cancelar();
      await carregar();
    } else setMsg(j.message || "erro");
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>{editingId ? "Editar linha" : "Linhas"}</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <select style={input} value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required>
          <option value="">marca...</option>
          {marcas.map((m) => <option key={m.id} value={m.nome}>{m.nome}</option>)}
        </select>
        <input style={input} placeholder="textura da linha (ex: Anne, Barroco)" value={form.textura} onChange={(e) => setForm({ ...form, textura: e.target.value })} required />
        <input style={input} placeholder="cor" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} required />
        <input style={input} placeholder="peso novelo (g)" inputMode="decimal" value={form.peso_novelo_g} onChange={(e) => setForm({ ...form, peso_novelo_g: e.target.value })} required />
        <input style={input} placeholder="preço pago (R$)" inputMode="decimal" value={form.preco_pago} onChange={(e) => setForm({ ...form, preco_pago: e.target.value })} required />
        <input style={input} placeholder="quantidade (estoque novelos)" inputMode="numeric" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} required />
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...btn, flex: 1 }} type="submit">{editingId ? "Salvar edição" : "Salvar linha"}</button>
          {editingId && <button style={{ ...btn, flex: 1 }} type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((l) => {
          const tex = l.textura || l.nome_linha || "—";
          return (
            <li key={l.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, display: "grid", gap: 6 }}>
              <strong>{l.cor || "—"} · {tex} · {l.marca || "—"}</strong>
              <span>Preço R$ {Number(l.preco_pago || 0).toFixed(2)} · Peso {Number(l.peso_novelo_g || 0)}g · Qtd {Number(l.quantidade ?? 0)}</span>
              <span>R$/g: {Number(l.preco_por_g || 0).toFixed(4)}</span>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button style={{ ...btnSmall, flex: 1 }} type="button" onClick={() => iniciarEdicao(l)}>Editar</button>
                <button style={{ ...btnSmall, flex: 1 }} type="button" onClick={() => excluir(l.id)}>Excluir</button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
