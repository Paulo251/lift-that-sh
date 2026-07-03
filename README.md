# Lift That Sh

Full-stack workout tracking application for weight training. It lets you
browse a catalog of exercises, build workout routines, log sets in real time
during a session (weight, reps, and set type), and track history and load
progression per exercise.

The project follows the **API client** format: an API-only backend serving
JSON and an SPA frontend that consumes the API via REST.

## Features

- Registration, login, and logout with JWT (server-side token revocation)
- Exercise catalog with search and filters by muscle group, equipment, and category
- Workout CRUD with adding, removing, and reordering exercises, including set and rep targets
- Workout sessions started from a routine or freestyle, with real-time set logging
- Eight set types: warmup, normal, drop set, super set, failure, rest-pause, negative, and pyramid
- One-tap duplication of the last set
- Configurable rest timer (30s to 5min) that starts automatically after each logged set
- Total session volume calculation (Σ weight × reps, excluding warmup sets)
- Session history and load progression chart per exercise, with personal record (PR) tracking
- Admin panel for managing users and the exercise catalog
- Success and error notifications via toasts, with loading and empty states on every screen
- Dark, mobile-first interface designed for use at the gym

## Stack

| Layer          | Technologies                                                                 |
| -------------- | ----------------------------------------------------------------------------- |
| Backend        | Ruby on Rails 8 (API-only), PostgreSQL 16, Puma                               |
| Authentication | Devise + devise-jwt (revocation via `jti`)                                    |
| Serialization  | Manual serializers (`app/serializers`)                                        |
| Frontend       | React 18, Vite, TypeScript, React Router, TanStack Query                      |
| UI             | Tailwind CSS, shadcn/ui, Recharts, sonner (toasts), lucide-react (icons)      |
| Infrastructure | Docker + Docker Compose (`db`, `api`, `web`)                                  |

## Architecture

```
┌─────────────┐      REST/JSON       ┌─────────────┐       SQL        ┌────────────┐
│     web     │ ───────────────────► │     api     │ ───────────────► │     db     │
│ React + Vite│   Bearer token JWT   │  Rails API  │                  │ PostgreSQL │
│    :5173    │ ◄─────────────────── │    :3000    │ ◄─────────────── │   :5432    │
└─────────────┘                      └─────────────┘                  └────────────┘
```

- CORS enabled via `rack-cors`, restricted to the configured origins
- All workout and session routes are scoped to the authenticated user
- Admin routes require a user with an admin profile

## How to run it

### Prerequisites

- Docker with the Compose plugin

### Starting the environment

```bash
cp .env.example .env
docker compose up --build
```

On startup, the API automatically runs `db:prepare` (database creation and
migrations) and `db:seed` (a catalog of about 40 exercises plus the admin
user).

| Service  | URL                                        |
| -------- | ------------------------------------------ |
| Frontend | http://localhost:5173                      |
| API      | http://localhost:3000 (healthcheck: `/up`) |

### Admin user

Created by the seed with the credentials defined in `ADMIN_EMAIL` and
`ADMIN_PASSWORD` (default: `admin@liftthatsh.com` / `admin123`). The panel is
available at `/admin`, accessible via the shield icon in the header.

## Environment variables

Defined in the `.env` file (see `.env.example`).

| Variable            | Description                                          | Default                                                            |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| `POSTGRES_USER`     | PostgreSQL user                                       | `postgres`                                                         |
| `POSTGRES_PASSWORD` | PostgreSQL password                                   | `postgres`                                                         |
| `POSTGRES_DB`       | Database name                                          | `lift_that_sh_development`                                         |
| `DATABASE_URL`      | Connection string used by Rails                        | `postgres://postgres:postgres@db:5432/lift_that_sh_development`    |
| `JWT_SECRET`        | JWT signing secret                                      | —                                                                  |
| `SECRET_KEY_BASE`   | Rails secret key base                                   | —                                                                  |
| `CORS_ORIGINS`      | Allowed CORS origins (comma-separated)                  | `http://localhost:5173`                                            |
| `VITE_API_URL`      | API URL consumed by the frontend                        | `http://localhost:3000`                                            |
| `ADMIN_EMAIL`       | Admin email created by the seed                         | `admin@liftthatsh.com`                                             |
| `ADMIN_PASSWORD`    | Admin password created by the seed                      | `admin123`                                                         |

> In production, set your own values for `JWT_SECRET`, `SECRET_KEY_BASE`, and
> the admin credentials.

## API

Authentication via the `Authorization: Bearer <token>` header.

### Authentication

| Method   | Route             | Description                                     |
| -------- | ----------------- | ------------------------------------------------ |
| `POST`   | `/auth/register`  | Creates an account — `{ user: { name, email, password } }` |
| `POST`   | `/auth/login`     | Authenticates — `{ user: { email, password } }` |
| `DELETE` | `/auth/logout`    | Revokes the current token                        |
| `GET`    | `/me`             | Authenticated user's data                        |

### Exercises

| Method | Route                       | Description                                                       |
| ------ | --------------------------- | ------------------------------------------------------------------- |
| `GET`  | `/exercises`                | List with `muscle_group`, `equipment`, `category`, `q` filters       |
| `GET`  | `/exercises/:id`            | Exercise detail                                                     |
| `GET`  | `/exercises/:id/progress`   | Load progression (max load and volume by date)                     |

### Workouts

| Method   | Route                      | Description                                                        |
| -------- | -------------------------- | -------------------------------------------------------------------- |
| `GET`    | `/workouts`                | Lists the user's workouts                                             |
| `POST`   | `/workouts`                | Creates a workout — `{ name, description, notes }`                    |
| `GET`    | `/workouts/:id`            | Detail with ordered exercises                                         |
| `PATCH`  | `/workouts/:id`            | Updates the workout                                                   |
| `DELETE` | `/workouts/:id`            | Removes the workout (completed sessions are preserved)                |
| `POST`   | `/workouts/:id/exercises`  | Replaces the exercise list (add, remove, and reorder)                 |

### Sessions and sets

| Method   | Route                      | Description                                                          |
| -------- | -------------------------- | ----------------------------------------------------------------------|
| `POST`   | `/sessions`                | Starts a session — `{ workout_id }` optional (copies the exercises)   |
| `GET`    | `/sessions`                | Session history                                                       |
| `GET`    | `/sessions/:id`            | Detail with exercises and sets                                        |
| `PATCH`  | `/sessions/:id`            | Finishes — `{ status: "completed", duration_seconds, notes }`         |
| `POST`   | `/sessions/:id/exercises`  | Adds an exercise to the session — `{ exercise_id }`                   |
| `POST`   | `/sessions/:id/set_logs`   | Logs a set — `{ session_exercise_id, weight, reps, set_type, rpe }`   |
| `PATCH`  | `/set_logs/:id`            | Updates a set                                                          |
| `DELETE` | `/set_logs/:id`            | Removes a set                                                          |

Accepted values for `set_type`: `warmup`, `normal`, `drop_set`, `super_set`,
`failure`, `rest_pause`, `negative`, `pyramid`.

### Administration (requires admin profile)

| Method   | Route                     | Description                                                          |
| -------- | ------------------------- | ------------------------------------------------------------------- |
| `GET`    | `/admin/users`            | Lists users                                                          |
| `POST`   | `/admin/users`            | Creates a user — `{ name, email, password, admin }`                  |
| `PATCH`  | `/admin/users/:id`        | Updates a user (password optional)                                   |
| `DELETE` | `/admin/users/:id`        | Removes a user (self-deletion blocked)                                |
| `GET`    | `/admin/exercises`        | Lists the catalog with usage count in workouts                        |
| `POST`   | `/admin/exercises`        | Creates an exercise                                                   |
| `PATCH`  | `/admin/exercises/:id`    | Updates an exercise                                                   |
| `DELETE` | `/admin/exercises/:id`    | Removes an exercise; workouts that used it keep the record without the link |

## Data model

| Entity            | Role                                                                |
| ------------------ | -------------------------------------------------------------------- |
| `User`             | Access account; the `admin` flag controls access to the admin panel  |
| `Exercise`         | Global catalog: muscle group, equipment, and category                |
| `Workout`          | User's workout routine                                               |
| `WorkoutExercise`  | Exercise within a workout, with position and set/rep targets         |
| `WorkoutSession`   | Actual execution of a workout (status, duration, date)               |
| `SessionExercise`  | Exercise within a session                                            |
| `SetLog`           | Logged set: weight, reps, type, RPE, and rest time                   |

All foreign keys are indexed. Deleting a workout does not affect history
(the session's `workout_id` is nulled), and deleting an exercise from the
catalog preserves the workouts, removing only the link.

## Project structure

```
lift-that-sh/
├── docker-compose.yml
├── .env.example
├── api/                    # Rails API-only
│   ├── app/
│   │   ├── controllers/    # REST + admin namespace + custom Devise
│   │   ├── models/
│   │   └── serializers/
│   ├── config/             # routes, CORS, Devise, locales
│   └── db/                 # migrations and seeds
└── web/                    # React + Vite + TypeScript
    └── src/
        ├── components/     # app components + ui (shadcn/ui)
        ├── context/        # authentication
        ├── hooks/          # TanStack Query
        ├── lib/            # utilities and constants
        ├── pages/
        └── services/       # HTTP client and API types
```

## Useful commands

```bash
# Rails console
docker compose exec api bundle exec rails console

# Migration status
docker compose exec api bundle exec rails db:migrate:status

# Frontend type checking
docker compose exec web npx tsc --noEmit

# Logs for a service
docker compose logs -f api

# Recreate the database from scratch
docker compose down -v && docker compose up --build
```

## Design system

Dark theme by default, with tokens defined in `web/tailwind.config.ts` and
`web/src/index.css` following the 60/30/10 rule:

| Proportion | Role                            | Color                                 |
| ---------- | -------------------------------- | -------------------------------------- |
| 60%        | Background, cards, and borders   | Navy blue `#0B1E3B`                    |
| 30%        | Text and secondary elements      | White `#E5EEF7` / Light blue `#38BDF8` |
| 10%        | CTAs, PRs, and highlights        | Yellow `#FACC15`                       |

Condensed typography (Oswald) for headings, mobile-first layout with bottom
navigation, and color-coded badges by set type.
