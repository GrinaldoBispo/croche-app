"use client";
import { useEffect, useMemo, useState } from "react";

const box: React.CSSProperties = { maxWidth: 480, margin: "0 auto", padding: 16, display: "grid", gap: 12 };
const input: React.CSSProperties = { width: "100%", minHeight: 44, fontSize: 16, padding: "10px 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { minHeight: 48, fontSize: 16, fontWeight: 600 };
const card: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 8, padding: 12, display: "grid", gap: 8 };

type Linha = { id: string; marca?: string; textura?: string; nome_linha?: string; cor?: string; peso_novelo_g?: number; preco_pago?: number; preco_por_g?: number };
type Receita = { id: string; nome_item?: string; linha_usada?: string; dificuldade_id?: string; valor_base_g?: number; margem_pct?: number };
type Dif = { id: string; nome?: string; fator_multiplicador?: number };

function numBR(v: string) {
  if (v === "" || v === undefined) return 0;
  return Number(String(v).replace(",", ".").trim());
}

function rgEstoque(l: Linha) {
  const rg = Number(l.preco_por_g || 0);
  if (rg > 0) return rg;
  const peso = Number(l.peso_novelo_g || 0);
  const pago = Number(l.preco_pago || 0);
  return peso > 0 ? pago / peso : 0;
}

function labelLinha(l: Linha) {
  const tex = l.textura || l.nome_linha || "—";
  return `${l.cor || "—"} · ${tex} · ${l.marca || "—"}`;
}

function money(n: number) {
  if (!isFinite(n)) return "—";
  return "R$ " + Number(n).toFixed(2).replace(".", ",");
}

export default function PrecificacaoPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [difs, setDifs] = useState<Dif[]>([]);
  const [msg, setMsg] = useState("");
  const [receitaId, setReceitaId] = useState("");
  const [difId, setDifId] = useState("");
  const [valorBase, setValorBase] = useState("");
  const [margem, setMargem] = useState("");
  const [pesos, setPesos] = useState<Record<string, string>>({});
  const [sim, setSim] = useState<Record<string, string>>({});

  async function carregar() {
    setMsg("carregando...");
    const [rl, rr, rd] = await Promise.all([
      fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" }),
      fetch("/api/receitas?limit=200", { cache: "no-store" }),
      fetch("/api/dificuldades?limit=200", { cache: "no-store" }),
    ]);
    setLinhas(((await rl.json()).data) || []);
    setReceitas(((await rr.json()).data) || []);
    setDifs(((await rd.json()).data) || []);
    setMsg("");
  }
  useEffect(() => { carregar(); }, []);

  const receita = useMemo(() => receitas.find((r) => r.id === receitaId) || null, [receitas, receitaId]);
  const ids = useMemo(() => String(receita?.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean), [receita]);
  const mapLinha = useMemo(() => new Map(linhas.map((l) => [l.id, l])), [linhas]);

  function escolherReceita(id: string) {
    setReceitaId(id);
    setPesos({});
    setSim({});
    const r = receitas.find((x) => x.id === id);
    if (r) {
      setDifId(r.dificuldade_id || "");
      setValorBase(r.valor_base_g !== undefined && r.valor_base_g !== null ? String(r.valor_base_g).replace(".", ",") : "");
      setMargem(r.margem_pct !== undefined && r.margem_pct !== null ? String(r.margem_pct).replace(".", ",") : "");
    } else {
      setDifId(""); setValorBase(""); setMargem("");
    }
  }

  const calc = useMemo(() => {
    if (!receita) return null;
    const itens = ids.map((id) => {
      const l = mapLinha.get(id);
      const rg = l ? rgEstoque(l) : 0;
      const rgSim = numBR(sim[id] || "");
      const rgEf = rgSim > 0 ? rgSim : rg;
      const peso = numBR(pesos[id] || "");
      return { id, label: l ? labelLinha(l) : id, rg, rgEf, peso, custo: rgEf * peso };
    });
    const material = itens.reduce((s, x) => s + x.custo, 0);
    const pesoTotal = itens.reduce((s, x) => s + x.peso, 0);
    const vb = numBR(valorBase);
    const mao = vb > 0 ? vb * pesoTotal : 0;
    const dif = difs.find((d) => d.id === difId);
    const fator = dif && Number(dif.fator_multiplicador) ? Number(dif.fator_multiplicador) : 1;
    const base = material + mao;
    const comDif = base / fator;
    const mg = margem === "" ? 0 : numBR(margem);
    const final = comDif * (1 + mg / 100);
    return { itens, material, pesoTotal, mao, fator, difNome: dif?.nome || "—", final };
  }, [receita, ids, mapLinha, pesos, sim, valorBase, difs, difId, margem]);

  function limpar() {
    setReceitaId(""); setDifId(""); setValorBase(""); setMargem(""); setPesos({}); setSim({});
  }

  return (
    <main style={box}>
      <h1 style={{ margin: 0 }}>Precificação</h1>
      <select style={input} value={receitaId} onChange={(e) => escolherReceita(e.target.value)}>
        <option value="">receita...</option>
        {receitas.map((r) => <option key={r.id} value={r.id}>{r.nome_item}</option>)}
      </select>
      {receita && (
        <>
          <select style={input} value={difId} onChange={(e) => setDifId(e.target.value)}>
            <option value="">dificuldade (divide)...</option>
            {difs.map((d) => <option key={d.id} value={d.id}>{d.nome} - {String(d.fator_multiplicador ?? "").replace(".", ",")}</option>)}
          </select>
          <input style={input} placeholder="mão de obra valor base/g (opcional)" inputMode="decimal" value={valorBase} onChange={(e) => setValorBase(e.target.value)} />
          <input style={input} placeholder="margem % (opcional, ex: 20)" inputMode="decimal" value={margem} onChange={(e) => setMargem(e.target.value)} />
          {calc?.itens.map((it) => (
            <div key={it.id} style={card}>
              <strong>{it.label}</strong>
              <small>R$/g estoque: {it.rg.toFixed(4).replace(".", ",")}</small>
              <input style={input} placeholder="peso usado (g)" inputMode="decimal" value={pesos[it.id] || ""} onChange={(e) => setPesos({ ...pesos, [it.id]: e.target.value })} />
              <input style={input} placeholder="simular R$/g (opcional)" inputMode="decimal" value={sim[it.id] || ""} onChange={(e) => setSim({ ...sim, [it.id]: e.target.value })} />
              <span>Custo: {money(it.custo)}</span>
            </div>
          ))}
          <div style={card}>
            <span>Peso total: {String(calc ? calc.pesoTotal : 0).replace(".", ",")}g</span>
            <span>Material (soma cores): {money(calc ? calc.material : 0)}</span>
            <span>Mão de obra: {money(calc ? calc.mao : 0)}</span>
            <span>Dificuldade: {calc?.difNome} (÷ {String(calc?.fator ?? 1).replace(".", ",")})</span>
            <strong>Preço final: {money(calc ? calc.final : 0)}</strong>
          </div>
          <button style={btn} type="button" onClick={limpar}>Limpar</button>
        </>
      )}
      <p>{msg}</p>
    </main>
  );
}
