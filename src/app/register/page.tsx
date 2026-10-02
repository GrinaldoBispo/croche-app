"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setOk(false);
    setLoading(true);
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (j.status === "success") {
        setOk(true);
        setMsg("Cadastro feito! Indo pro login...");
        setTimeout(() => (window.location.href = "/login"), 900);
      } else setMsg(j.message || "erro");
    } catch {
      setMsg("erro de rede");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <style>{`
        .auth-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; background: #f4f4f5; box-sizing: border-box; }
        .auth-wrap { width: 100%; max-width: 880px; display: flex; gap: 32px; align-items: center; justify-content: center; margin: 0 auto; box-sizing: border-box; }
        .auth-brand { flex: 1; min-width: 280px; }
        .auth-brand h1 { font-size: 44px; line-height: 1.1; margin: 0 0 12px; }
        .auth-brand p { color: #52525b; font-size: 18px; margin: 0; }
        .auth-card { width: min(400px, 100%); background: #fff; border-radius: 16px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,.12); display: grid; gap: 12px; margin: 0 auto; box-sizing: border-box; }
        .auth-tabs { display: flex; background: #f4f4f5; border-radius: 10px; padding: 4px; }
        .auth-tab { flex: 1; padding: 10px; border-radius: 8px; border: 0; background: transparent; font-weight: 700; font-size: 14px; color: #71717a; cursor: pointer; }
        .auth-tab.active { background: #fff; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
        .auth-field { display: flex; align-items: center; gap: 8px; border: 1px solid #d4d4d8; border-radius: 10px; padding: 0 12px; background: #fafafa; min-width: 0; box-sizing: border-box; }
        .auth-field input { flex: 1; min-width: 0; width: 100%; height: 44px; border: 0; background: transparent; outline: none; font-size: 16px; }
        .auth-form { display: grid; gap: 12px; margin: 0; width: 100%; min-width: 0; }
        .auth-btn { min-height: 48px; border-radius: 10px; border: 0; background: #18181b; color: #fff; font-weight: 700; font-size: 16px; cursor: pointer; }
        .auth-btn:disabled { opacity: .6; }
        .auth-msg { min-height: 20px; font-size: 14px; color: #b91c1c; }
        .auth-msg.ok { color: #15803d; }
        @media (max-width: 760px) {
          .auth-screen { padding: 16px; align-items: flex-start; padding-top: 48px; }
          .auth-wrap { flex-direction: column; gap: 16; }
          .auth-brand { min-width: 0; text-align: center; }
          .auth-brand h1 { font-size: 28px; margin-bottom: 4px; }
          .auth-brand p { font-size: 15px; }
          .auth-card { width: 100%; }
        }
      `}</style>
      <div className="auth-wrap">
        <div className="auth-brand">
          <h1>Croche App</h1>
          <p>Cadastre linhas e calcule o preço das peças em segundos.</p>
        </div>
        <div className="auth-card">
          <div className="auth-tabs">
            <button className="auth-tab" type="button" onClick={() => (window.location.href = "/login")}>Entrar</button>
            <button className="auth-tab active" type="button">Cadastrar</button>
          </div>
          <form onSubmit={cadastrar} className="auth-form">
            <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#71717a" }}>Nome completo</span>
              <span className="auth-field">
                <input placeholder="Nome completo" autoComplete="name" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </span>
            </label>
            <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#71717a" }}>Email</span>
              <span className="auth-field">
                <input placeholder="Seu email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </span>
            </label>
            <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#71717a" }}>Senha</span>
              <span className="auth-field">
                <input placeholder="Senha" type="password" autoComplete="new-password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
              </span>
            </label>
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Criar conta"}</button>
          </form>
          <p className={`auth-msg${ok ? " ok" : ""}`}>{msg}</p>
        </div>
      </div>
    </main>
  );
}
