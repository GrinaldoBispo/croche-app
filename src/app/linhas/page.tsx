"use client";
import { useEffect, useState } from "react";

type Linha = {
  id: string;
  marca?: string;
  nome_linha?: string;
  cor?: string;
  peso_novelo_g?: number;
  preco_pago?: number;
  preco_por_g?: number;
};

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };

export default function LinhasPage() {
  const [lista, setLista] = useState<Linha[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ marca: "", nome_linha: "", cor: "", peso_novelo_g: "", preco_pago: "" });

  async function carregar() {
    setMsg("carregando...");
    const r = await fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" });
    const j = await r.json();
    setLista(j.data || []);
    setMsg(j.total === 0 ? "nenhuma linha ainda" : `${j.total} encontrada(s)`);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("salvando...");
    const r = await fetch("/api/linhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        table_name: "LINHAS",
        data: {
          marca: form.marca,
          nome_linha: form.nome_linha,
          cor: form.cor,
          peso_novelo_g: Number(form.peso_novelo_g),
          preco_pago: Number(form.preco_pago),
        },
      }),
    });
    const j = await r.json();
    if (j.status === "success") {
      setForm({ marca: "", nome_linha: "", cor: "", peso_novelo_g: "", preco_pago: "" });
      await carregar();
    } else setMsg(j.message || "erro");
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Linhas</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required />
        <input style={input} placeholder="nome da linha" value={form.nome_linha} onChange={(e) => setForm({ ...form, nome_linha: e.target.value })} required />
        <input style={input} placeholder="cor" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} />
        <input style={input} placeholder="peso novelo (g)" inputMode="decimal" value={form.peso_novelo_g} onChange={(e) => setForm({ ...form, peso_novelo_g: e.target.value })} required />
        <input style={input} placeholder="preço pago (R$)" inputMode="decimal" value={form.preco_pago} onChange={(e) => setForm({ ...form, preco_pago: e.target.value })} required />
        <button style={btn} type="submit">Salvar linha</button>
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((l) => (
          <li key={l.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <strong>{l.nome_linha}</strong> · {l.marca} · {l.cor}
            <br />R$/g: {Number(l.preco_por_g || 0).toFixed(4)}
          </li>
        ))}
      </ul>
    </main>
  );
}
