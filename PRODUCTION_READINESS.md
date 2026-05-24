# Production Readiness

Tekron is a split MERN e-commerce system:

- `frontend/`: Next.js 14 storefront and admin UI.
- `backend/`: Express API with Mongoose models, Passport local auth, JWT access tokens, refresh-token rotation, Redis caching, and Socket.IO admin notifications.

## Removed Legacy Stack

The old SQL/Prisma/NextAuth implementation has been removed from runtime code and deployment files. Current runtime dependencies are MongoDB, Redis, Express, Mongoose, and Next.js.

## Production Guards

- Backend fails fast in production unless `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are set.
- Admin/product/order APIs require JWT authorization and admin role checks.
- Seed scripts are idempotent and update by stable keys instead of deleting live data.
- Public catalog pages have a local product fallback so the UI remains usable while the API is unavailable.

## Verification Commands

```bash
cd backend
node -e "require('./src/app'); console.log('backend app import ok')"

cd ../frontend
npm run build
```

Docker validation requires Docker Desktop or a compatible Docker engine:

```bash
docker compose up --build
```
