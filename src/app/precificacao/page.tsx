"use client";
import { useEffect, useMemo, useState } from "react";

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
      const roloG = l ? Number(l.peso_novelo_g || 0) : 0;
      const pago = l ? Number(l.preco_pago || 0) : 0;
      return { id, label: l ? labelLinha(l) : id, cor: l?.cor || "", marca: l?.marca || "", tex: l ? (l.textura || l.nome_linha || "") : "", rg, rgEf, peso, custo: rgEf * peso, roloG, pago };
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
    const margemValor = final - comDif;
    const pMat = final > 0 ? (material / final) * 100 : 0;
    const pMao = final > 0 ? (mao / final) * 100 : 0;
    const pMar = final > 0 ? (margemValor / final) * 100 : 0;
    return { itens, material, pesoTotal, mao, fator, difNome: dif?.nome || "—", comDif, margemValor, final, pMat, pMao, pMar };
  }, [receita, ids, mapLinha, pesos, sim, valorBase, difs, difId, margem]);

  function limpar() {
    setReceitaId(""); setDifId(""); setValorBase(""); setMargem(""); setPesos({}); setSim({});
  }

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Precificação</h1>
      <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Receita</span>
        <select className="input" value={receitaId} onChange={(e) => escolherReceita(e.target.value)}>
          <option value="">receita...</option>
          {receitas.map((r) => <option key={r.id} value={r.id}>{r.nome_item}</option>)}
        </select>
      </label>
      {receita && (
        <>
          <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Dificuldade</span>
            <select className="input" value={difId} onChange={(e) => setDifId(e.target.value)}>
              <option value="">dificuldade (divide)...</option>
              {difs.map((d) => <option key={d.id} value={d.id}>{d.nome} - {String(d.fator_multiplicador ?? "").replace(".", ",")}</option>)}
            </select>
          </label>
          <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Mão de obra — valor base/g</span>
            <input className="input" placeholder="opcional" inputMode="decimal" value={valorBase} onChange={(e) => setValorBase(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Margem (%)</span>
            <input className="input" placeholder="ex: 20" inputMode="decimal" value={margem} onChange={(e) => setMargem(e.target.value)} />
          </label>
          {calc?.itens.map((it) => (
            <div key={it.id} className="card">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="novelo" title={it.cor} aria-hidden="true" />
                <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                  <strong>{it.label}</strong>
                  <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {it.marca && <span className="badge badge-primary">{it.marca}</span>}
                    {it.tex && <span className="badge badge-accent">{it.tex}</span>}
                  </span>
                </div>
              </div>
              <small style={{ color: "var(--muted)" }}>Rolo: {String(it.roloG).replace(".", ",")}g por {money(it.pago)} (R$/g {it.rg.toFixed(4).replace(".", ",")})</small>
              <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Peso usado nessa peça (g)</span>
                <input className="input" placeholder="ex: 120" inputMode="decimal" value={pesos[it.id] || ""} onChange={(e) => setPesos({ ...pesos, [it.id]: e.target.value })} />
              </label>
              <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Simular R$/g</span>
                <input className="input" placeholder="opcional" inputMode="decimal" value={sim[it.id] || ""} onChange={(e) => setSim({ ...sim, [it.id]: e.target.value })} />
              </label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>Custo</span>
                <span className="price">{money(it.custo)}</span>
              </div>
            </div>
          ))}
          <div className="result-banner">
            <small>Preço final de venda sugerido</small>
            <strong>{money(calc ? calc.final : 0)}</strong>
            <small>{String(calc ? calc.pesoTotal : 0).replace(".", ",")}g usados · dificuldade {calc?.difNome} (÷ {String(calc?.fator ?? 1).replace(".", ",")})</small>
          </div>
          <div className="card">
            <div className="ratio-bar" aria-hidden="true">
              <span style={{ width: `${calc?.pMat || 0}%`, background: "var(--primary)" }} />
              <span style={{ width: `${calc?.pMao || 0}%`, background: "var(--accent)" }} />
              <span style={{ width: `${calc?.pMar || 0}%`, background: "var(--success)" }} />
            </div>
            <span style={{ fontSize: 14 }}>Material: {money(calc ? calc.material : 0)}</span>
            <span style={{ fontSize: 14 }}>Mão de obra: {money(calc ? calc.mao : 0)}</span>
            <span style={{ fontSize: 14 }}>Margem: {money(calc ? calc.margemValor : 0)}</span>
          </div>
          <button className="btn" type="button" onClick={limpar}>Limpar</button>
        </>
      )}
      <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{msg}</p>
    </main>
  );
}
