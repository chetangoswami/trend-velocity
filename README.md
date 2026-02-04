# Trend Velocity 💎

<div align="center">

> **Where Jewelry Meets the Moment**
>
> *Built LIVE on Stream using the BMAD Artificial Intelligence Workflow*

[![TurboRepo](https://img.shields.io/badge/Monorepo-Turbo-ef4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![Medusa](https://img.shields.io/badge/Backend-Medusa_v2-purple?style=for-the-badge&logo=medusa)](https://medusajs.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/CMS-Sanity-f03e2f?style=for-the-badge&logo=sanity)](https://sanity.io/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

</div>

---

## 🚀 About The Project

**Trend Velocity** is a high-performance, headless commerce "Impulse Store" designed to capture the "TikTok browsing" energy. It features an immersive, infinite-scroll product feed, instant checkout, and a media-rich experience—all built on a robust, scalable enterprise architecture.

This project is unique because it is **Built Live in Public** using the **BMad (Brain-Machine-Augmented-Design)** method. It demonstrates how "Agentic AI" (AI Agents acting as Architects, Product Managers, and Senior Developers) can collaborate with a human pilot to build complex software at warp speed.

## 🎥 Built Live on Stream

This repository is the result of a live-coding rapid development session.

-   **Human Pilot**: Chetan Goswami
-   **AI Co-Pilot**: BMad "Antigravity" Agent
-   **Methodology**: Agentic Waterfall (Architect -> PM -> Dev -> Reviewer)
-   **Goal**: Zero-to-Production Enterprise Commerce in record time.

## 🏗 Architecture & Stack

A modern monorepo managed by **TurboRepo** and **pnpm workspaces**.

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Medusa v2** | Headless Commerce Engine (Node.js). Handles products, carts, orders, and auth. |
| **Storefront** | **Next.js 16** | React 19 RC, Tailwind v4, Server Actions, Framer Motion. |
| **CMS** | **Sanity.io** | Structured content for "Wear Testing" media and rich storytelling. |
| **Database** | **Supabase** | Managed PostgreSQL + Vector Search capabilities. |
| **Cache/Bus** | **Upstash** | Serverless Redis for sessions and event bus. |

### 📦 Workspaces

-   `apps/backend`: Medusa Server & Admin API.
-   `apps/web`: Next.js Customer Storefront (Mobile-First Design).
-   `apps/studio`: Sanity Content Studio (CMS).
-   `packages/dto`: Shared TypeScript contracts and types.

## 🛠 Local Development

### Prerequisites

-   Node.js 20+
-   pnpm 9+
-   Git

### Quick Start

1.  **Clone & Install**

    ```bash
    git clone https://github.com/chetangoswami/trend-velocity.git
    cd trend-velocity
    pnpm install
    ```

2.  **Environment Setup**
    -   Copy `.env.template` to `.env` in `apps/backend` and `apps/web`.
    -   Configure Supabase and Upstash credentials.

3.  **Run the Monorepo**

    ```bash
    pnpm dev
    ```

    -   **Storefront**: `http://localhost:3000`
    -   **Studio (CMS)**: `http://localhost:3333`
    -   **Backend**: `http://localhost:9000`

## 🧠 The BMad Workflow

We use a structured efficient multi-agent workflow:

1.  **Architect Agent**: Defines the high-level system design and tech stack match.
2.  **Product Manager Agent**: Breaks down requirements into Epics and User Stories with detailed ACs.
3.  **Developer Agent**: Implementation of stories using TDD (Test Driven Development) and Atomic Commits.
4.  **Reviewer Agent**: Adversarial code review to ensure security, performance, and best practices.


## 🗺️ Roadmap & Upcoming Features

We are actively building this project commit-by-commit. Here is what's coming next:

- [x] **Project Foundation**: Skeleton, Monorepo Setup, Deployment Pipeline.
- [x] **Infinite Feed**: Virtualized TikTok-style product scrolling.
- [ ] **Impulse Sheet**: "One-Tap" product details overlay.
- [ ] **Instant Cart**: Optimistic UI for immediate add-to-cart feedback.
- [ ] **Checkout Flow**: Streamlined, mobile-first guest checkout.
- [ ] **Theme System**: Dynamic theme switching based on product campaigns.
- [ ] **Search Overlay**: Full-screen semantic search experience.

---

<div align="center">
  <sub>Built with ❤️ and 🤖 by Chetan Goswami</sub>
</div>
