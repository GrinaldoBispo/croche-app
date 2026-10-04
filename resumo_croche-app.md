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

---

# Resumo da Sessão — croche-app (continuação)

Data: 2026-10-01
Projeto/Pasta: C:\AEG_Automacao\croche-app
Sessão/Comando: documentar

## Objetivo (Goal)
- Registrar docs, seed MARCAS e menu inferior mobile.

## Progresso (Progress)
- Seed `MARCAS:criada` no Apps Script (demais abas preservadas).
- `C:\AEG_Automacao\croche-app\src\components\nav.tsx`: rodapé fixo mobile + topo só marca.
- `C:\AEG_Automacao\croche-app\src\app\mais\page.tsx`: hub criado.
- Docs: README/ROTAS/PLANO/PROGRESSO atualizados.

## Decisões-chave (Key decisions)
- Navegação mobile por rodapé com ícones; cadastros auxiliares no `/mais`.

## Próximos passos (Next steps)
- [ ] Calculadora de preço da peça.
- [ ] Filtro admin refinado + onboarding por URL.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\src\components\nav.tsx`
- `C:\AEG_Automacao\croche-app\src\app\mais\page.tsx`
- `C:\AEG_Automacao\croche-app\docs\ROTAS.md`

---

# Resumo da Sessão — croche-app (continuação)

Data: 2026-10-02
Sessão: clone + linhas/precificação

## Objetivo (Goal)
- Clonar `GrinaldoBispo/croche-app`, tornar listas editáveis no modelo clean (toque p/ editar) e criar `/precificacao` por cor.

## Progresso (Progress)
- Clone em `C:\AEG_Automacao\croche-app` + migrate `/exec` OK (`LINHAS:+ textura,quantidade`, `nome_linha->textura copiado`); CRUD create/update/delete por id validado.
- `apps-script/Code.gs`: LINHAS `["id","marca","textura","cor","peso_novelo_g","preco_pago","preco_por_g","quantidade"]` + migrate copia `nome_linha->textura`.
- `/linhas`, `/marcas`, `/dificuldades`, `/receitas`: modelo clean igual `/usuarios` (clique no card, `Atualizar/Cancelar/Excluir` no form).
- `/linhas`: card `Cor · Textura · Marca` + `Preço · Peso · Qtd` + `R$/g`; `/dificuldades`: card `nome - fator`, vírgula `1,3` corrigida (`numBR`); `/receitas`: multi-cor checkbox (`linha_usada` csv) + receita enxuta (só nome+linhas obrig).
- `/precificacao` (nova, só calcula): peso usado por cor, `custo_cor = R$/g_efetivo × peso`, `final = (material + MO) / fator × (1+margem)` — dificuldade DIVIDE, MO/margem/R$/g simulado opcionais; card mostra `Rolo: Xg por R$Y`.
- Docs: PRD 1/4/5 + ROTAS + CHECKPOINT atualizados.
- Commits: `956f8c9`, `757add4`, `7baa3e5`, `b6e7cdf`, `900be73`, `cdb3c08`, `eded1aa` push na `main`.

## Decisões-chave (Key decisions)
- Rename total `nome_linha->textura` com cópia automática no migrate (coluna antiga preservada).
- Receita guarda quais cores; gasto por cor só na `/precificacao` (sem salvar, MVP).
- Dificuldade divide (ajuste do fator feito pelo usuário); média arredondada não serve p/ conferência — usar R$/g exato.

## Próximos passos (Next steps)
- [ ] Commit+push docs (PRD/CHECKPOINT/resumo).
- [ ] Testar precificação 3 cores (ex: 26g+113g+...=294g, ÷1,16).
- [ ] Melhorias futuras: salvar PRECIFICACOES, histórico COMPRAS, filtro admin.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\src\app\precificacao\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\linhas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\receitas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\marcas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\dificuldades\page.tsx`
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`
- `C:\AEG_Automacao\croche-app\docs\PRD.md`
---
# Resumo da Sessão — croche-app
Data: 2026-10-02
Projeto/Pasta: C:\AEG_Automacao\croche-app
Sessão/Comando: /resumo
## Objetivo (Goal)
- Redesign incremental da interface (tema Craft, nav SVG, dashboard, cards) + correções de login e resiliência de carregamento.
## Restrições e Contexto (Constraints / Critical context)
- Mobile-first: container 480px, input 44px, botão 48px, nunca display:none; CRUD sempre por id; uma etapa por vez com build + commit por etapa.
- Fonte da verdade: cabeçalho físico da planilha + C:\AEG_Automacao\croche-app\apps-script\Code.gs; tema em C:\AEG_Automacao\croche-app\src\app\globals.css documentado em C:\AEG_Automacao\croche-app\docs\TEMA.md.
- Produção: https://croche-app-one.vercel.app (Vercel); backend Google Apps Script /exec (cold start lento → timeouts intermitentes).
## Progresso (Progress)
- Passo 1 (6567c24): C:\AEG_Automacao\croche-app\src\app\globals.css (tokens, Plus Jakarta Sans, card/btn/badge/novelo/price/result-banner/welcome) + C:\AEG_Automacao\croche-app\docs\TEMA.md + import em layout.tsx.
- Passo 2 (7a3d67e): C:\AEG_Automacao\croche-app\src\components\nav.tsx — header sticky glass + avatar + pill papel, bottom nav com SVG próprio, indicador ativo por opacity.
- Fix login (e73130b): C:\AEG_Automacao\croche-app\src\app\api\login\route.ts (limit 200, LOG_ACESSOS fire-and-forget), C:\AEG_Automacao\croche-app\src\lib\sheets.ts (rejeita HTML com msg legível), login faz parse defensivo.
- Passo 3 (99aa5fe): dashboard em C:\AEG_Automacao\croche-app\src\app\page.tsx (welcome + contadores) + fix centralização mobile login.
- Passo 4 (f7a67de): home sem menus + cards /linhas (novelo/badges/R$/g) + /precificacao (result-banner + ratio-bar).
- Padrão (51d1787): mesmo padrão em receitas/marcas/dificuldades/usuarios; Labels (510ad14): títulos visíveis nos 8 formulários.
- Ajustes home (c3a63da, 00c8f16): badge admin legível, atalho Nova receita, plural, placeholder textura numérico.
- Resiliência (c3b2827): try/catch + botão Tentar de novo nas 6 telas (linhas caía no carregando por falta de catch no Promise.all).
## Decisões-chave (Key decisions)
- Redesign só no front, sem tocar no backend Sheets; indicador ativo do nav usa opacity (não display:none).
- Login não espera LOG_ACESSOS (economiza 1 roundtrip no Apps Script frio).
- Erro de HTML do /exec vira mensagem legível em vez de SyntaxError.
## Próximos passos (Next steps)
- [ ] Testar fluxo completo no celular em produção após deploys.
- [ ] Backlog: colar Code.gs atual no Apps Script se faltar aba, PropertiesService API_KEY, onboarding por URL, Pedidos v2.
## Arquivos relevantes
- C:\AEG_Automacao\croche-app\src\app\globals.css
- C:\AEG_Automacao\croche-app\docs\TEMA.md
- C:\AEG_Automacao\croche-app\src\components\nav.tsx
- C:\AEG_Automacao\croche-app\src\app\page.tsx
- C:\AEG_Automacao\croche-app\src\app\linhas\page.tsx
- C:\AEG_Automacao\croche-app\src\app\receitas\page.tsx
- C:\AEG_Automacao\croche-app\src\app\precificacao\page.tsx
- C:\AEG_Automacao\croche-app\src\app\login\page.tsx
- C:\AEG_Automacao\croche-app\src\lib\sheets.ts

---

# Resumo da Sessão — croche-app (continuação)

Data: 2026-10-03/04
Sessão: receita molde + precificação modos + docs Fase 7

## Objetivo (Goal)
- Tirar peso/MO/margem do cadastro de receitas; receita vira molde e cor é escolhida na precificação; separar modos de preço; planejar Peças Prontas.

## Progresso (Progress)
- `src/app/receitas/page.tsx`: molde (nome + dificuldade + qtd cores com stepper −/+ 48px); `qtd_cores` gravado, `linha_usada` limpa no save.
- `src/app/precificacao/page.tsx`: N slots de cor por receita (linha + peso, R$/g do estoque); modos Por dificuldade (material ÷ fator) e Por hora ((material + h × R$/h) × (1+margem)); Simular R$/g removido do front; receitas antigas convertidas (qtd derivada, linhas pré-selecionadas).
- `apps-script/Code.gs`: `RECEITAS: ["id","nome_item","dificuldade_id","qtd_cores"]`; migrate `/exec` OK (`RECEITAS:+ qtd_cores`); colunas antigas excluídas na planilha; Trilho Turco com `qtd_cores: 3` validado via GET.
- Ajustes mobile via prints em `prints/`: resultado empilhado com botão full-width; stepper com botões fixos (`.btn` tem `width:100%`).
- Commits: `a997991`, `a4317c3`, `cea26be`, `176559b`, `5c9bd41`, `3a351b1` push na `main`.

## Decisões-chave (Key decisions)
- Receita não guarda cor (mesmo modelo sai em várias cores); cor + peso só na precificação.
- Precificação não salva nada (só calcula) — snapshot fica para a Fase 7 (Peças Prontas).
- `prints/` fora do git (só apoio visual local).

## Próximos passos (Next steps)
- [ ] Fase 7 Peças Prontas: botão Criar peça na precificação + rota `/pecas-prontas` + aba `PECAS_PRONTAS` (`id | receita_id | nome_peca | modo | cores_json | preco_final | criado_em`).
- [ ] Definir a 2ª rota nova com a cliente.
- [ ] Pequeno ajuste na precificação (pendente, depois).
- [ ] Teste mobile em produção do fluxo completo.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\src\app\receitas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\precificacao\page.tsx`
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`
- `C:\AEG_Automacao\croche-app\docs\PROGRESSO.md`
- `C:\AEG_Automacao\croche-app\docs\PLANO.md`
- `C:\AEG_Automacao\croche-app\docs\ROTAS.md`
- `C:\AEG_Automacao\croche-app\docs\ARQUITETURA.md`
- `C:\AEG_Automacao\croche-app\docs\PRD.md`
