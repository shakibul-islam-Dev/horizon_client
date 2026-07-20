# Horizon Marketplace — Client Agent Guide

## Quick Commands

- `npm run dev` — dev server on `localhost:3000`
- `npm run build` — production build
- `npm run lint` — ESLint (next core-web-vitals + typescript presets)
- No test framework configured; no test commands exist

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Shadcn UI (base-nova) · Motion · TanStack React Query · Better Auth · Stripe · MongoDB · Recharts · Lucide React

## Architecture

```
src/
  app/          — App Router pages (route segments)
  components/
    ui/         — Shadcn + custom UI primitives (36 files)
    layout/     — Navbar, Footer, MobileDrawer
    auth/       — ProtectedRoute wrapper
    home/       — Homepage section components (12)
    ai/         — Chat assistant, content generator, recommendations
  features/
    cart/       — CartContext + StickyCartButton
    wishlist/   — WishlistContext
  hooks/        — React Query hooks (one per domain)
  lib/
    api.ts      — Centralized ApiClient class (all backend calls go through here)
    api-services.ts — Typed service functions wrapping ApiClient
    auth.ts     — Better Auth server config (DO NOT MODIFY)
    auth-client.ts — Better Auth React client
    auth-context.tsx — useAuth() React context
    stripe.ts   — Stripe server SDK (server-only)
    utils.ts    — cn() helper
  providers/    — QueryProvider, ThemeProvider, ToastProvider
  services/     — about.ts, chat.ts
  types/        — Shared TS interfaces (index.ts)
  constants/    — prompts.ts
```

## Key Facts

- Backend API base: `NEXT_PUBLIC_URL` env var (default `http://localhost:5000`). All fetch calls go to `${BASE}/api/...`
- Auth base: `BETTER_AUTH_URL` env var (`http://localhost:3000`). Auth API route: `src/app/api/auth/[...all]/route.ts`
- Stripe checkout: `src/app/api/checkout_sessions/route.ts` — creates Stripe Checkout sessions
- Path alias: `@/*` → `./src/*`
- Font: Poppins (imported via `@fontsource/poppins` in globals.css)
- Theme: Light/Dark via CSS variables + class strategy (`.dark` on `<html>`)
- Image remotes allowed: `picsum.photos`, `placehold.co`, `images.unsplash.com`

## DO NOT Touch

- `src/lib/auth.ts` — Better Auth server config with MongoDB adapter. Altering this breaks auth.
- `src/app/api/auth/[...all]/route.ts` — Auth catch-all route handler.
- `.env` — Contains secrets (MongoDB URI, Stripe keys, Google OAuth credentials, Better Auth secret).

## Data Fetching Pattern

- Use React Query hooks in `src/hooks/` — each wraps a service from `api-services.ts`
- Do NOT create custom fetch hooks; use existing hooks or follow the `useQuery`/`useMutation` pattern
- API responses follow `{ success, message, data, meta? }` shape
- `api-services.ts` maps raw MongoDB `_id` fields to client-side `id` fields

## Protected Routes

- Use `<ProtectedRoute>` from `src/components/auth/ProtectedRoute.tsx`
- Pass `adminOnly` prop for admin-only pages
- Unauthenticated users redirect to `/auth/login`

## Conventions

- Client components use `'use client'` directive
- Toast notifications via `sonner` (import from `@/components/ui/sonner`)
- All new UI components go in `src/components/ui/`; feature-specific UI in `src/features/` or `src/components/<feature>/`
- Use `motion` for animations (not framer-motion — this project uses the `motion` package)
- Grid system: 2 cols mobile, 3 cols tablet, 4-6 cols desktop
