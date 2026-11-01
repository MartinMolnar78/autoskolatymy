import { defineConfig } from 'astro/config';

// GitHub Pages preview. Override both variables when moving to a custom domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://martinmolnar78.github.io',
  base: process.env.BASE_PATH || '/autoskolatymy',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
