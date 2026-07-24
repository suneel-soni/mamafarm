# Refactor MamaFarm Backend to Next.js Route Handlers (Remove Express)

## Objective
Refactor the existing MamaFarm application to use Next.js App Router Route Handlers instead of a separate Express server while preserving the UI and business logic.

## Key Tasks
- Move Express routes into `src/app/api`
- Reuse Mongoose models
- Keep MongoDB Atlas
- Keep JWT authentication
- Create reusable DB connection (`src/lib/db.ts`)
- Move business logic into services
- Replace Express middleware with helper functions
- Update frontend API calls from `http://localhost:5000/api/*` to `/api/*`
- Remove Express dependencies
- Keep TypeScript, Axios, Zod, bcrypt, jsonwebtoken and Mongoose

## Target Structure
```
src/
  app/api/
  lib/
  models/
  services/
  helpers/
```

## Final Goal
Run the entire application with:

```bash
npm install
npm run dev
```

No separate Express server. All APIs should be served from Next.js Route Handlers under `/api/*`.
