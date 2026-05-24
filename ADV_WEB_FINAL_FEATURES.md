# Advanced Web Technologies — Final Features Map

## Project Overview

Tekron is a secure real-time MERN e-commerce platform: Next.js 14 frontend, Express.js backend, MongoDB, Redis, Socket.IO, Passport Local authentication, and JWT access/refresh tokens.

## Course Concept Mapping

| Course Concept | Implementation | File Path |
|---|---|---|
| Node.js & Express | Standalone API server | `backend/server.js`, `backend/src/app.js` |
| MongoDB & Mongoose | Schemas, indexes, validation | `backend/src/models/` |
| REST API & MVC | Routes → controllers → services | `backend/src/routes/`, `controllers/`, `services/` |
| Passport Local Auth | Email/password strategy | `backend/src/config/passport.js` |
| JWT access + refresh | Short access token + rotated HTTP-only cookie | `backend/src/utils/generateTokens.js` |
| Role-based authorization | `authorizeRoles` factory | `backend/src/middlewares/auth.middleware.js` |
| Helmet & CORS | Security headers + whitelist | `backend/src/app.js` |
| Rate limiting | Global + auth limiters | `backend/src/middlewares/rateLimit.middleware.js` |
| Async middleware | `asyncHandler` wrapper | `backend/src/middlewares/async.middleware.js` |
| Validation middleware | Joi + `validate(schema)` factory | `backend/src/middlewares/validate.middleware.js` |
| Conditional middleware | `conditionalMiddleware` factory | `backend/src/middlewares/conditional.middleware.js` |
| Global error handler | `ApiError` + `errorHandler` | `backend/src/middlewares/error.middleware.js` |
| Redis cache | `cache()` middleware + invalidation | `backend/src/middlewares/cache.middleware.js` |
| Socket.IO | JWT auth, user/admin rooms | `backend/src/sockets/socket.js` |
| Native fetch client | No Axios | `frontend/lib/api.js` |
| Custom auth UI | Auth context | `frontend/context/AuthContext.jsx` |

## API Routes (Implemented)

### Auth — `backend/src/routes/auth.routes.js`

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login` (Passport Local)
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/profile`

### Products — `backend/src/routes/product.routes.js`

- `GET /api/v1/products` (Redis cached)
- `GET /api/v1/products/:id`
- `POST|PUT|DELETE /api/v1/products/:id` (admin)

### Cart — `backend/src/routes/cart.routes.js`

- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PATCH /api/v1/cart/items`
- `DELETE /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart`

### Orders — `backend/src/routes/order.routes.js`

- `POST /api/v1/orders` (server recalculates totals, emits Socket.IO)
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/cancel`

### Admin — `backend/src/routes/admin.routes.js`

- `GET /api/v1/admin/dashboard` (includes low-stock list)
- `GET /api/v1/admin/orders`
- `PATCH /api/v1/admin/orders/:id`
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/analytics`
- Store settings & profile endpoints

### Reviews — `backend/src/routes/review.routes.js`

- `GET /api/v1/reviews/product/:productId`
- `POST /api/v1/reviews/product/:productId` (must have ordered product)
- `PATCH|DELETE /api/v1/reviews/:id`

### Notifications — `backend/src/routes/notification.routes.js`

- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/:id/read`
- `PATCH /api/v1/notifications/read-all`

### Upload — `backend/src/routes/upload.routes.js`

- `POST /api/v1/upload` (admin, multipart `image`)

## Redis Cache Demo

1. Start Redis and backend.
2. `GET http://localhost:5000/api/v1/products`
3. Terminal shows `Cache MISS: products_all`
4. Repeat request → `Cache HIT: products_all`

## Socket.IO Demo

| Event | Room | Trigger |
|---|---|---|
| `new-order` | `admin_room` | Customer places order |
| `order-status-updated` | `user:{userId}` | Admin updates status |
| `low-stock-alert` | `admin_room` | Stock ≤ 5 after order |

Frontend listeners: `frontend/app/admin/page.jsx`, `frontend/app/(site)/orders/page.jsx`

## Auth Flow

1. `POST /auth/login` → Passport validates password
2. Response: `{ data: { user, accessToken } }` + `jwt` HTTP-only cookie
3. Frontend stores access token in cookie; sends `Authorization: Bearer`
4. On 401 → `POST /auth/refresh-token` → new access token + rotated refresh cookie

## Security Practices

- Passwords hashed with bcrypt (pre-save hook)
- Refresh tokens stored hashed in MongoDB with `jti`
- Order totals computed from DB product prices
- Admin routes protected by `protect` + `authorizeRoles('admin')`
- Input validation on all mutation endpoints
