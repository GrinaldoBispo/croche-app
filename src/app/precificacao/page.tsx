"use client";
import { useEffect, useMemo, useState } from "react";

type Linha = { id: string; marca?: string; textura?: string; nome_linha?: string; cor?: string; peso_novelo_g?: number; preco_pago?: number; preco_por_g?: number };
type Receita = { id: string; nome_item?: string; linha_usada?: string; dificuldade_id?: string; qtd_cores?: number };
type Dif = { id: string; nome?: string; fator_multiplicador?: number };
type Slot = { linhaId: string; peso: string; sim: string };

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

function qtdDe(r: Receita) {
  const q = Number(r.qtd_cores || 0);
  if (q > 0) return q;
  const ids = String(r.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean);
  return ids.length || 1;
}

function idsDe(r: Receita) {
  return String(r.linha_usada || "").split(",").map((s) => s.trim()).filter(Boolean);
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
  const [slots, setSlots] = useState<Slot[]>([]);
  const [erro, setErro] = useState(false);

  async function carregar() {
    setMsg("carregando...");
    setErro(false);
    try {
      const [rl, rr, rd] = await Promise.all([
        fetch("/api/linhas?table_name=LINHAS&limit=200", { cache: "no-store" }),
        fetch("/api/receitas?limit=200", { cache: "no-store" }),
        fetch("/api/dificuldades?limit=200", { cache: "no-store" }),
      ]);
      if (!rl.ok || !rr.ok || !rd.ok) throw new Error("falha na rede");
      setLinhas(((await rl.json()).data) || []);
      setReceitas(((await rr.json()).data) || []);
      setDifs(((await rd.json()).data) || []);
      setMsg("");
    } catch (e) {
      setErro(true);
      setMsg("falha ao carregar — toque em tentar de novo");
    }
  }
  useEffect(() => { carregar(); }, []);

  const receita = useMemo(() => receitas.find((r) => r.id === receitaId) || null, [receitas, receitaId]);
  const mapLinha = useMemo(() => new Map(linhas.map((l) => [l.id, l])), [linhas]);

  function escolherReceita(id: string) {
    setReceitaId(id);
    const r = receitas.find((x) => x.id === id);
    if (!r) {
      setDifId(""); setValorBase(""); setMargem(""); setSlots([]);
      return;
    }
    const antigos = idsDe(r);
    setSlots(Array.from({ length: qtdDe(r) }, (_, i) => ({ linhaId: antigos[i] || "", peso: "", sim: "" })));
    setDifId(r.dificuldade_id || "");
    setValorBase("");
    setMargem("");
  }

  function setSlot(i: number, patch: Partial<Slot>) {
    setSlots((s) => s.map((sl, j) => (j === i ? { ...sl, ...patch } : sl)));
  }

  const calc = useMemo(() => {
    if (!receita) return null;
    const itens = slots.map((sl, i) => {
      const l = mapLinha.get(sl.linhaId);
      const rg = l ? rgEstoque(l) : 0;
      const rgSim = numBR(sl.sim);
      const rgEf = rgSim > 0 ? rgSim : rg;
      const peso = numBR(sl.peso);
      const roloG = l ? Number(l.peso_novelo_g || 0) : 0;
      const pago = l ? Number(l.preco_pago || 0) : 0;
      return { key: i, label: l ? labelLinha(l) : `Cor ${i + 1} — escolha a linha`, cor: l?.cor || "", marca: l?.marca || "", tex: l ? (l.textura || l.nome_linha || "") : "", rg, rgEf, peso, custo: rgEf * peso, roloG, pago };
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
  }, [receita, slots, mapLinha, valorBase, difs, difId, margem]);

  function limpar() {
    setReceitaId(""); setDifId(""); setValorBase(""); setMargem(""); setSlots([]);
  }

  return (
    <main className="container">
      <h1 style={{ margin: 0 }}>Precificação</h1>
      <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Receita</span>
        <select className="input" value={receitaId} onChange={(e) => escolherReceita(e.target.value)}>
          <option value="">receita...</option>
          {receitas.map((r) => <option key={r.id} value={r.id}>{r.nome_item} ({qtdDe(r)} {qtdDe(r) === 1 ? "cor" : "cores"})</option>)}
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
          {calc?.itens.map((it, i) => (
            <div key={it.key} className="card">
              <strong>Cor {i + 1}</strong>
              <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Linha usada</span>
                <select className="input" value={slots[i]?.linhaId || ""} onChange={(e) => setSlot(i, { linhaId: e.target.value })}>
                  <option value="">escolha a linha...</option>
                  {linhas.map((l) => <option key={l.id} value={l.id}>{labelLinha(l)}</option>)}
                </select>
              </label>
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
              {it.roloG > 0 && <small style={{ color: "var(--muted)" }}>Rolo: {String(it.roloG).replace(".", ",")}g por {money(it.pago)} (R$/g {it.rg.toFixed(4).replace(".", ",")})</small>}
              <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Peso usado nessa peça (g)</span>
                <input className="input" placeholder="ex: 120" inputMode="decimal" value={slots[i]?.peso || ""} onChange={(e) => setSlot(i, { peso: e.target.value })} />
              </label>
              <label style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Simular R$/g</span>
                <input className="input" placeholder="opcional" inputMode="decimal" value={slots[i]?.sim || ""} onChange={(e) => setSlot(i, { sim: e.target.value })} />
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
      {erro && (
        <button className="btn" type="button" onClick={carregar}>Tentar de novo</button>
      )}
    </main>
  );
}
