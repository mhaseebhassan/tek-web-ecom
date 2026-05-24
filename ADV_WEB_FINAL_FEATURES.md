# Tekron: Secure Real-Time MERN E-Commerce Platform

## Project Overview
Tekron is a premium, real-time e-commerce platform built specifically for the Advanced Web Technologies lab final. It features a modern Next.js front-end decoupled from a highly scalable, secure, and fully-featured Express.js/MongoDB back-end. The architecture implements industry-standard REST API patterns, robust JWT-based authentication, real-time WebSocket notifications, and in-memory Redis caching to ensure high performance.

## Technologies Used

| Technology | Purpose |
|---|---|
| **Next.js 14** | High-performance React front-end (App Router). |
| **Express.js** | Scalable Node.js backend framework. |
| **MongoDB & Mongoose** | NoSQL database and ODM for flexible data modeling. |
| **Passport.js** | Core authentication middleware (Local Strategy). |
| **JWT** | Secure access token and refresh token rotation. |
| **Redis** | In-memory cache for high-speed product catalog retrieval. |
| **Socket.IO** | Real-time WebSocket event emission for order notifications. |
| **Helmet & CORS** | HTTP header security and Cross-Origin protections. |
| **Express Rate Limit** | Protection against brute-force and DDoS attacks. |
| **Joi** | Request payload validation. |

## Course Concepts Covered

| Course Concept | Implementation in Tekron | File Path |
|---|---|---|
| Node.js & Express | Standalone API Server | `backend/server.js`, `backend/src/app.js` |
| MongoDB & Mongoose | Schemas with validation, indexes | `backend/src/models/` |
| REST API & MVC | Clean split of routes/controllers | `backend/src/controllers/`, `backend/src/routes/` |
| Passport Local Auth | Email/Password hashing and strategy | `backend/src/config/passport.js` |
| JWT Access/Refresh | Secure token rotation and cookies | `backend/src/utils/generateTokens.js` |
| OWASP Security | Sanitization, HTTP-only cookies | `backend/src/app.js`, `auth.controller.js` |
| Security Middleware | Helmet, CORS, Rate Limiter | `backend/src/app.js` |
| Async Middleware | `asyncHandler` wrapper | `backend/src/middlewares/async.middleware.js` |
| Global Error Handler | Custom `ApiError` class and middleware | `backend/src/middlewares/error.middleware.js` |
| Redis Cache | Factory middleware for intercepting `res.json` | `backend/src/middlewares/cache.middleware.js` |
| Socket.IO | WebSockets for new order notifications | `backend/src/sockets/socket.js`, `order.controller.js` |

## Backend Architecture
The backend follows strict **Clean Architecture / MVC Patterns**:
1. **Routes (`src/routes`):** Defines the endpoints and applies middlewares (Validation, Auth, Cache).
2. **Controllers (`src/controllers`):** Handles HTTP requests, extracts parameters, and calls business logic.
3. **Models (`src/models`):** Mongoose schemas defining the database layer.
4. **Middlewares (`src/middlewares`):** Reusable functions for authentication, global error handling, and Redis caching.

## API Routes Overview
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Authenticate user (Passport Local)
- `POST /api/v1/auth/refresh-token` - Generate new access token using httpOnly cookie
- `GET /api/v1/products` - Fetch product catalog (Redis Cached)
- `POST /api/v1/orders` - Place order (Emits Socket.IO event)

## Redis Cache Demo
1. Make a GET request to `/api/v1/products`.
2. Check the backend terminal. The first request will log `Cache MISS: products_all` and fetch from MongoDB.
3. Make the same request again. The terminal will log `Cache HIT: products_all` and return instantly from Redis without hitting the database.

## Socket.IO Demo
1. Connect two clients (e.g., Postman WebSocket or frontend clients).
2. Authenticate Client A as an `admin`. It will automatically join the `admin_room`.
3. Have Client B place an order via `POST /api/v1/orders`.
4. Client A will instantly receive a `new-order` WebSocket event containing the order details.

## Viva Demo Flow
1. **Architecture Proof:** Show the clean folder separation between `frontend/` and `backend/`.
2. **Authentication Flow:** Postman demo: hit `/register`, then `/login` (show JWT generation). Hit `/refresh-token` to prove token rotation.
3. **Security:** Show `app.js` configuring Helmet, CORS, and Rate Limiting. Attempt to access a protected route without a token to trigger the Global Error Handler (401 Unauthorized).
4. **Performance:** Hit `/api/v1/products` twice and show the Redis Cache HIT in the terminal logs.
5. **Real-time:** Place an order and show the Socket.IO `new-order` event firing in real-time.
