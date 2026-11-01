import { defineConfig } from 'astro/config';

// Set SITE_URL to the final custom domain before the production build.
export default defineConfig({
  site: process.env.SITE_URL || 'https://autoskola-tymy-navrh.martan78.chatgpt.site',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
