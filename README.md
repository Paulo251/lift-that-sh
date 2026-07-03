# Lift That Sh

Aplicação full-stack de tracking de treinos de musculação. Permite consultar um
catálogo de exercícios, montar rotinas de treino, registrar séries em tempo
real durante a sessão (peso, repetições e tipo de série) e acompanhar o
histórico e a evolução de carga por exercício.

O projeto segue o formato **API client**: backend API-only servindo JSON e
frontend SPA que consome a API via REST.

## Funcionalidades

- Registro, login e logout com JWT (revogação de token no servidor)
- Catálogo de exercícios com busca e filtros por grupo muscular, equipamento e categoria
- CRUD de treinos com adição, remoção e reordenação de exercícios, com metas de séries e repetições
- Sessões de treino a partir de uma rotina ou livres, com registro de séries em tempo real
- Oito tipos de série: aquecimento, normal, drop set, super set, falha, rest-pause, negativa e pirâmide
- Duplicação da última série com um toque
- Timer de descanso configurável (30s a 5min) com início automático a cada série registrada
- Cálculo de volume total da sessão (Σ peso × repetições, excluindo aquecimento)
- Histórico de sessões e gráfico de evolução de carga por exercício, com recorde pessoal (PR)
- Painel administrativo para gestão de usuários e do catálogo de exercícios
- Notificações de sucesso e erro via toasts, com estados de loading e empty em todas as telas
- Interface dark, mobile-first, pensada para uso na academia

## Stack

| Camada        | Tecnologias                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| Backend       | Ruby on Rails 8 (API-only), PostgreSQL 16, Puma                              |
| Autenticação  | Devise + devise-jwt (revogação via `jti`)                                    |
| Serialização  | Serializers manuais (`app/serializers`)                                      |
| Frontend      | React 18, Vite, TypeScript, React Router, TanStack Query                     |
| UI            | Tailwind CSS, shadcn/ui, Recharts, sonner (toasts), lucide-react (ícones)    |
| Infraestrutura| Docker + Docker Compose (`db`, `api`, `web`)                                 |

## Arquitetura

```
┌─────────────┐      REST/JSON       ┌─────────────┐       SQL        ┌────────────┐
│     web     │ ───────────────────► │     api     │ ───────────────► │     db     │
│ React + Vite│   Bearer token JWT   │  Rails API  │                  │ PostgreSQL │
│    :5173    │ ◄─────────────────── │    :3000    │ ◄─────────────── │   :5432    │
└─────────────┘                      └─────────────┘                  └────────────┘
```

- CORS habilitado via `rack-cors`, restrito às origens configuradas
- Todas as rotas de treino e sessão são escopadas pelo usuário autenticado
- Rotas administrativas exigem usuário com perfil de administrador

## Como executar

### Pré-requisitos

- Docker com o plugin Compose

### Subindo o ambiente

```bash
cp .env.example .env
docker compose up --build
```

Na inicialização, a API executa automaticamente `db:prepare` (criação do banco
e migrations) e `db:seed` (catálogo com cerca de 40 exercícios e o usuário
administrador).

| Serviço  | URL                                        |
| -------- | ------------------------------------------ |
| Frontend | http://localhost:5173                      |
| API      | http://localhost:3000 (healthcheck: `/up`) |

### Usuário administrador

Criado pelo seed com as credenciais definidas em `ADMIN_EMAIL` e
`ADMIN_PASSWORD` (padrão: `admin@liftthatsh.com` / `admin123`). O painel fica
disponível em `/admin`, acessível pelo ícone de escudo no cabeçalho.

## Variáveis de ambiente

Definidas no arquivo `.env` (ver `.env.example`).

| Variável          | Descrição                                            | Padrão                                                            |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| `POSTGRES_USER`   | Usuário do PostgreSQL                                | `postgres`                                                        |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL                                | `postgres`                                                        |
| `POSTGRES_DB`     | Nome do banco de dados                               | `lift_that_sh_development`                                        |
| `DATABASE_URL`    | String de conexão usada pelo Rails                   | `postgres://postgres:postgres@db:5432/lift_that_sh_development`   |
| `JWT_SECRET`      | Segredo de assinatura dos tokens JWT                 | —                                                                 |
| `SECRET_KEY_BASE` | Secret key base do Rails                             | —                                                                 |
| `CORS_ORIGINS`    | Origens permitidas no CORS (separadas por vírgula)   | `http://localhost:5173`                                           |
| `VITE_API_URL`    | URL da API consumida pelo frontend                   | `http://localhost:3000`                                           |
| `ADMIN_EMAIL`     | Email do administrador criado no seed                | `admin@liftthatsh.com`                                            |
| `ADMIN_PASSWORD`  | Senha do administrador criado no seed                | `admin123`                                                        |

> Em produção, defina valores próprios para `JWT_SECRET`, `SECRET_KEY_BASE` e
> as credenciais do administrador.

## API

Autenticação via header `Authorization: Bearer <token>`.

### Autenticação

| Método   | Rota             | Descrição                                      |
| -------- | ---------------- | ---------------------------------------------- |
| `POST`   | `/auth/register` | Cria conta — `{ user: { name, email, password } }` |
| `POST`   | `/auth/login`    | Autentica — `{ user: { email, password } }`    |
| `DELETE` | `/auth/logout`   | Revoga o token atual                           |
| `GET`    | `/me`            | Dados do usuário autenticado                   |

### Exercícios

| Método | Rota                       | Descrição                                                    |
| ------ | -------------------------- | ------------------------------------------------------------ |
| `GET`  | `/exercises`               | Lista com filtros `muscle_group`, `equipment`, `category`, `q` |
| `GET`  | `/exercises/:id`           | Detalhe do exercício                                          |
| `GET`  | `/exercises/:id/progress`  | Evolução de carga (carga máxima e volume por data)            |

### Treinos

| Método   | Rota                       | Descrição                                                        |
| -------- | -------------------------- | ---------------------------------------------------------------- |
| `GET`    | `/workouts`                | Lista os treinos do usuário                                       |
| `POST`   | `/workouts`                | Cria treino — `{ name, description, notes }`                      |
| `GET`    | `/workouts/:id`            | Detalhe com exercícios ordenados                                  |
| `PATCH`  | `/workouts/:id`            | Atualiza treino                                                   |
| `DELETE` | `/workouts/:id`            | Remove treino (sessões realizadas são preservadas)                |
| `POST`   | `/workouts/:id/exercises`  | Substitui a lista de exercícios (adição, remoção e reordenação)   |

### Sessões e séries

| Método   | Rota                       | Descrição                                                        |
| -------- | -------------------------- | ---------------------------------------------------------------- |
| `POST`   | `/sessions`                | Inicia sessão — `{ workout_id }` opcional (copia os exercícios)   |
| `GET`    | `/sessions`                | Histórico de sessões                                              |
| `GET`    | `/sessions/:id`            | Detalhe com exercícios e séries                                   |
| `PATCH`  | `/sessions/:id`            | Finaliza — `{ status: "completed", duration_seconds, notes }`     |
| `POST`   | `/sessions/:id/exercises`  | Adiciona exercício à sessão — `{ exercise_id }`                   |
| `POST`   | `/sessions/:id/set_logs`   | Registra série — `{ session_exercise_id, weight, reps, set_type, rpe }` |
| `PATCH`  | `/set_logs/:id`            | Atualiza série                                                    |
| `DELETE` | `/set_logs/:id`            | Remove série                                                      |

Valores aceitos em `set_type`: `warmup`, `normal`, `drop_set`, `super_set`,
`failure`, `rest_pause`, `negative`, `pyramid`.

### Administração (requer perfil admin)

| Método   | Rota                      | Descrição                                                          |
| -------- | ------------------------- | ------------------------------------------------------------------ |
| `GET`    | `/admin/users`            | Lista usuários                                                      |
| `POST`   | `/admin/users`            | Cria usuário — `{ name, email, password, admin }`                   |
| `PATCH`  | `/admin/users/:id`        | Atualiza usuário (senha opcional)                                   |
| `DELETE` | `/admin/users/:id`        | Remove usuário (auto-exclusão bloqueada)                            |
| `GET`    | `/admin/exercises`        | Lista o catálogo com contagem de uso em treinos                     |
| `POST`   | `/admin/exercises`        | Cria exercício                                                      |
| `PATCH`  | `/admin/exercises/:id`    | Atualiza exercício                                                  |
| `DELETE` | `/admin/exercises/:id`    | Remove exercício; treinos que o usavam são mantidos sem o vínculo   |

## Modelo de dados

| Entidade          | Papel                                                              |
| ----------------- | ------------------------------------------------------------------ |
| `User`            | Conta de acesso; flag `admin` controla o painel administrativo      |
| `Exercise`        | Catálogo global: grupo muscular, equipamento e categoria            |
| `Workout`         | Rotina de treino do usuário                                         |
| `WorkoutExercise` | Exercício dentro de um treino, com posição e metas de séries/reps   |
| `WorkoutSession`  | Execução real de um treino (status, duração, data)                  |
| `SessionExercise` | Exercício dentro de uma sessão                                      |
| `SetLog`          | Série registrada: peso, repetições, tipo, RPE e descanso            |

Todas as chaves estrangeiras são indexadas. A exclusão de um treino não afeta
o histórico (`workout_id` da sessão é anulado) e a exclusão de um exercício do
catálogo preserva os treinos, removendo apenas o vínculo.

## Estrutura do projeto

```
lift-that-sh/
├── docker-compose.yml
├── .env.example
├── api/                    # Rails API-only
│   ├── app/
│   │   ├── controllers/    # REST + namespace admin + Devise customizado
│   │   ├── models/
│   │   └── serializers/
│   ├── config/             # rotas, CORS, Devise, locales
│   └── db/                 # migrations e seeds
└── web/                    # React + Vite + TypeScript
    └── src/
        ├── components/     # componentes do app + ui (shadcn/ui)
        ├── context/        # autenticação
        ├── hooks/          # TanStack Query
        ├── lib/            # utilitários e constantes
        ├── pages/
        └── services/       # cliente HTTP e tipos da API
```

## Comandos úteis

```bash
# Console do Rails
docker compose exec api bundle exec rails console

# Status das migrations
docker compose exec api bundle exec rails db:migrate:status

# Verificação de tipos do frontend
docker compose exec web npx tsc --noEmit

# Logs de um serviço
docker compose logs -f api

# Recriar o banco do zero
docker compose down -v && docker compose up --build
```

## Design system

Tema dark por padrão, com tokens definidos em `web/tailwind.config.ts` e
`web/src/index.css` seguindo a regra 60/30/10:

| Proporção | Papel                          | Cor                                  |
| --------- | ------------------------------ | ------------------------------------ |
| 60%       | Fundo, cards e bordas          | Azul marinho `#0B1E3B`               |
| 30%       | Texto e elementos secundários  | Branco `#E5EEF7` / Azul claro `#38BDF8` |
| 10%       | CTAs, PRs e destaques          | Amarelo `#FACC15`                    |

Tipografia condensada (Oswald) nos títulos, layout mobile-first com navegação
inferior e badges coloridos por tipo de série.
