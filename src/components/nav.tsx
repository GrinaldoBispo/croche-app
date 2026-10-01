"use client";
import { usePathname } from "next/navigation";

const PUBLICAS = ["/login", "/register"];

export default function Nav() {
  const path = usePathname();
  if (PUBLICAS.includes(path)) return null;

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header style={{ borderBottom: "1px solid #e4e4e7", marginBottom: 16 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/" style={{ fontWeight: 800, textDecoration: "none", color: "inherit", fontSize: 18 }}>Croche App</a>
        <nav style={{ display: "flex", gap: 12, marginLeft: "auto", fontSize: 15 }}>
          <a href="/linhas">Linhas</a>
          <a href="/usuarios">Usuários</a>
          <button onClick={sair} style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 15 }}>Sair</button>
        </nav>
      </div>
    </header>
  );
}
