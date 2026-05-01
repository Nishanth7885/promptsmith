# Prompt Smith

A Next.js 14 storefront selling 4,029 expert AI prompts. Built with TypeScript, Tailwind, SQLite (Drizzle), Auth.js v5, Resend, and Cashfree. Deploys as a single Node service to a VM.

Live at [promptsmith.ink](https://promptsmith.ink).

## What's in the app

- **Marketing site:** landing, browse, category, prompt detail, search (Fuse.js), preview.
- **User accounts:** email/password + Google OAuth, email verification, password reset.
- **Multi-currency checkout:** INR via Cashfree. USD shows a waitlist until Cashfree cross-border is approved.
- **Coupons:** percent or flat-amount, currency-scoped, max-uses, expiry. 100%-off coupons work as free orders.
- **Admin (`/admin`, role-gated):** dashboard, orders, users, coupons, pricing (live edit), traffic, waitlist.
- **Receipts + tokens:** Resend transactional email, server-signed grant token + DB-backed session.

## Quick start (local dev)

```bash
cd promptvault
cp .env.example .env.local
# Edit .env.local — see the comments inside for what to fill.
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Then open http://localhost:3000.

The first user who signs up with the email in `ADMIN_BOOTSTRAP_EMAIL` automatically becomes an admin.

## Build for production

```bash
npm run build       # produces .next/standalone/
node .next/standalone/server.js
```

Output mode is `'standalone'` — `next.config.js` configures `better-sqlite3` as an external native module so it isn't bundled.

## Architecture

```
                                ┌──────────────────────────┐
        Browser              ┌──┤ /api/cashfree/*          │── Cashfree REST
        ───────              │  │ /api/auth/*              │   (HTTPS, secret)
   /                  ◄─────┤  │ /api/coupon /api/track   │
   /browse, /search          │  │ /api/waitlist /api/geo   │
   /category/[slug]   │     │  │ (Node runtime)           │
   /prompt/[id]       │     │  └──────────────────────────┘
   /preview           │     │
   /payment/return    │     │  ┌──────────────────────────┐
   /signup /login     │     └──┤ Static + SSG pages       │
   /account /admin    │        │ (pre-rendered)           │
                              └──────────────────────────┘
                              │
                              ▼
                          ┌────────────┐
                          │  SQLite    │  (better-sqlite3 + Drizzle)
                          │  app.db    │  /var/lib/promptsmith/
                          └────────────┘
```

## Cashfree flow

1. Buyer (logged in) opens checkout modal → `POST /api/cashfree/create-order` with `{ phone, currency, couponCode? }`.
2. Server writes a `CREATED` order row, calls Cashfree to get a `payment_session_id`, returns it.
3. Browser loads the official `cashfree.js` and calls `cashfree.checkout({ paymentSessionId })`.
4. After payment Cashfree redirects to `/payment/return?order_id=…`.
5. Return page calls `/api/cashfree/verify` → server fetches Cashfree, marks order `PAID`, fires receipt email, returns a grant token. Coupon redemption is recorded.
6. Webhook at `/api/cashfree/webhook` (HMAC-SHA256 verified) is the safety net — calls the same idempotent `markOrderPaid`.

For USD, the same flow runs only when `cross_border_enabled=true` in settings. Otherwise the user is offered the waitlist.

## Environment

See [`.env.example`](./.env.example). Bare minimum to boot: `AUTH_SECRET`, `DATABASE_URL`, `RESEND_API_KEY` (or leave blank for dev — emails go to stdout), `CASHFREE_*`.

## Useful scripts

- `npm run db:generate` — author a new migration after editing `src/db/schema.ts`.
- `npm run db:migrate` — apply pending migrations.
- `npm run db:seed` — seed defaults (idempotent).
- `npm run prompts:build` — regenerate `all-prompts.json` + `search-index.json`.

## Deploy (GCP Ubuntu VM, single instance)

See `DEPLOY.md` for the full walkthrough. High level: Nginx → Node `next start` (systemd unit), SQLite at `/var/lib/promptsmith/app.db`, Let's Encrypt via Certbot, env file at `/etc/promptsmith.env`.
