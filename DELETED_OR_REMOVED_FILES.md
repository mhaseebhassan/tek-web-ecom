# Deleted or Removed Files

Items removed during the MERN migration. If a path is not listed, it was never present in this repository snapshot.

| Removed Item | Reason | Replacement |
|---|---|---|
| `frontend/app/api/**` | Business logic must not live in Next.js API routes | `backend/src/routes/*` |
| Prisma schema & migrations | Course requires MongoDB/Mongoose | `backend/src/models/*` |
| `@prisma/client` usage | PostgreSQL no longer used | Mongoose models |
| NextAuth config / `SessionProvider` | Course requires Passport + JWT | `frontend/context/AuthContext.jsx` |
| `axios` dependency | Requirement: native fetch only | `frontend/lib/api.js` |
| `DATABASE_URL` env usage | PostgreSQL removed | `MONGO_URI` in `backend/.env` |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | NextAuth removed | JWT secrets in backend `.env` |
| `.ebextensions` Prisma generate hook | Invalid after Prisma removal | Updated `options.config` with API URL only |

## Not Deleted (Kept)

- UI components, Tailwind styles, public product images
- `frontend/lib/data.js` — offline fallback catalog if API is down
- Docker / Jenkins files — updated or documented separately
