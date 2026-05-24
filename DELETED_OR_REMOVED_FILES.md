# Deleted or Removed Files

| File / Folder Removed | Reason | Replacement Location |
|---|---|---|
| `frontend/app/api/` | Removed old Next.js API routes | Recreated in `backend/src/routes/` and `backend/src/controllers/` |
| `frontend/prisma/` | Removed Prisma schemas and migrations | Replaced with Mongoose models in `backend/src/models/` |
| `frontend/lib/prisma.js` | Removed old Prisma client | Replaced with Mongoose connection in `backend/src/config/db.js` |
| `frontend/scripts/create-admin.js` | Old Prisma admin seed script | Replaced with `backend/scripts/seedAdmin.js` |
