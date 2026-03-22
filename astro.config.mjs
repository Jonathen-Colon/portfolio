// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind(), react()],

  vite: {
    resolve: {
      dedupe: ['react', 'react-dom', 'convex'],
    },
    ssr: {
      noExternal: ['@convex-dev/auth'],
    },
  },

  adapter: cloudflare()
});