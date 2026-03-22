# Jon Colon Portfolio (Coming Soon)

An Astro + Tailwind static site with an email waitlist in **[Convex](https://www.convex.dev/)** and an admin dashboard at `/admin` (Convex Auth, email + password).

## Features

- Interactive “coming soon” page with custom animation and styling
- Waitlist signup via a Convex **mutation**
- **Admin dashboard** at `/admin`: list subscribers, `mailto:` links, remove rows
- **Convex Auth** (password): sign-up restricted to the email in Convex **`ADMIN_EMAIL`**

## Tech stack

- [Astro](https://astro.build/) (static output) + [React](https://react.dev/) islands
- [Tailwind CSS](https://tailwindcss.com/)
- [Convex](https://www.convex.dev/) + [Convex Auth](https://labs.convex.dev/auth)

## Project structure

```text
.
├── convex/                 # Convex backend (schema, auth, subscribers)
├── src/
│   ├── components/       # SubscribeIsland, AdminApp
│   └── pages/
│       ├── index.astro
│       └── admin.astro
├── scripts/
│   ├── setup-convex-auth-step2.mjs
│   └── generate-convex-auth-keys.mjs
├── .env.example
└── package.json
```

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm
- A [Convex](https://dashboard.convex.dev/) account and project

## One-time: Convex + Auth

1. **Link the project:** `npx convex dev` (from the repo root).

2. **Convex dashboard → Environment variables** — run:

   ```bash
   npm run convex:setup-auth-env
   ```

   Paste **`JWT_PRIVATE_KEY`** and **`JWKS`**, and add **`ADMIN_EMAIL`** and **`CONVEX_SITE_URL`**. See [Convex Auth manual setup](https://labs.convex.dev/auth/setup/manual).

3. **Astro:** copy the Convex HTTP URL into `.env.local`:

   ```bash
   cp .env.example .env.local
   # PUBLIC_CONVEX_URL=https://YOUR_DEPLOYMENT.convex.cloud
   ```

4. **First admin user:** open `/admin` → **Create admin account** using the same email as **`ADMIN_EMAIL`**.

## Local development

```bash
npm install
npm run convex:dev    # terminal 1
PUBLIC_CONVEX_URL=https://YOUR_DEV_DEPLOYMENT.convex.cloud npm run dev   # terminal 2
```

Site: [http://localhost:4321](http://localhost:4321).

## Build & preview

```bash
PUBLIC_CONVEX_URL=https://YOUR_DEPLOYMENT.convex.cloud npm run build
npm run preview
```

`PUBLIC_CONVEX_URL` must be set at **build** time so the browser bundle points at Convex.

## Deploy

- **Frontend:** upload `dist/` to any static host (Netlify, Vercel, GitHub Pages, S3, etc.). Set `PUBLIC_CONVEX_URL` in that host’s build env.
- **Convex:** `npm run convex:deploy` or use a [deploy key](https://docs.convex.dev/production/hosting/cli-deploy-key) in CI.

## Scripts

- `npm run dev` / `build` / `preview` — Astro
- `npm run convex:dev` / `convex:deploy` / `convex:codegen` / `convex:setup-auth-env` — Convex
