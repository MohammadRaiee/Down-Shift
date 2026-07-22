#    DOWN SHIFT (AutoParts Marketplace)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange?style=flat-square)

A full-stack e-commerce platform for buying and selling car parts,  
built with Next.js 14 App Router, PostgreSQL, and Prisma ORM.

>  **Actively in development** — core features (auth, dashboard, cart, image pipeline) are working; search/filtering is the current focus.

I built this to go beyond basic CRUD and practice the patterns real e-commerce apps need — role-based dashboards, cloud image lifecycle management, and cart state that survives login. It's part of my developer portfolio.

---

## Table of Contents
- [Highlights](#highlights)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [What I Learned](#what-i-learned)
- [Contact](#contact)

---

## Highlights

- **Image lifecycle consistency** (the hardest part of this project): uploading, replacing, and deleting a part's image touches both Cloudinary and PostgreSQL. I handled the failure cases directly — a failed DB write after a successful upload doesn't leave an orphaned Cloudinary file, and a failed Cloudinary delete doesn't leave a part pointing at a missing image. Every step in the chain is checked so a part and its image can never silently drift out of sync.
- **Guest → authenticated cart merge:** cart persists for guests and merges automatically into the DB-backed cart on login, with no item loss or duplication.
- **Debounced search filtered at the DB level *(in progress)*:** search queries will hit PostgreSQL through Prisma rather than filtering an already-fetched list.
- **Bulk seller actions:** select multiple parts and hide/delete them in one action from the dashboard.

---

## Screenshots


![Home Page](./public/screenshots/home.png)
![Part Details](./public/screenshots/partDetails.png)
![Seller Dashboard](./public/screenshots/dashboard.png)
![Edit Form](./public/screenshots/editForm.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, NextAuth.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Storage** | Cloudinary (image upload & lifecycle management) |
| **Auth** | NextAuth.js with role-based access (Buyer / Seller) |

---

## Features

###  Buyer
- Browse car parts by category
-  Search parts by name with debounced suggestions (in progress)
- Part details page with image gallery
- Add to cart (guest cart + persistent cart for logged-in users)
- Guest cart merges automatically on login

###  Seller Dashboard
- Publish, edit, and delete parts with image upload via Cloudinary
- Toggle part visibility (show / hide from public listing)
- Bulk select and delete multiple parts at once
- Manage store profile

###  System
- Role-based authentication (Buyer / Seller)
- Protected routes via Next.js Middleware
- Full image lifecycle handling — upload, replace, and delete, with orphaned-asset cleanup and error handling at every step
- Fully typed with TypeScript

---

## Database Schema

![ERD](./prisma/ERD.svg)

**Key models:** `User`, `Part`, `Category`, `Cart`, `CartItem`, `Image`, `OrphanedAsset`

See [prisma/schema.prisma](./prisma/schema.prisma) for the full schema.

---

## Project Structure

```text
├── app/
│   ├── (auth)/          # Login & Signup pages
│   ├── (public)/        # Home page & part details [id]
│   ├── api/             # API routes (auth, cart, parts, cloudinary)
│   └── dashboard/       # Seller dashboard (part management)
├── components/
│   ├── dashboard/       # Seller management components
│   ├── partDetails/     # Part page with image swap gallery
│   ├── cart/            # Cart drawer
│   ├── auth/            # Sign in / Sign up forms
│   └── ui/              # Shared UI components (shadcn/ui)
└── prisma/
    ├── schema.prisma    # Database schema
    ├── migrations/      # Migration history
    └── ERD.svg          # Entity relationship diagram
```

---

## Getting Started

```bash
# 1. Clone the repository
https://github.com/MohammadRaiee/Down-Shift
cd Down-Shift

# 2. Install dependencies
npm install

# 3. Configure environment variables
# .env.example:

# DATABASE_URL=
# NEXTAUTH_SECRET=
# NEXTAUTH_URL=
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
# CLOUDINARY_UPLOAD_URL=

# 4. Run database migrations
npx prisma migrate dev

# 5. Start the development server
npm run dev
```

---

## What I Learned

- Handling a multi-step, multi-service operation (DB + Cloudinary) so it fails safely instead of leaving orphaned files or broken references.
- Structuring a multi-role app with Next.js App Router and Middleware.
- Managing guest carts and merging them automatically on authentication.
- Designing relational schemas and writing incremental migrations with Prisma.
- Building a debounced search system connected to a filtered PostgreSQL query.

---

## Contact

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Education + Car-Parts Implementation Plan

### 1) Overall Career Strategy (CV + Job Readiness)

1. **Build a public proof-of-work profile**
   - Keep this repository active with clear commits, PR descriptions, and release notes.
   - Use GitHub Projects to track work in delivery-focused milestones.
2. **Show engineering quality**
   - Enforce lint/build checks in CI.
   - Document architecture decisions in repository docs.
3. **Convert project progress into CV bullets**
   - Highlight measurable outcomes (performance, features shipped, reliability).
   - Link directly to completed PRs and demo pages.

### 2) Project Plan for Car-Parts (Immediate Implementation)

#### Milestone A — Search & Discovery Improvements (Week 1)
- **Features**
  - Improve Year/Make/Model filtering UX and query accuracy.
  - Add clearer empty/error states for search.
- **Technologies**
  - Next.js App Router, React client components, existing YmmSearch hooks.
- **Expected Outcomes**
  - Faster part discovery and lower drop-off in search flow.

#### Milestone B — Trust & Conversion Features (Week 2)
- **Features**
  - Strengthen product detail view (compatibility, seller/store info).
  - Improve cart flow messaging for guests vs authenticated users.
- **Technologies**
  - Prisma models, API routes, existing cart merge utilities.
- **Expected Outcomes**
  - Higher add-to-cart and checkout initiation rate.

#### Milestone C — Portfolio-Ready Engineering (Week 3)
- **Features**
  - Add concise docs for system design, schema decisions, and API contracts.
  - Clean core lint issues in touched modules and stabilize build pipeline.
- **Technologies**
  - ESLint, Next.js build pipeline, Prisma migration history.
- **Expected Outcomes**
  - Recruiter-friendly repository quality and easier collaboration.

### 3) Timeline to Integrate GitHub Education Benefits

- **Week 1**
  - Configure workflow discipline: Issues, Projects board, and PR templates.
  - Use GitHub Student benefits tooling to improve development productivity.
- **Week 2**
  - Use education-provided cloud/dev tools for testing and environment consistency.
  - Publish a short technical write-up describing what shipped and why.
- **Week 3**
  - Finalize a portfolio release (`v1`) and update CV with measurable outcomes.
  - Prepare job applications with links to repository milestones and PRs.

### 4) Next Action (Start Implementation)

Start with **specific feature definition** for the current project:
- Define the exact search enhancements to deliver first (inputs, validation, result ranking, empty states).
- Map each feature to a GitHub Issue and assign it to Milestone A.
- Implement in small PRs, each with before/after behavior and test evidence.
