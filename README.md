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

## Demo Profiles

The seed script creates one demo project with four profile PINs:

```text
Maya  1111
Ravi  2222
Nora  3333
Theo  4444
```
