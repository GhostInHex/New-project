# Project Ghost

> A calm accountability layer for college group projects.

Project Ghost helps student teams make invisible work visible without turning collaboration into surveillance. Teammates create a shared project workspace, post small daily contribution updates, review one another anonymously at the end, and receive two kinds of feedback: a diplomatic team-level reflection and private, growth-oriented coaching.

It is designed around a simple idea: better project conversations start with better project context.

[Live app](https://new-project-dun-tau.vercel.app) · [API health check](https://new-project-iaad.onrender.com/api/health)

## Why it exists

Group projects often fail quietly. Work happens in private, blockers surface late, and the final evaluation is based on memory or whoever speaks the loudest. Project Ghost creates a lightweight record of progress while protecting the social fabric of the team:

- Daily updates are intentionally short and organized by contribution category.
- Peer reviews are anonymous and excluded from public teammate profiles.
- Team insights discuss aggregate patterns rather than naming or shaming individuals.
- Personal coaching is visible only to the person it is about.
- Archived projects preserve the timeline and reflections for future retrospectives.

## Product flow

1. Register or sign in with an email account.
2. Create a project with a description, deadline, member limit, and optional GitHub repository.
3. Share the generated invite code so teammates can join.
4. Log progress in up to three short lines, choosing from UI, Backend, Research, Writing, or Planning. A GitHub link can be attached to an update.
5. Review the shared timeline to see activity, categories, contributors, and project momentum.
6. When the project ends, submit anonymous effort, quality, and collaboration ratings for teammates.
7. Generate a neutral AI diplomat summary for the group and view private coaching based on each member's feedback.

## Key features

### Shared project hub

Create and join multiple projects, manage deadlines, see member counts, and move between active workspaces from one authenticated hub.

### Low-friction contribution logs

Updates are limited to 360 characters and three lines, encouraging a useful daily habit instead of long status reports. Each entry can include a category and a related GitHub URL.

### Timeline and project lifecycle

The team timeline shows progress in context. Projects can be archived after peer review, while logs, ratings, and generated reflections remain available for review.

### Anonymous peer review

Members rate teammates on effort, quality, and collaboration using a 1–5 scale. The API validates project membership, prevents self-ratings, and upserts one review per reviewer/teammate pair.

### Responsible AI feedback

The backend supports Google Gemini for generated reflections and private coaching. If Gemini is unavailable, rate-based local fallbacks keep the experience usable. The team prompt is explicitly instructed to keep negative observations aggregate-only and avoid naming individuals.

## Technology

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Recharts, Lucide React |
| Backend | Bun, Express, Mongoose |
| Data | MongoDB |
| Authentication | JWT stored in an HTTP-only cookie, bcrypt password hashing |
| AI | Google Gemini API with local fallback summaries and retry/timeout handling |
| Deployment | Vercel for the frontend, Render for the API |

## Run locally

### Prerequisites

- [Bun](https://bun.sh) 1.x
- A MongoDB database, local or hosted
- Node.js is not required when using Bun, although the project uses standard JavaScript modules and can be adapted to another package manager.

### 1. Start the backend

```bash
cd backend
bun install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/project-ghost
JWT_SECRET=replace-this-with-a-long-random-secret
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# Optional: use Gemini instead of the built-in local fallback
AI_PROVIDER=local-only
# AI_PROVIDER=gemini
# GEMINI_API_KEY=your-gemini-api-key
# GEMINI_MODEL=gemini-2.5-flash
```

Seed the included demo project and accounts, then start the API:

```bash
bun run seed
bun run dev
```

The API runs at `http://localhost:4000` and its health endpoint is `http://localhost:4000/api/health`.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
bun install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Start Vite:

```bash
bun run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Demo accounts

The seed script creates one project and four demo users. Each uses the password `password123`:

| Email | Profile |
| --- | --- |
| `maya@ghost.test` | Maya · UI systems |
| `ravi@ghost.test` | Ravi · Backend |
| `nora@ghost.test` | Nora · Research |
| `theo@ghost.test` | Theo · Writing |

The seeded project invite code is `GHOST1`.

## Configuration reference

### Backend

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Signs seven-day session tokens |
| `PORT` | No | API port; defaults to `4000` locally and uses Render's port in production |
| `NODE_ENV` | No | Set to `production` to enable secure cross-site cookies |
| `FRONTEND_ORIGIN` | No | Comma-separated allowed frontend origins |
| `AI_PROVIDER` | No | `local-only` by default; set to `gemini` to call Gemini |
| `GEMINI_API_KEY` | No | Single Gemini API key |
| `GEMINI_API_KEYS` | No | Comma-separated key pool for retry/failover |
| `GEMINI_MODEL` | No | Gemini model; defaults to `gemini-2.5-flash` |
| `AI_TIMEOUT_MS` | No | AI request timeout; minimum accepted value is 7000 ms |
| `AI_RETRY_LIMIT` | No | Gemini retry count from 0 to 2 |

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Recommended locally | API base URL; use `http://localhost:4000/api` for local development |

## Scripts

Run these from the relevant directory:

```bash
# backend
bun run dev      # watch mode
bun run start    # production-style server
bun run seed     # seed the demo project and users

# frontend
bun run dev      # Vite development server
bun run build    # production build
bun run preview  # preview the production build locally
```

## Architecture

```text
frontend/src
├── App.jsx                 Route/state shell and authenticated flow
├── components/             Landing, auth, hub, timeline, review, and feedback UI
└── lib/api.js              Cookie-aware API client

backend
├── server.js               Environment loading, database connection, HTTP listener
└── src
    ├── app.js              Express middleware, CORS, routes, health endpoint
    ├── routes/             Auth, projects, logs, and ratings endpoints
    ├── models/             User, Project, Log, and Rating schemas
    ├── middleware/         Session authentication and error handling
    └── services/aiService.js  Gemini integration and local fallbacks
```

The frontend uses a small route state machine with the browser History API rather than a routing dependency. Heavy timeline and peer-review views are lazy-loaded. The backend keeps project membership checks at the API boundary, and protected resources require the `gpg_session` HTTP-only cookie.

## Deployment

The current deployment shape is:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB-compatible deployment

For a production deployment, set `NODE_ENV=production`, configure `FRONTEND_ORIGIN` to the exact frontend origin, provide a strong `JWT_SECRET`, and set `VITE_API_URL` to the backend URL ending in `/api`. Keep Gemini and database credentials in the hosting provider's secret environment configuration rather than committing them.

## Project status

Project Ghost is a functional hackathon MVP. The core end-to-end path is implemented: account creation, project membership, contribution logging, timeline viewing, anonymous review, archiving, and AI/local feedback. The repository currently does not include an automated test suite; production hardening would be the next step before treating it as a high-stakes assessment system.

## Contributing

Issues and pull requests are welcome. For a useful contribution, include:

1. The problem or user scenario being addressed.
2. Reproduction or verification steps.
3. Any changes to environment variables or database behavior.
4. Screenshots or a short recording for UI changes.

## License

No license file is currently included. Until a license is added by the maintainers, treat the repository as source-available for evaluation and do not assume permission to redistribute or use it commercially.
