# Plano de Desenvolvimento — Croche App

## Status Atual

| Fase | Status | Descrição |
|------|--------|-----------|
| Fase 1: Backend Sheets | ✅ | Apps Script v3 + seed/migrate validados |
| Fase 2: Web + Auth | ✅ | Next root na Vercel, login com senha, rotas protegidas |
| Fase 3: Cadastros | ✅ | Linhas/Marcas/Dificuldades/Receitas/Usuários com padrão visual + labels |
| Fase 4: Calculadora | ✅ | Precificação (material + MO / fator + margem) com banner + proporção |
| Fase 5: Redesign UI | ✅ | Tema Craft, nav SVG, dashboard, try/catch nas telas |

---

## Fase 1: Backend Sheets ✅
- CRUD por `id`, trava cabeçalho, `preco_por_g` auto, `limit` default 200, `LockService`

---

## Pendente

### Prioridade Alta
1. **Teste mobile em produção** — login → cadastros → precificação no celular

### Prioridade Média
2. **Filtro admin** — refinar papéis e LOG_ACESSOS

### Prioridade Baixa
3. **Pedidos (v2)** — fora do MVP

---

## Estimativa de Tempo

| Tarefa | Dias | Dependências |
|--------|------|--------------|
| Deploy Code.gs MARCAS + seed | 0 | Acesso ao Apps Script |
| Calculadora | 1 | Receitas com selects (pronto) |
