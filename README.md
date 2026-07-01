# Figma Clone

A real-time collaborative design canvas built with Next.js, Liveblocks, and PostgreSQL. Create design rooms, draw shapes, add text, sketch with a pencil tool, and edit together with live multiplayer sync.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Liveblocks](https://img.shields.io/badge/Liveblocks-3-6366f1)

## Live demo
- https://figma-two-puce.vercel.app/

## Features

- **Real-time collaboration** — Live cursors, presence, and instant layer sync via Liveblocks
- **Design canvas** — Rectangles, ellipses, text, and freehand paths
- **Layer panel** — Select, reorder, and edit layer properties (position, size, colors, opacity, fonts)
- **Room management** — Create, rename, and delete design files from a dashboard
- **Sharing** — Invite collaborators by email to shared rooms
- **Auth** — Email/password sign-up and sign-in with NextAuth (JWT + credentials)
- **Undo / redo** — Canvas history for design edits

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Database | [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io) |
| Auth | [NextAuth.js v5](https://authjs.dev) (credentials, JWT) |
| Realtime | [Liveblocks](https://liveblocks.io) |
| Drawing | [perfect-freehand](https://github.com/steveruizok/perfect-freehand) |

## Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) 10+
- PostgreSQL database (local or hosted)
- [Liveblocks](https://liveblocks.io) account (free tier works)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/sanjaybalnad23/figma
cd figma
pnpm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret for NextAuth JWT signing. Generate with `npx auth secret` |
| `LIVEBLOCKS_PUBLIC_KEY` | Public key from the [Liveblocks dashboard](https://liveblocks.io/dashboard) |
| `LIVEBLOCKS_SECRET_KEY` | Secret key from the Liveblocks dashboard |

Example `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/figma"
AUTH_SECRET="your-generated-secret"
LIVEBLOCKS_PUBLIC_KEY="pk_dev_..."
LIVEBLOCKS_SECRET_KEY="sk_dev_..."
```

### 3. Set up the database

```bash
pnpm db:push
```

Or run migrations if you prefer:

```bash
pnpm db:migrate
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm check` | Lint + typecheck |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript compiler |
| `pnpm db:push` | Push Prisma schema to the database |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm format:write` | Format code with Prettier |

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── signin/               # Login
│   ├── signup/               # Registration
│   ├── dashboard/            # Room list & editor routes
│   ├── actions/              # Server actions (auth, rooms)
│   └── api/
│       ├── auth/             # NextAuth handlers
│       └── liveblocks-auth/  # Liveblocks session auth
├── components/
│   ├── canvas/               # Canvas, layers, selection tools
│   ├── dashboard/            # Room grid, create room, user menu
│   ├── liveblocks/           # Liveblocks room provider
│   ├── sidebars/             # Layers panel, properties, share menu
│   └── toolsbar/             # Toolbar (shapes, pencil, zoom, undo)
├── hooks/                    # Canvas hooks
├── server/
│   ├── auth/                 # NextAuth config
│   └── db.ts                 # Prisma client
├── types/                    # Layer & canvas types
└── proxy.ts                  # Auth guard for /dashboard routes
prisma/
└── schema.prisma             # User, Room, RoomInvite models
```

## How it works

### Authentication

Users register with email and password (hashed with bcrypt). NextAuth issues a JWT session. Dashboard routes are protected — unauthenticated users are redirected to `/signin`.

### Rooms

Each design file is a **Room** owned by a user. Rooms are stored in PostgreSQL; canvas state lives in Liveblocks storage keyed as `room:{roomId}`.

### Collaboration

When a user opens a room, the app:

1. Verifies they own the room or have a **RoomInvite**
2. Requests a Liveblocks session from `/api/liveblocks-auth`
3. Syncs layers, cursors, and presence in real time

### Canvas

Layers (rectangles, ellipses, text, paths) are stored as Liveblocks `LiveMap` / `LiveObject` structures. The sidebar exposes property editing; the toolbar handles creation tools, zoom, and history.

## Deployment

This app works well on [Vercel](https://vercel.com) with a hosted PostgreSQL provider (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)).

1. Push your repo and import the project in Vercel
2. Add all environment variables from `.env.example`
3. Run `pnpm db:migrate` against your production database
4. Deploy

For Docker or other hosts, set `SKIP_ENV_VALIDATION=1` during build if env vars are injected at runtime.

## License

Private — see repository settings for license details.
