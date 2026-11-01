import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';

// Check the built deliverable: real HTML, translations, downloads, SEO and assets.
const read = file => readFileSync(join('dist', file), 'utf8');
for (const lang of ['sk', 'hu']) {
  const html = read(`${lang}/index.html`);
  assert.match(html, new RegExp(`<html lang="${lang}"`));
  assert.match(html, /<h1[^>]*>[^<]+/);
  for (const text of ['990', '30', 'Peter Štrba', 'Tibor Štrba', 'Nábrežná 5779', '0905 263 409', '0907 364 159']) assert.ok(html.includes(text), `${lang}: ${text}`);
  for (const file of ['prihlaska.pdf', 'ziadost.pdf']) assert.ok(html.includes(`/documents/${file}`));
  for (const name of ['peter', 'tibor']) assert.ok(html.includes(`/images/${name}.webp`));
  assert.ok(html.includes('/images/hero-cars-v2.webp'), 'Both-car composition missing');
  assert.ok(html.includes('class="hero-wide"'), 'Full-width road composition missing');
  assert.ok(!html.includes('stats-section') && !html.includes('motion-ribbon'), 'Removed sections returned');
  assert.ok(html.includes('portrait-outline') && html.includes('motion-toggle'), 'Motion controls or portrait treatment missing');
  assert.match(html, /hreflang="sk"/);
  assert.match(html, /hreflang="hu"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
  assert.ok(html.includes('https://www.minv.sk/?testy'));
  assert.ok(html.includes('https://www.facebook.com/autoskolatymy'));
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `Missing anchor ${match[1]}`);
  for (const match of html.matchAll(/(?:src|href)="(\/(?:images|documents|_astro)\/[^"?#]+)"/g)) assert.ok(existsSync(join('dist', decodeURIComponent(match[1]))), `Missing asset ${match[1]}`);
  console.log(`${lang}: HTML content, metadata, anchors, links and assets OK`);
}
for (const file of ['prihlaska.pdf', 'ziadost.pdf']) assert.equal(readFileSync(join('dist/documents', file)).subarray(0, 4).toString(), '%PDF');
assert.ok(existsSync('dist/404.html'));
assert.ok(read('sitemap.xml').includes('/sk/'));
assert.ok(read('sitemap.xml').includes('/hu/'));
assert.ok(existsSync('dist/robots.txt'));
const files = directory => readdirSync(directory).flatMap(name => { const file = join(directory, name); return statSync(file).isDirectory() ? files(file) : [file]; });
const all = files('dist');
console.log(`Build verified: ${all.length} files, ${(all.reduce((size, file) => size + statSync(file).size, 0) / 1024 / 1024).toFixed(2)} MB.`);
