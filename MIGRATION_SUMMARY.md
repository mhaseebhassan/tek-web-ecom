# Migration Summary — Next.js Monolith → MERN Monorepo

## What Changed

The project was migrated from a Next.js full-stack app (API routes, Prisma/PostgreSQL, NextAuth) to:

- **Frontend:** Next.js 14 UI only — calls Express via `NEXT_PUBLIC_API_BASE_URL`
- **Backend:** Standalone Express API under `/api/v1`
- **Database:** MongoDB + Mongoose
- **Auth:** Passport Local + JWT access + HTTP-only refresh cookie rotation

## Dependencies Removed (Frontend)

- `axios` — replaced with native `fetch` in `frontend/lib/api.js`
- `next-auth` — replaced with `frontend/context/AuthContext.jsx`
- `@prisma/client`, `prisma` — removed entirely

## Dependencies Added

**Backend:** `express`, `mongoose`, `passport`, `passport-local`, `jsonwebtoken`, `redis`, `socket.io`, `helmet`, `joi`, `multer`, `cloudinary`, rate limiting, compression, etc.

**Frontend:** `js-cookie`, `socket.io-client`, `react-hot-toast`

## Key Files Added

| Path | Purpose |
|---|---|
| `backend/src/app.js` | Express app, middleware, routes |
| `backend/server.js` | HTTP server + Socket.IO |
| `backend/src/controllers/*` | MVC controllers |
| `backend/src/services/*` | Business logic |
| `backend/src/middlewares/*` | Auth, cache, validation, rate limits |
| `backend/src/sockets/socket.js` | Real-time events |
| `frontend/lib/api.js` | Native fetch client with token refresh |
| `frontend/context/AuthContext.jsx` | Custom auth state |

## Key Files Removed / Disabled

- `frontend/app/api/**` — no Next.js business API routes
- Prisma schema, migrations, seeds
- NextAuth configuration and `SessionProvider`
- PostgreSQL / `DATABASE_URL` usage

## Remaining Limitations (Honest)

- Guest cart uses `localStorage` until login; then syncs to MongoDB cart API
- Image upload: local disk by default; Cloudinary used only when env vars are set
- `express-mongo-sanitize` is disabled on Express 5 due to `req.query` immutability; Mongoose casting still applies
- Selenium tests may need URL/env updates for the new API base URL
- Payment card fields on checkout are UI-only (no real payment gateway)

## Verification

- No active `axios`, `next-auth`, or `prisma` imports in runtime code
- `npm run build` succeeds in `frontend/`
- Backend loads via `require('./src/app')` and serves `/health`
