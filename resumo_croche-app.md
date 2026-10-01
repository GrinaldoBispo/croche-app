# Resumo da Sessão — croche-app

Data: 2026-10-01
Projeto/Pasta: C:\AEG_Automacao\croche-app
Sessão/Comando: /resumo

## Objetivo (Goal)
- Construir do zero o Croche App: backend Sheets + web Next.js na Vercel com auth, cadastros mobile-first e menu por papel.

## Restrições e Contexto (Constraints / Critical context)
- Etapas simples, uma por vez; mudança cirúrgica; sem copiar auth-base completo.
- Fonte da verdade: cabeçalho físico da planilha + `C:\AEG_Automacao\croche-app\apps-script\Code.gs`.
- Mobile-first: container 480px, inputs 44px, botões 48px.
- Produção: `https://croche-app-one.vercel.app/`, backend `/exec` no Apps Script.

## Progresso (Progress)
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`: v3 validado (seed/migrate, CRUD por id, preco_por_g auto) + USUARIOS/LOG_ACESSOS/MARCAS.
- Web Next root: `/login`, `/register`, `/linhas`, `/marcas`, `/dificuldades`, `/receitas`, `/usuarios`, `/api/*` proxy, middleware de sessão, menu por papel.
- GitHub `GrinaldoBispo/croche-app` + Vercel linkado com `APPS_SCRIPT_URL`.
- Docs: README, ROTAS, PLANO criados; ARQUITETURA/PROGRESSO atualizados.

## Decisões-chave (Key decisions)
- Script por conta do cliente no futuro; TEMPLATE_MASTER local por enquanto.
- Sem auth-base: web mínima sem Prisma/NextAuth.
- Senha em hash SHA-256, nunca texto puro; papel admin/user; user vê só cadastros.

## Próximos passos (Next steps)
- [ ] Colar Code.gs com MARCAS no Apps Script + `?action=seed` (pendência aberta).
- [ ] Calculadora de preço da peça.
- [ ] Filtro admin refinado + onboarding por URL.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`
- `C:\AEG_Automacao\croche-app\src\app\api\login\route.ts`
- `C:\AEG_Automacao\croche-app\src\app\api\usuarios\route.ts`
- `C:\AEG_Automacao\croche-app\src\middleware.ts`
- `C:\AEG_Automacao\croche-app\docs\PROGRESSO.md`
