# ARQUITETURA — croche-app

## Stack
- Front + proxy: Next.js minimal na Vercel (sem Prisma, sem NextAuth no MVP)
- Backend: Google Apps Script Web App (container-bound na planilha)
- Banco: Google Sheets no Drive da cliente (TEMPLATE_MASTER: Projeto Croche)

## Abas (fonte da verdade = cabeçalho físico da planilha)
- LINHAS: id | marca | nome_linha | cor | peso_novelo_g | preco_pago | preco_por_g
- DIFICULDADES: id | nome | fator_multiplicador | descricao
- RECEITAS: id | nome_item | linha_usada | peso_necessario_g | dificuldade_id | valor_base_g | margem_pct

## Contratos
- GET: `?action=seed` cria abas; `?table_name=X&limit=200&offset=0` lê; `?url=` opcional p/ espaço do cliente
- POST JSON: action=create|update|delete|create_table, sempre por `id`, nunca por nº linha
- Regras: `_lineIndex` só interno, `line_index<=1` bloqueado, `preco_por_g = preco_pago/peso_novelo_g` auto em LINHAS, `LockService 10s` na escrita
- Código validado: `apps-script/Code.gs` v3 (seed + CRUD testados em 01/10/2026)

## Front mobile-first (foco do projeto)
- Container máx 480px, inputs mín 44px, botões mín 48px, fonte 16px (sem zoom iOS)
- Breakpoint 760px só empilha, nunca esconde marca
- Validar toda tela no celular antes de commitar

## Segurança MVP
- Web App: Executar como Eu, acesso Qualquer pessoa (com validação interna depois)
- `sheet_id`/`API_KEY` só server-side Vercel + PropertiesService (não no browser)
- Próximo: `USUARIOS` + login no drive central, controle `LOG_ACESSOS`

## Fora de escopo (v2)
Pedidos, multi-tenant Postgres, NextAuth completo, upload fotos, pagamento.
