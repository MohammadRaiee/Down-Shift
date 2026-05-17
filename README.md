This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

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
