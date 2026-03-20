// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    // Use your real Wrangler config (incl. D1 bindings) during `astro dev`
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [tailwind()],
});
