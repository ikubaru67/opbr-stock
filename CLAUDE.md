# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack
Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind v4 (PostCSS, no config file) + Prisma 7 ORM over Neon Postgres (serverless, via `@prisma/adapter-neon` + `ws`). Auth is JWT (`jsonwebtoken` + `bcryptjs`) in an httpOnly `token` cookie. Package manager is **npm**.

## Commands
- Install deps: `npm install`
- Dev server: `npm run dev` (Next 16 + Turbopack; serves on :3000, falls back to :3001 if occupied)
- Production build: `npm run build`
- Start prod build: `npm run start`
- Lint: `npm run lint` (eslint flat config, `eslint-config-next`)
- Regenerate Prisma client: `npm run db:generate` (outputs to `src/generated/prisma`)
- Push schema to DB: `npm run db:push`
- Seed DB (admin user + character list): `npm run seed` (runs `prisma/seed.mjs` via `tsx`)

There are **no test scripts** and no test framework configured.

## Environment
Required vars (present in `.env`/`.env.local`, committed as test values):
- `DATABASE_URL` — Neon Postgres connection string
- `JWT_SECRET` — signing secret (`src/lib/auth.ts` falls back to a dev secret if unset)
- `CRON_API_KEY` — guards the GitHub Actions data-sync cron
Post-deploy on Vercel: `npx prisma db push && npm run seed`.

## Architecture (read-across view)

### The app is a single-page OPBR account storefront
`src/app/page.tsx` is one large client component (~730 lines) holding all tab/filter/modal state in `useState`. There is no global store (no Redux/Zustand) and no data-fetching lib (no React Query/SWR) — client components call internal API routes directly with `fetch({ cache: "no-store" })`. `src/app/account/[code]/page.tsx` is the only other public page (per-account detail). Vendor "proxy" search results are client-only and never persisted; only `source: "own"` accounts live in the DB.

### Admin is inline, not a real dashboard
`/admin` is a stub that redirects home. Admin CRUD happens via modals inside `page.tsx`, gated by whether `/api/admin/check` returns `admin: true` on mount. Protected mutations (account create/update/delete) check a token per-route via `verifyToken()` in `src/lib/auth.ts` — there is **no middleware** and **no tests**.

### API routes (`src/app/api/`)
- `auth/login` / `auth/logout` — set/clear the `token` cookie.
- `admin/check` — `verifyToken()` → `{ admin }`.
- `accounts` — GET (filter by server/characters/source/status/sort/search/pagination; `extreme` flag driven by `EX_CHAR_NAMES`) and protected POST.
- `accounts/[id]` — GET by `code` (note: uses `where: { code: id }`, inconsistent with PUT/DELETE which use the numeric `id`); protected PUT/DELETE.
- `characters` — lists the `Character` table.
- `proxy/characters`, `proxy/customv1` (shokan.org `/getAccount`), `proxy/customv2` (vendor `/search`) — server-side proxies to external OPBR vendor APIs (`http://111.229.9.51:3001`, `https://www.shokan.org`), all using `AbortSignal.timeout`. Endpoints are hardcoded.

### Domain mapping layer (`src/lib/mapping.ts`)
This is the core translation module between DB/English character names, Chinese vendor names (`CHAR_TO_CN`/`CN_TO_CHAR`), and shokan codes (`CHAR_TO_SHOKAN`/`SHOKAN_TO_CHAR`). Key exports: `CHARACTERS`, `CHAR_IMAGE`, `SERVERS`, `SERVER_COLORS`, `parseShokanRoles`, `parseOpbrChars`, `buildShokanRoles`, `buildOpbrCharsAny`, `sortAccounts`, and the `ProxyAccount`/`ApiChar` types. Raw vendor response interfaces live in `src/lib/types.ts`. Edit this file when adding characters or changing how vendor listings map to stored accounts.

### Prisma (`src/lib/prisma.ts`, `prisma/schema.prisma`)
Client is generated into `src/generated/prisma` and instantiated as a `globalThis`-cached singleton (dev). Models: `Account` (unique `code`, `characters[]`, server, diamonds, fragments, price, source, status, os, loginVia), `Character` (name, shokanCode, imageUrl, server, sortOrder), `User` (username, passwordHash). The seed (`prisma/seed.mjs`) creates the admin (`admin`/`admin123`) and ~34 characters.

## Before writing Next.js code
Per `AGENTS.md`, this Next.js has breaking changes vs. training data. Consult `node_modules/next/dist/docs/` and heed deprecation notices before implementing routes, config, or SSR patterns.
