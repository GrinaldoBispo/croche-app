"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLICAS = ["/login", "/register"];

function Icon({ d, ativo }: { d: string; ativo: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={ativo ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "Início", d: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" },
  { href: "/linhas", label: "Linhas", d: "M12 3a9 9 0 1 0 9 9M12 3a9 9 0 0 1 9 9M12 3c-4 4-4 14 0 18M5 6.5C9 9 9 15 5 17.5M19 6.5C15 9 15 15 19 17.5" },
  { href: "/receitas", label: "Receitas", d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" },
  { href: "/mais", label: "Mais", d: "M5 5h4M11 5h2M17 5h2M5 12h2M11 12h4M17 12h0M5 19h6M15 19h4" },
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(253,248,245,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              flexShrink: 0,
              background: "conic-gradient(from 200deg, var(--primary), var(--accent), var(--primary))",
              border: "2px solid #fff",
              boxShadow: "var(--shadow)",
            }}
          />
          <a href="/" style={{ fontWeight: 800, textDecoration: "none", color: "var(--text)", fontSize: 17, letterSpacing: "-0.01em" }}>
            Croche App
          </a>
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden="true"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
              </svg>
            </span>
            {papel && (
              <span className={papel === "admin" ? "badge badge-primary" : "badge"}>
                {papel === "admin" ? "admin" : "artesã"}
              </span>
            )}
          </span>
        </div>
      </header>
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex" }}>
          {TABS.map((t) => {
            const ativo = path === t.href || (t.href === "/receitas" && path.startsWith("/receitas")) || (t.href === "/linhas" && path.startsWith("/linhas"));
            return (
              <a
                key={t.href}
                href={t.href}
                aria-current={ativo ? "page" : undefined}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "10px 0 8px",
                  minHeight: 60,
                  textDecoration: "none",
                  color: ativo ? "var(--primary)" : "var(--muted)",
                  fontWeight: ativo ? 700 : 400,
                  fontSize: 12,
                }}
              >
                <Icon d={t.d} ativo={ativo} />
                {t.label}
                <span
                  aria-hidden="true"
                  style={{
                    width: 16,
                    height: 4,
                    borderRadius: 999,
                    background: "var(--primary)",
                    opacity: ativo ? 1 : 0,
                  }}
                />
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
