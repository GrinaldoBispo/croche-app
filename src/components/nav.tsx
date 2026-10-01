"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLICAS = ["/login", "/register"];

const TABS = [
  { href: "/", label: "Início", icon: "🏠" },
  { href: "/linhas", label: "Linhas", icon: "🧶" },
  { href: "/receitas", label: "Receitas", icon: "📖" },
  { href: "/mais", label: "Mais", icon: "⚙️" },
];

export default function Nav() {
  const path = usePathname();
  const [papel, setPapel] = useState<string | null>(null);

  useEffect(() => {
    if (PUBLICAS.includes(path)) return;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setPapel(j?.papel || null))
      .catch(() => setPapel(null));
  }, [path]);

  if (PUBLICAS.includes(path)) return null;

  return (
    <>
      <header style={{ borderBottom: "1px solid #e4e4e7" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center" }}>
          <a href="/" style={{ fontWeight: 800, textDecoration: "none", color: "inherit", fontSize: 18 }}>Croche App</a>
          {papel === "admin" && (
            <span style={{ marginLeft: "auto", fontSize: 12, background: "#f4f4f5", borderRadius: 999, padding: "4px 10px" }}>admin</span>
          )}
        </div>
      </header>
      <nav
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff",
          borderTop: "1px solid #e4e4e7", paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex" }}>
          {TABS.map((t) => {
            const ativo = path === t.href;
            return (
              <a
                key={t.href}
                href={t.href}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  padding: "10px 0 8px", minHeight: 60, textDecoration: "none",
                  color: ativo ? "#2563eb" : "#52525b", fontWeight: ativo ? 700 : 400, fontSize: 12,
                }}
              >
                <span style={{ fontSize: 22 }}>{t.icon}</span>
                {t.label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
