# Plano de Desenvolvimento — Croche App

## Status Atual

| Fase | Status | Descrição |
|------|--------|-----------|
| Fase 1: Backend Sheets | ✅ | Apps Script v3 + seed/migrate validados |
| Fase 2: Web + Auth | ✅ | Next root na Vercel, login com senha, rotas protegidas |
| Fase 3: Cadastros | 🟡 | Marcas/Dificuldades/Receitas criados, falta pendência MARCAS no Apps Script |
| Fase 4: Calculadora | ⬜ | Preço da peça a partir da receita |

---

## Fase 1: Backend Sheets ✅
- CRUD por `id`, trava cabeçalho, `preco_por_g` auto, `limit` default 200, `LockService`

---

## Pendente

### Prioridade Alta
1. **Colar Code.gs com MARCAS no Apps Script** — seed não criou a aba (backend ainda antigo)
2. **Calculadora de preço** — `custo_material + mao_obra + margem` na receita

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
