# Tekron

A full-stack premium tech e-commerce store rebuilt from the ground up to follow a secure MERN monorepo architecture. 

![alt text](image.png)

## Tech Stack

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **Image Storage:** Cloudinary
- **Icons:** Heroicons
- **API Client:** Native Fetch

**Backend:**
- **Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ORM
- **Auth:** Passport.js (Local Strategy) + JWT Access/Refresh tokens
- **Real-time:** Socket.IO for admin notifications
- **Caching:** Redis for ultra-fast product catalog delivery
- **Security:** Helmet, CORS, Express Rate Limiter, Express Mongo Sanitize

## Features

**Storefront**
- Animated hero slideshow & featured product grid
- Product catalog with category filtering (Redis Cached)
- Shopping cart (React Context, local & backend synced)
- Checkout with shipping address collection
- Order history and real-time Socket.IO notifications
- User authentication (register / login)

**Admin Dashboard** (`/admin` — admin role required)
- Overview metrics (revenue, orders, customers, products)
- Product CRUD with Cloudinary image upload
- Order management with real-time new order alerts
- Customer list & analytics
- Store settings (currency, tax, shipping rates)

## Getting Started

### 1. Requirements
Ensure you have the following installed locally:
- Node.js (v18+)
- MongoDB (`mongod` running on `localhost:27017`)
- Redis Server (running on `localhost:6379`)

### 2. Clone the Repository
```bash
git clone https://github.com/mhaseebhassan/tekron.git
cd tekron
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in the `.env` with your MongoDB connection string and JWT secrets.

### 4. Database Seed
Run the seed scripts to populate your local database with an Admin user and products.
```bash
npm run seed:admin
npm run seed:products
```

### 5. Frontend Setup
Open a new terminal tab.
```bash
cd frontend
npm install
cp .env.example .env
```

### 6. Run the Project
You can run the frontend and backend servers individually:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Security & Advanced Web Implementation
This project fully satisfies the Advanced Web Technologies lab requirements:
- Clean MVC routing and controller segregation.
- Short-lived Access Tokens (15m) and HTTP-Only Refresh Cookies (7d).
- Route protection middleware with Role-based access control.
- Global Error Handler and Async request wrappers.
- In-memory Redis caching.

---

Built by [Muhammad Haseeb Hassan](https://github.com/mhaseebhassan)
