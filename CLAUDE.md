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
