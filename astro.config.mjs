import { defineConfig } from 'astro/config';

// Set SITE_URL to the public Cloudflare URL when deploying.
export default defineConfig({
  site: process.env.SITE_URL || 'http://127.0.0.1:4321',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
