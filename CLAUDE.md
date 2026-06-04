# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A time-tracking ("clock") app split into two independent packages:

- `backend/` — Elysia HTTP API running on the **Bun** runtime, backed by PostgreSQL via `postgres.js`.
- `frontend/` — React 19 SPA using **TanStack Router** (file-based routing), Vite, and Tailwind CSS v4.

The two are decoupled: the frontend talks to the backend only over HTTP through a Vite dev proxy. The root `package.json` is vestigial (only stray deps); real work happens inside `backend/` and `frontend/`.

## Commands

Run these from within the respective package directory.

**Database** (from repo root): `docker compose up -d` starts Postgres 18 on `localhost:5432`. It reads `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` from the root `.env`. After first start, apply the schema manually with `Schema.sql` (e.g. `docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < Schema.sql`).

**Backend** (`cd backend`):
- `bun run dev` — watch-mode server on port 3000. Loads env from `../.env` (the root file), so `POSTGRES_*` vars must live there, not in `backend/`.
- No test runner is configured (`bun test` would exit 1).

**Frontend** (`cd frontend`):
- `bun run dev` — Vite dev server on port **3001**.
- `bun run build` / `bun run preview`.
- `bun run test` — Vitest (jsdom + Testing Library). Run a single file: `bunx vitest run path/to/file.test.tsx`; watch a single file: `bunx vitest path/to/file`.

There is no lint script and no monorepo task runner — start backend and frontend in separate terminals.

## Architecture

### Backend: module-per-resource
Each resource lives in `backend/src/modules/<name>/` as a pair: `<name>.route.ts` (Elysia routes + per-route `onError` mapping validation/not-found codes to HTTP statuses) and `<name>.queries.ts` (tagged-template SQL functions returning row arrays). Valibot schemas live separately in `backend/src/schemas/`. Routes are composed in `src/index.ts` via `new Elysia().use(...)`. The single shared `postgres` client is `src/db/client.ts`.

Resources: `projects`, `labels`, `entries`. Entries own the interesting logic — see clock semantics below. Partial updates (`PATCH`) use the `COALESCE(${value ?? null}, column)` pattern so omitted fields keep their existing value.

### Clock / single-active-session invariant
A time entry with `end_time IS NULL` is the *active* session. The DB enforces **at most one** active entry via the partial unique index `one_active_entry` in `Schema.sql`. `PATCH /entries/clock` is a toggle: no active session → clock in; active session for the same project → clock out; active session for a different project → `switchSession` (a transaction that closes the open entry and opens a new one). Preserve this invariant when touching entry queries.

### Date/time handling (fragile — recent bug surface)
Times are `timestamptz` in Postgres. The boundary contract is **ISO instants (UTC) over the wire**:
- Backend `entries.schema.ts` defines `isoInstant` = a valibot string validated as ISO timestamp and transformed to a JS `Date`.
- Frontend uses the **`@js-temporal/polyfill`** `Temporal` API (not `Date`) to convert between the browser's `datetime-local` inputs (local wall-clock, no zone) and UTC instants: local → `Temporal.PlainDateTime.from(...).toZonedDateTime(tz).toInstant()` on submit, and instant → local for display via `toDatetimeLocal`. Keep using Temporal here; mixing in native `Date` parsing reintroduces the timezone bugs this code was rewritten to fix.

### Frontend routing & data flow
File-based routes in `frontend/src/routes/`; `routeTree.gen.ts` is **auto-generated** by the TanStack Router Vite plugin — never edit it by hand. Routes load data in their `loader` (plain `fetch`), with `pendingComponent` / `errorComponent` for states. HTTP helpers live in `src/api/`; UI in `src/components/`.

Requests go to `/api/...`; Vite (`vite.config.ts`) proxies `/api` → `http://localhost:3000` and **strips the `/api` prefix**, so `fetch('/api/entries')` hits the backend's `/entries`. The backend has no `/api` prefix itself.

Import alias: `#/*` maps to `frontend/src/*` (also `@/*`).

> Note: `frontend/README.md` and `src/routes/index.tsx` describe "TanStack **Start**", server functions, and API routes. That is leftover template boilerplate — this app is a plain client-side SPA (`main.tsx` mounts with `ReactDOM.createRoot` + `RouterProvider`). Don't rely on Start-only features.
