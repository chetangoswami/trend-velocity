# Trend Velocity 💎

> **Where Jewelry Meets the Moment**
> A Headless Commerce Monorepo built with Medusa v2, Next.js 16, and TurboRepo.

## 🏗 Architecture

This project is a monorepo managed by **TurboRepo** and **pnpm workspaces**.

### 📦 Workspaces

- **`apps/backend`**: [Medusa v2](https://medusajs.com/) Headless Commerce Engine.
  - Connected to **Supabase** (PostgreSQL) and **Upstash** (Redis).
  - Handles Products, Orders, Auth, and Admin Dashboard.
- **`apps/web`**: [Next.js 16](https://nextjs.org/) Storefront.
  - Modern React 19, Tailwind CSS v4.
  - Server-side rendering (ISR/SSR) for core commerce pages.
- **`apps/studio`**: Sanity CMS Studio (Content Management).
- **`packages/dto`**: Shared TypeScript types and DTOs.

## 🚀 Tech Stack

| Component | Technology | Hosting |
| :--- | :--- | :--- |
| **Monorepo** | TurboRepo, pnpm | GitHub |
| **Backend** | Medusa v2 (Node.js) | Render |
| **Storefront** | Next.js 16 (React 19) | Vercel |
| **Database** | PostgreSQL | Supabase |
| **Cache/Events** | Redis | Upstash |
| **Content** | Sanity.io | Sanity Cloud |

## 🛠 Local Development

### Prerequisites
- Node.js 20+
- pnpm 9+
- Git

### Quick Start

1.  **Clone & Install**
    ```bash
    git clone https://github.com/chetangoswami/trend-velocity.git
    cd trend-velocity
    pnpm install
    ```

2.  **Environment Setup**
    - Copy `.env.template` to `.env` in `apps/backend` and `apps/web`.
    - Fill in Supabase and Upstash credentials.

3.  **Run Locally**
    ```bash
    pnpm dev
    ```
    - Storefront: `http://localhost:3000`
    - Backend: `http://localhost:9000`
    - Admin: `http://localhost:9000/app` (Admin Build currently disabled for deployment)

## 🚢 Deployment

### Backend (Render)
- Connects to `apps/backend`.
- **Build Command**: `pnpm install && pnpm turbo build --filter=backend...`
- **Start Command**: `cd apps/backend && pnpm db:migrate && pnpm start`

### Storefront (Vercel)
- Connects to `apps/web`.
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
