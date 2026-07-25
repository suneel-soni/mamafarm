# MamaFarm Organic Sprouts Tracker

This repository contains two independent production-ready applications:

1. **`mamafarm-backend`**: Node.js + Express + Mongoose REST API server.
2. **`mamafarm-frontend`**: Next.js 15 + React 19 + Tailwind CSS Web Frontend client.

---

## Projects

### 1. `mamafarm-backend`
Express REST API connecting to MongoDB Atlas (with local fallback).
- Port: `5000`
- Instructions: See [`mamafarm-backend/README.md`](./mamafarm-backend/README.md)

```bash
cd mamafarm-backend
npm install
npm run dev
```

### 2. `mamafarm-frontend`
Next.js 15 client connecting to `NEXT_PUBLIC_API_URL` (or fallback `http://localhost:5000/api`).
- Port: `3000`
- Instructions: See [`mamafarm-frontend/README.md`](./mamafarm-frontend/README.md)

```bash
cd mamafarm-frontend
npm install
npm run dev
```
