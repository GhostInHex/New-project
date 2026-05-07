# The Group Project Ghost

Hackathon MVP for voluntary daily contribution logs in college group projects.

## Phase 1 Setup

Backend:

```bash
cd backend
bun install
cp .env.example .env
bun run seed
bun run dev
```

Frontend:

```bash
cd frontend
bun install
bun run dev
```

The frontend expects the API at `http://localhost:4000/api` unless `VITE_API_URL` is set.

## Production URLs

Backend API:

```text
https://new-project-iaad.onrender.com/api
```

Frontend app:

```text
https://new-project-dun-tau.vercel.app
```

Render backend environment:

```text
NODE_ENV=production
FRONTEND_ORIGIN=https://new-project-dun-tau.vercel.app
```

Vercel frontend environment:

```text
VITE_API_URL=https://new-project-iaad.onrender.com/api
```

## Demo Profiles

The seed script creates one demo project with four email/password accounts:

```text
maya@ghost.test  password123
ravi@ghost.test  password123
nora@ghost.test  password123
theo@ghost.test  password123
```
