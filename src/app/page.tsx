export default function Home() {
  const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
  const btn: React.CSSProperties = { display: "block", minHeight: 48, lineHeight: "48px", textAlign: "center", border: "1px solid #ddd", borderRadius: 8, textDecoration: "none", color: "inherit", fontSize: 16, fontWeight: 600 };
  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>croche-app</h1>
      <a style={btn} href="/login">Entrar</a>
      <a style={btn} href="/linhas">Linhas</a>
      <a style={btn} href="/api/health">Status</a>
    </main>
  );
}
