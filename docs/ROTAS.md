# Rotas do Projeto

## Rotas Públicas
| Rota | Método | Descrição |
|------|--------|-----------|
| /login | GET | Entrar (valida USUARIOS) |
| /register | GET | Cadastro público (papel user) |

## Rotas Privadas (Autenticadas)
| Rota | Método | Descrição |
|------|--------|-----------|
| / | GET | Menu por papel (user: Linhas/Marcas/Dificuldades/Receitas; admin: +Usuários) |
| /linhas | GET | Cadastro de linhas (marca via select de MARCAS) |
| /marcas | GET | Cadastro de marcas |
| /dificuldades | GET | Cadastro de dificuldades |
| /receitas | GET | Cadastro de receitas (selects de linhas + dificuldades) |
| /usuarios | GET | Admin: CRUD de usuários |
| /mais | GET | Hub mobile: Marcas, Dificuldades, Usuários (admin), Sair |

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
| /api/usuarios | GET/POST | Proxy USUARIOS (somente admin) | Admin |

## Fluxos
Login (`/login`) → cookie `croche_user` → menu `/` por papel → CRUDs via `/api/*` → Apps Script `/exec` → Sheets.
Navegação mobile: rodapé fixo (Início, Linhas, Receitas, Mais) + topo só marca.
