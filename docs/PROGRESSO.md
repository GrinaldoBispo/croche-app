# Progresso do Projeto

## Status Geral

| Fase | Progresso | Status |
|------|-----------|--------|
| Fase 1: Backend Sheets | 100% | ✅ |
| Fase 2: Web + Auth | 100% | ✅ |
| Fase 3: Cadastros | 100% | ✅ |
| Fase 4: Calculadora | 100% | ✅ |
| Fase 5: Redesign UI | 100% | ✅ |

---

## Fase 1: Backend Sheets ✅
- [x] 2026-10-01 — PRD inicial em `docs/PRD.md`
- [x] 2026-10-01 — Apps Script validado: seed/migrate, CRUD por id, preco_por_g auto, limit 200
- [x] 2026-10-01 — Template Projeto Croche + deploy `/exec` testado
- [x] 2026-10-01 — USUARIOS (senha_hash+papel) + LOG_ACESSOS + migrate sem apagar dados

## Fase 2: Web + Auth ✅
- [x] 2026-10-01 — Next root na Vercel (https://croche-app-one.vercel.app/), proxy `/api/*`
- [x] 2026-10-01 — Login com senha + cookie, register público, rotas protegidas, menu por papel
- [x] 2026-10-01 — Layout + login/register padrão agenda-facil, marca Croche App, mobile-first

## Fase 3: Cadastros ✅
- [x] 2026-10-01 — Linhas (marca via select), Marcas, Dificuldades, Receitas (selects), edição usuário por clique
- [x] 2026-10-01 — Aba MARCAS criada via seed (dados anteriores preservados)
- [x] 2026-10-01 — Menu inferior mobile (Início/Linhas/Receitas/Mais) + hub `/mais`
- [x] 2026-10-02 — Padrão visual `/linhas` replicado (receitas, marcas, dificuldades, usuarios) + labels nos formulários

## Fase 4: Calculadora ✅
- [x] 2026-10-02 — Precificação funcional (material + MO / fator + margem) com banner resultado + barra proporção

## Fase 5: Redesign UI ✅
- [x] 2026-10-02 — Tema Craft (`globals.css` + `docs/TEMA.md`), header glass + nav SVG, dashboard `/` sem menus

---

## Pendente

### Prioridade Alta
1. Testar fluxo completo no celular em produção (login → cadastros → precificação)

### Prioridade Média
2. Filtro admin refinado + LOG_ACESSOS
3. Onboarding por URL cliente (extrairIdDaUrl pronto, falta UI)
4. PropertiesService API_KEY

### Prioridade Baixa
3. Pedidos (v2, fora do MVP)

---

## Changelog Recente

### 2026-10-02
- ✅ Redesign UI (tema, nav SVG, dashboard, cards, labels)
- ✅ Login rápido (LOG fire-and-forget) + try/catch com Tentar de novo nas 6 telas
- ✅ Backend validado em produção (USUARIOS/MARCAS/LINHAS via `/exec`)

### 2026-10-01
- ✅ MARCAS criada via seed
- ✅ Menu inferior mobile + `/mais`
