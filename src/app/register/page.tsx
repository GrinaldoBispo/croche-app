"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (j.status === "success") {
        setMsg("Cadastro feito! Indo pro login...");
        setTimeout(() => (window.location.href = "/login"), 900);
      } else setMsg(j.message || "erro");
    } catch {
      setMsg("erro de rede");
    } finally {
      setLoading(false);
    }
  }

  const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
  const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Cadastrar</h1>
      <form onSubmit={cadastrar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input style={input} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input style={input} placeholder="senha" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
        <button style={{ minHeight: 48, fontSize: 16, fontWeight: 600 }} type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Criar conta"}
        </button>
      </form>
      <p>{msg}</p>
      <a href="/login">Já tem conta? Entrar</a>
    </main>
  );
}
