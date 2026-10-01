# AGENTS.md — croche-app

## Comportamento padrão
- Sempre ler `docs/CHECKPOINT.md` antes de agir
- Ao receber "continuar", ler `docs/PROGRESSO.md` e retomar de `## Em Desenvolvimento`
- Fonte da verdade: cabeçalho físico da planilha + `apps-script/Code.gs` (sem Prisma neste projeto)
- Manter `docs/CHECKPOINT.md` atualizado (máx 10 linhas)

## Skills carregadas
- `arquiteto-saas` — Desenvolvimento incremental
- `iniciar-saas` — Scaffold adaptado (sem copiar auth-base completo)

## Stack
- Next.js minimal (App Router) na Vercel
- TypeScript strict
- Google Apps Script + Google Sheets (Drive da cliente)

## Convenção de codificação
- CRUD sempre por `id`, nunca por nº linha; `_lineIndex` só interno
- Uma etapa por vez, mudança cirúrgica, validar com `/exec` real
- Verificação: `GET ?table_name=LINHAS&limit=200` + `POST create/update/delete` por `id`
