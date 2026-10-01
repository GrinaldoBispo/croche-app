"use client";
import { useEffect, useState } from "react";

type Usuario = { id: string; nome?: string; email?: string; ativo?: string; papel?: string; spreadsheet_url?: string };

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };

export default function UsuariosPage() {
  const [lista, setLista] = useState<Usuario[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", papel: "user", spreadsheet_url: "" });
  const [editId, setEditId] = useState<string | null>(null);

  async function carregar() {
    setMsg("carregando...");
    const r = await fetch("/api/usuarios?limit=200", { cache: "no-store" });
    const j = await r.json();
    if (j.status === "error") setMsg(j.message);
    else {
      setLista(j.data || []);
      setMsg((j.total ?? 0) === 0 ? "nenhum usuário ainda" : `${j.total} encontrado(s)`);
    }
  }

  useEffect(() => {
    carregar();
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
    <main style={box}>
      <h1 style={{ margin: 0 }}>Usuários</h1>
      <form onSubmit={salvar} style={{ display: "grid", gap: 8 }}>
        <input style={input} placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input style={input} placeholder="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input style={input} placeholder={editId ? "nova senha (vazio mantém)" : "senha"} type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required={!editId} />
        <select style={input} value={form.papel} onChange={(e) => setForm({ ...form, papel: e.target.value })}>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
        <input style={input} placeholder="url da planilha do cliente (opcional)" inputMode="url" value={form.spreadsheet_url} onChange={(e) => setForm({ ...form, spreadsheet_url: e.target.value })} />
        <button style={btn} type="submit">{editId ? "Atualizar usuário" : "Salvar usuário"}</button>
        {editId && (
          <>
            <button style={btn} type="button" onClick={cancelar}>Cancelar</button>
            <button style={{ ...btn, color: "red" }} type="button" onClick={excluir}>Excluir</button>
          </>
        )}
      </form>
      <p>{msg}</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {lista.map((u) => (
          <li key={u.id} onClick={() => editar(u)} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, cursor: "pointer" }}>
            <strong>{u.nome}</strong> · {u.email} · {u.papel || "user"} · {u.ativo}
            <br /><small>toque para editar</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
