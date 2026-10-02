"use client";
import { useEffect, useState } from "react";

async function lerJsonSeguro(r: Response) {
  const texto = await r.text();
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

export default function Home() {
  const [papel, setPapel] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<number | null>(null);
  const [receitas, setReceitas] = useState<number | null>(null);
  const [estoque, setEstoque] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setPapel(j?.papel || null))
      .catch(() => setPapel(null));

    Promise.all([
      fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" }).then(async (r) => (r.ok ? lerJsonSeguro(r) : null)),
      fetch("/api/receitas?limit=200", { cache: "no-store" }).then(async (r) => (r.ok ? lerJsonSeguro(r) : null)),
    ])
      .then(([jl, jr]) => {
        const ll = (jl?.data || []) as Array<{ quantidade?: number }>;
        setLinhas(jl?.total ?? ll.length ?? 0);
        setEstoque(ll.reduce((s, l) => s + Number(l.quantidade || 0), 0));
        const lr = (jr?.data || []) as unknown[];
        setReceitas(jr?.total ?? lr.length ?? 0);
      })
      .catch(() => {
        setLinhas(0);
        setReceitas(0);
        setEstoque(0);
      });
  }, []);

  return (
    <main className="container">
      <section className="welcome">
        <div>
          <h1>Olá, artesã {papel === "admin" && <span className="badge" style={{ background: "#fff", color: "#9A3412", borderColor: "transparent" }}>admin</span>}</h1>
          <p>O que vamos criar hoje?</p>
        </div>
        <div className="actions">
          <a className="btn" href="/receitas">+ Nova receita</a>
          <a className="btn" href="/linhas">+ Nova linha</a>
        </div>
      </section>

      <div className="row-2">
        <a className="card card-click" href="/linhas" style={{ textDecoration: "none", color: "inherit", alignContent: "center" }}>
          <span className="badge badge-primary">estoque</span>
          <strong className="price">{linhas === null ? "…" : `${linhas} ${linhas === 1 ? "linha" : "linhas"}`}</strong>
          <small style={{ color: "var(--muted)" }}>{estoque === null ? "carregando…" : `${estoque} ${estoque === 1 ? "novelo" : "novelos"}`}</small>
        </a>
        <a className="card card-click" href="/receitas" style={{ textDecoration: "none", color: "inherit", alignContent: "center" }}>
          <span className="badge badge-accent">criações</span>
          <strong className="price">{receitas === null ? "…" : `${receitas} ${receitas === 1 ? "receita" : "receitas"}`}</strong>
          <small style={{ color: "var(--muted)" }}>toque p/ ver</small>
        </a>
      </div>

      <a className="btn btn-primary" href="/precificacao">Calcular preço de peça</a>
    </main>
  );
}
