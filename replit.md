# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Vouch - Ticket Validator (artifacts/mobile)

Expo React Native mobile app. A digital ticket validator with two roles:

**Roles:**
- **Organizer**: Full access — dashboard, events, team, analytics
- **Validator**: Ticket scanning — QR scanner, scan activity, team status, settings

**Auth (demo credentials):**
- Organizer: `organizer@event.com` / `password`
- Validator: `validator@event.com` / `VAL001` / `password`

**Screens:**
- `app/login.tsx` — dual-role login (Organizer / Validator tabs)
- `app/organizer/index.tsx` — organizer dashboard (stats, events, activity)
- `app/organizer/events.tsx` — events with status and progress
- `app/organizer/validators.tsx` — team management with active/inactive toggle
- `app/organizer/analytics.tsx` — hourly charts, scan breakdown, top validators
- `app/validator/index.tsx` — QR camera scanner with result modal
- `app/validator/activity.tsx` — full scan history with status filters
- `app/validator/team.tsx` — team sync and validator leaderboard
- `app/validator/settings.tsx` — profile and sign out

**State:** `context/AuthContext.tsx` — auth + all mock data (AsyncStorage persistence)
**Colors:** `constants/colors.ts` — Vouch dark navy (#1B3A7A) brand palette

**Packages:** expo-camera (~16.1.9) for QR scanning

### API Server (artifacts/api-server)

Express 5 API server. Handles `/api` routes.

### Canvas / Mockup Sandbox (artifacts/mockup-sandbox)

Design prototyping sandbox at `/__mockup`.
