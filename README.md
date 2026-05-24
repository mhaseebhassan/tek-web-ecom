# Tekron: Secure Real-Time MERN E-Commerce Platform

Tekron is a premium tech e-commerce platform built for the **Advanced Web Technologies** lab final. It uses a **Next.js 14** storefront and a standalone **Express.js** API with **MongoDB**, **Passport Local + JWT**, **Redis caching**, and **Socket.IO** real-time notifications.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, native `fetch` API client |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | Passport Local Strategy, JWT access token, HTTP-only refresh cookie rotation |
| Cache | Redis (graceful fallback if unavailable) |
| Real-time | Socket.IO |

## Project Structure

```
tekron/
├── frontend/          # Next.js storefront + admin UI
├── backend/           # Express REST API + Socket.IO
├── README.md
├── ADV_WEB_FINAL_FEATURES.md
├── MIGRATION_SUMMARY.md
├── DELETED_OR_REMOVED_FILES.md
└── FINAL_COMPLETION_CHECKLIST.md
```

## Requirements

- Node.js 18+
- MongoDB (`mongod` on `mongodb://127.0.0.1:27017`)
- Redis (`redis://localhost:6379`) — optional; app runs without it

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment files

```bash
cd backend
cp .env.example .env

cd ../frontend
cp .env.local.example .env.local
```

Set strong values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `backend/.env`.

### 3. Seed database

```bash
cd backend
npm run seed:admin
npm run seed:products
# or: npm run seed
```

### 4. Run servers

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

**Or from project root (requires `npm install` at root for `concurrently`):**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tekron.com` | `Admin@12345` |

Register a customer account from `/auth/register` for checkout demos.

## API Overview

Base URL: `http://localhost:5000/api/v1`

| Area | Endpoints |
|---|---|
| Health | `GET /health` |
| Auth | `POST /auth/register`, `/login`, `/refresh-token`, `/logout`, `GET /me` |
| Products | `GET /products`, `GET /products/:id`, admin CRUD |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH /cart/items`, `DELETE /cart/items/:id` |
| Orders | `POST /orders`, `GET /orders`, `PATCH /orders/:id/cancel` |
| Admin | `GET /admin/dashboard`, `/orders`, `/customers`, etc. |
| Reviews | `GET /reviews/product/:id`, `POST` (authenticated, ordered users) |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read` |
| Upload | `POST /upload` (admin, multipart image) |

## Security Features

- Helmet, CORS whitelist (`FRONTEND_URL`), compression
- Global + auth-specific rate limiting
- Joi validation middleware
- Passport Local login + hashed passwords
- JWT access token (15m) + rotated refresh token in HTTP-only cookie
- Role-based authorization (`customer`, `admin`)
- Backend order total recalculation from MongoDB product prices
- Passwords and refresh tokens never returned in API JSON

## Viva Demo Flow

1. Show monorepo structure (`frontend/` + `backend/`).
2. Login via Postman or UI → show JWT + refresh cookie.
3. Hit `GET /api/v1/products` twice → show Redis `Cache HIT` in backend logs.
4. Place order as customer → admin dashboard receives Socket.IO `new-order` toast.
5. Admin updates order status → customer `/orders` receives `order-status-updated`.
6. Show `backend/src/app.js` middleware stack and global error handler.

## Docker Compose

```bash
# Create root .env with JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
docker compose up --build
docker compose exec backend npm run seed
```

## Troubleshooting

| Issue | Fix |
|---|---|
| `ECONNREFUSED` MongoDB | Start `mongod` or check `MONGO_URI` |
| Redis errors in console | Start Redis or ignore — caching is disabled automatically |
| 401 on checkout | Log in first; checkout requires authentication |
| Admin access denied | Use `admin@tekron.com` / `Admin@12345` |
| Images not loading | Use `/filename.png` in `frontend/public` or a full HTTPS URL |

---

Built by [Muhammad Haseeb Hassan](https://github.com/mhaseebhassan)
