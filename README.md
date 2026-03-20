# Jon Colon Portfolio (Coming Soon)

An Astro + Tailwind landing page for `joncolon` with an email waitlist signup flow backed by **Cloudflare D1**, deployed on Cloudflare Workers.

## Features

- Interactive "coming soon" page with custom animation and styling
- Email waitlist form on the homepage
- Server-side API route at `/api/subscribe`
- **D1 (SQLite)** subscriber persistence via the `DB` binding
- Cloudflare adapter + Wrangler config for deployment

## Tech Stack

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)

## Project Structure

```text
.
├── migrations/
│   └── 0001_initial.sql        # D1 schema (optional; route also runs CREATE IF NOT EXISTS)
├── src/
│   ├── env.d.ts                # TypeScript: Cloudflare `locals.runtime.env.DB`
│   └── pages/
│       ├── api/
│       │   └── subscribe.ts    # Email signup endpoint (D1)
│       └── index.astro         # Landing page UI + form script
├── astro.config.mjs
├── wrangler.jsonc              # Worker + D1 binding `DB`
└── package.json
```

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm
- A [Cloudflare](https://dash.cloudflare.com/) account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (also pulled in transitively via `npm`)

## One-time: create D1 and wire `wrangler.jsonc`

1. Create a D1 database (pick a name you like; this repo expects `database_name` **`portfolio`** in `wrangler.jsonc`):

   ```bash
   npx wrangler d1 create portfolio
   ```

2. Copy the printed **`database_id`** into `wrangler.jsonc` under `d1_databases[0].database_id` (replace the placeholder).

3. Apply migrations to your **remote** D1 (for production data):

   ```bash
   npx wrangler d1 migrations apply portfolio --remote
   ```

For **local** development (SQLite file under Wrangler’s local state), apply migrations locally:

```bash
npx wrangler d1 migrations apply portfolio --local
```

> The subscribe route also runs `CREATE TABLE IF NOT EXISTS` so a fresh DB works even before migrations; the migration file is still the source of truth for schema reviews and production rollouts.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server (uses `platformProxy` in `astro.config.mjs` so `wrangler.jsonc` bindings like **`DB`** are available):

```bash
npm run dev
```

Astro runs locally at [http://localhost:4321](http://localhost:4321).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - build production output to `dist/`
- `npm run preview` - preview the production build locally
- `npm run deploy:dry` - run a Wrangler dry-run deploy
- `npm run deploy` - deploy to Cloudflare Workers

## Deployment Notes

- Astro is configured with `output: "server"` and the Cloudflare adapter in `astro.config.mjs`.
- `wrangler.jsonc` points the Worker entrypoint to `dist/_worker.js/index.js` and binds D1 as **`DB`** (see `d1_databases`).
- The build script also writes `dist/.assetsignore` so the Worker bundle is not treated as a static asset.
- After changing D1 schema, use `wrangler d1 migrations create …` / `apply` as needed.

## API Endpoint

### `POST /api/subscribe`

Accepts JSON:

```json
{ "email": "user@example.com" }
```

Behavior:

- validates `Content-Type` as `application/json`
- validates email format (basic `@` check)
- ensures the `subscribers` table exists (`CREATE TABLE IF NOT EXISTS`)
- prevents duplicate subscriptions by email
- returns JSON success/error messages
