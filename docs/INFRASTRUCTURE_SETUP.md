# Infrastructure Setup Guide

This guide documents how to set up the zero-cost infrastructure for Trend Velocity.

## 1. Supabase (PostgreSQL Database)

### Project Creation
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" in your organization
3. Enter project details:
   - **Name**: `trend-velocity`
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to your target users
4. Click "Create new project"
5. Wait for the database to be provisioned (2-3 minutes)

### Get Connection String
1. Go to **Settings** → **Database**
2. Copy the **Connection String (URI)** under "Connection pooling"
3. Replace `[YOUR-PASSWORD]` with your database password
4. Add `?sslmode=require` to the end

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
```

### Free Tier Limits
| Resource | Limit |
|----------|-------|
| Storage | 500 MB |
| Bandwidth | 2 GB/month |
| API Requests | Unlimited |
| Database | 500 MB |

---

## 2. Upstash Redis (Cache & Event Bus)

### Project Creation
1. Go to [upstash.com](https://upstash.com) and create a free account
2. Click "Create Database"
3. Enter details:
   - **Name**: `trend-velocity-redis`
   - **Type**: Regional
   - **Region**: Same region as your backend (Oregon = US-West)
4. Click "Create"

### Get Connection URL
1. Click on your database
2. Copy the **Redis URL** (TLS encrypted, starts with `rediss://`)

**Format:**
```
rediss://default:[PASSWORD]@[ENDPOINT]:6379
```

### Free Tier Limits
| Resource | Limit |
|----------|-------|
| Commands | 10,000/day |
| Data | 256 MB |
| Concurrent Connections | 1,000 |

---

## 3. Render (Backend Hosting)

### Automatic Deployment
1. Go to [render.com](https://render.com) and connect your GitHub
2. Click "New" → "Blueprint"
3. Connect the `trend-velocity` repository
4. Render will detect `render.yaml` and configure automatically
5. Set environment variables in Render dashboard

### Manual Secrets to Configure
| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase connection string |
| `REDIS_URL` | Upstash Redis URL |
| `STORE_CORS` | Your Vercel frontend URL |
| `ADMIN_CORS` | Your Vercel frontend URL |
| `AUTH_CORS` | Your Vercel frontend URL |

### Free Tier Limits
| Resource | Limit |
|----------|-------|
| Hours | 750/month |
| Sleep Time | After 15 min inactivity |
| Build Minutes | 400/month |

---

## 4. Vercel (Frontend Hosting)

### Deployment
1. Go to [vercel.com](https://vercel.com) and import the repository
2. Set the root directory to `apps/web`
3. Vercel will detect `vercel.json` automatically
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Your Render backend URL |

### Free Tier Limits
| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Serverless Execution | 100 GB-hours |
| Build Minutes | 6,000/month |

---

## 5. Running Medusa Migrations

After all services are set up, run migrations:

```bash
# Set environment variables locally
cp apps/backend/.env.template apps/backend/.env
# Edit .env with your actual values

# Run migrations
cd apps/backend
pnpm db:migrate

# Seed initial data (optional)
pnpm seed
```

---

## Quick Verification Checklist

- [ ] Supabase: Database accessible, tables created after migration
- [ ] Upstash: Redis ping responds
- [ ] Render: `/health` endpoint returns 200
- [ ] Vercel: Home page renders "Trend Velocity"
- [ ] Medusa Admin: `/dashboard` accessible

---

## Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| Supabase | $0 |
| Upstash | $0 |
| Render | $0 |
| Vercel | $0 |
| **Total** | **$0** |
