import type { APIRoute } from 'astro';
import { withBase } from '../lib/paths';
export const GET: APIRoute = ({ site }) => new Response(
  process.env.INDEXABLE === 'true'
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL(withBase('/sitemap.xml'), site!).href}\n`
    : 'User-agent: *\nDisallow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
);
