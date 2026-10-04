# Rotas do Projeto

## Rotas Públicas
| Rota | Método | Descrição |
|------|--------|-----------|
| /login | GET | Entrar (valida USUARIOS) |
| /register | GET | Cadastro público (papel user) |

## Rotas Privadas (Autenticadas)
| Rota | Método | Descrição |
|------|--------|-----------|
| / | GET | Dashboard artesã (welcome + contadores estoque/receitas + atalho precificação) |
| /linhas | GET | Cadastro de linhas (marca via select de MARCAS, cards com novelo/badges/R$/g) |
| /marcas | GET | Cadastro de marcas |
| /dificuldades | GET | Cadastro de dificuldades |
| /receitas | GET | Cadastro de receitas molde (nome + dificuldade + qtd cores com stepper, badge nº cores) |
| /precificacao | GET | Precificação por cor com modos Por dificuldade / Por hora (slots por cor, banner + barra proporção) |
| /pecas-prontas | GET | Próximo passo (Fase 7): lista de peças criadas via botão Criar peça na precificação |
| /usuarios | GET | Admin: CRUD de usuários |
| /mais | GET | Hub mobile: Marcas, Dificuldades, Precificação, Usuários (admin), Sair |

## Rotas de API
| Rota | Método | Descrição | Auth |
|------|--------|-----------|------|
| /api/health | GET | Status web + Sheets | Não |
| /api/login | POST | Valida email+senha, seta cookie, grava LOG_ACESSOS | Não |
| /api/register | POST | Cadastro público (user) | Não |
| /api/logout | POST | Limpa cookie | Sim |
| /api/me | GET | Sessão atual | Sim |
| /api/linhas | GET/POST | Proxy LINHAS | Sim |
| /api/marcas | GET/POST | Proxy MARCAS | Sim |
| /api/dificuldades | GET/POST | Proxy DIFICULDADES | Sim |
| /api/receitas | GET/POST | Proxy RECEITAS | Sim |
| /api/pecas-prontas | GET/POST | Próximo passo (Fase 7): proxy PECAS_PRONTAS | Sim |
| /api/usuarios | GET/POST | Proxy USUARIOS (somente admin) | Admin |

## Fluxos
Login (`/login`) → cookie `croche_user` → dashboard `/` → CRUDs via `/api/*` → Apps Script `/exec` → Sheets.
Navegação mobile: header glass sticky + rodapé fixo com SVG (Início, Linhas, Receitas, Mais) + hub `/mais`.
Padrão de telas: form em `.card` com labels, lista em `.card-click` com badges, `try/catch` + botão Tentar de novo.
