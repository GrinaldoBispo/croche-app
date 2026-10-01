# Progresso do Projeto

## Status Geral

| Fase | Progresso | Status |
|------|-----------|--------|
| Fase 1: Backend Sheets | 100% | ✅ |
| Fase 2: Web + Auth | 100% | ✅ |
| Fase 3: Cadastros | 80% | 🟡 |
| Fase 4: Calculadora | 0% | ⬜ |

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

## Fase 3: Cadastros 🟡
- [x] 2026-10-01 — Linhas (marca via select), Marcas, Dificuldades, Receitas (selects), edição usuário por clique
- [x] 2026-10-01 — Aba MARCAS criada via seed (dados anteriores preservados)
- [x] 2026-10-01 — Menu inferior mobile (Início/Linhas/Receitas/Mais) + hub `/mais`

---

## Pendente

### Prioridade Alta
1. Colar Code.gs com MARCAS no Apps Script + `?action=seed`
2. Calculadora preço peça (custo_material + mao_obra + margem)

### Prioridade Média
2. Filtro admin refinado + LOG_ACESSOS
3. Onboarding por URL cliente (extrairIdDaUrl pronto, falta UI)
4. PropertiesService API_KEY

### Prioridade Baixa
3. Pedidos (v2, fora do MVP)

---

## Changelog Recente

### 2026-10-01
- ✅ MARCAS criada via seed
- ✅ Menu inferior mobile + `/mais`
