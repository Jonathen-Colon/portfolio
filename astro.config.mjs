// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
// Tailwind v4: use postcss.config.mjs + @tailwindcss/postcss (not @astrojs/tailwind).
export default defineConfig({
  output: 'static',
  integrations: [react()],
});
