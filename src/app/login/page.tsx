"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("validando...");
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const j = await r.json();
    setMsg(j.message || j.status);
  }

  return (
    <main>
      <h1>Entrar</h1>
      <form onSubmit={entrar}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
