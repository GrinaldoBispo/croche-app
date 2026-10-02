"use client";
import { useEffect, useState } from "react";

type Usuario = { id: string; nome?: string; email?: string; ativo?: string; papel?: string; spreadsheet_url?: string };

export default function UsuariosPage() {
  const [lista, setLista] = useState<Usuario[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", papel: "user", spreadsheet_url: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [erro, setErro] = useState(false);

  async function carregar() {
    setMsg("carregando...");
    setErro(false);
    try {
      const r = await fetch("/api/usuarios?limit=200", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      if (j.status === "error") throw new Error(j.message || "erro usuarios");
      setLista(j.data || []);
      setMsg((j.total ?? 0) === 0 ? "nenhum usuário ainda" : `${j.total} encontrado(s)`);
    } catch (e) {
      setErro(true);
      setMsg("falha ao carregar — toque em tentar de novo");
    }
  }

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" }).then(async (r) => {
      const j = r.ok ? await r.json() : null;
      if (j?.papel !== "admin") window.location.href = "/linhas";
      else carregar();
    });
  }, []);

  function editar(u: Usuario) {
    setEditId(u.id);
    setForm({ nome: u.nome || "", email: u.email || "", senha: "", papel: u.papel || "user", spreadsheet_url: u.spreadsheet_url || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditId(null);
    setForm({ nome: "", email: "", senha: "", papel: "user", spreadsheet_url: "" });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("salvando...");
    const dados: Record<string, string> = { nome: form.nome, email: form.email, papel: form.papel, spreadsheet_url: form.spreadsheet_url };
    if (form.senha) dados.senha = form.senha;
    const payload = editId
      ? { action: "update", id: editId, data: dados }
      : {
          action: "create",
          data: { ...dados, ativo: "sim", criado_em: new Date().toISOString() },
        };
    const r = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    if (j.status === "success") {
      cancelar();
      await carregar();
    } else setMsg(j.message || "erro");
  }

  async function excluir() {
    if (!editId || !confirm("Excluir este usuário?")) return;
    setMsg("excluindo...");
    const r = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: editId }),
    });
    const j = await r.json();
    if (j.status === "success") {
      cancelar();
      await carregar();
    } else setMsg(j.message || "erro");
  }

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Usuários</h1>
      <form onSubmit={salvar} className="card">
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Nome</span>
          <input className="input" placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </label>
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Email</span>
          <input className="input" placeholder="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Senha</span>
          <input className="input" placeholder={editId ? "nova senha (vazio mantém)" : "senha"} type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required={!editId} />
        </label>
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Papel</span>
          <select className="input" value={form.papel} onChange={(e) => setForm({ ...form, papel: e.target.value })}>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Planilha do cliente (URL)</span>
          <input className="input" placeholder="opcional" inputMode="url" value={form.spreadsheet_url} onChange={(e) => setForm({ ...form, spreadsheet_url: e.target.value })} />
        </label>
        <button className="btn btn-primary" type="submit">{editId ? "Atualizar usuário" : "Salvar usuário"}</button>
        {editId && (
          <>
            <button className="btn" type="button" onClick={cancelar}>Cancelar</button>
            <button className="btn" style={{ color: "red" }} type="button" onClick={excluir}>Excluir</button>
          </>
        )}
      </form>
      <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{msg}</p>
      {erro && (
        <button className="btn" type="button" onClick={carregar}>Tentar de novo</button>
      )}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {lista.map((u) => (
          <li key={u.id} onClick={() => editar(u)} className="card card-click">
            <strong>{u.nome}</strong>
            <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className={u.papel === "admin" ? "badge badge-primary" : "badge"}>{u.papel === "admin" ? "admin" : "artesã"}</span>
              {u.ativo && <span className="badge badge-success">{u.ativo}</span>}
            </span>
            <small style={{ color: "var(--muted)" }}>{u.email}</small>
            <small style={{ color: "var(--muted)" }}>toque para editar</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
