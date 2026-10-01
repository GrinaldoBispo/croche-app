"use client";
import { useEffect, useState } from "react";

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };

export default function MarcasPage() {
  const [lista, setLista] = useState<Array<{ id: string; nome?: string }>>([]);
  const [nome, setNome] = useState("");
  const [msg, setMsg] = useState("");

  async function carregar() {
    const r = await fetch("/api/marcas?limit=200", { cache: "no-store" });
    const j = await r.json();
    setLista(j.data || []);
    setMsg(`${j.total ?? 0} marca(s)`);
  }
  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/marcas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", data: { nome } }) });
    const j = await r.json();
    if (j.status === "success") { setNome(""); carregar(); } else setMsg(j.message);
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Marcas</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome da marca" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <button style={btn} type="submit">Salvar marca</button>
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((m) => <li key={m.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>{m.nome}</li>)}
      </ul>
    </main>
  );
}
