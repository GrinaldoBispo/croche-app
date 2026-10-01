"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [papel, setPapel] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setPapel(j?.papel || null))
      .catch(() => setPapel(null));
  }, []);

  const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
  const btn: React.CSSProperties = { display: "block", minHeight: 48, lineHeight: "48px", textAlign: "center", border: "1px solid #ddd", borderRadius: 8, textDecoration: "none", color: "inherit", fontSize: 16, fontWeight: 600 };

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Croche App</h1>
      {papel === "admin" && (
        <>
          <a style={btn} href="/linhas">Linhas</a>
          <a style={btn} href="/marcas">Marcas</a>
          <a style={btn} href="/dificuldades">Dificuldades</a>
          <a style={btn} href="/receitas">Receitas</a>
          <a style={btn} href="/usuarios">Usuários</a>
        </>
      )}
      {papel === "user" && (
        <>
          <a style={btn} href="/linhas">Linhas</a>
          <a style={btn} href="/marcas">Marcas</a>
          <a style={btn} href="/dificuldades">Dificuldades</a>
          <a style={btn} href="/receitas">Receitas</a>
        </>
      )}
    </main>
  );
}
