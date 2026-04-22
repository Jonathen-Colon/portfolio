# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note:** Convex removed; Sanity CMS migration in progress.

## Commands

```bash
# Install dependencies
npm install

# Local development
npm run dev

# Build & preview
npm run build
npm run preview
```

## Architecture

**Astro + React islands.**

- `src/pages/index.astro` — Landing page; mounts `<PortfolioApp>` as a React island
- `src/components/PortfolioApp.tsx` — Main React app component

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
