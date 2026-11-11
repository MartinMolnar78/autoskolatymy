import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';

// Check the built deliverable: real HTML, translations, downloads, SEO and assets.
const read = file => readFileSync(join('dist', file), 'utf8');
const directory = (process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '');
const basePath = directory ? `/${directory}/` : '/';
const site = process.env.SITE_URL || 'http://127.0.0.1:4321';
const privacySlugs = { sk: 'ochrana-sukromia', hu: 'adatvedelem' };
const checkLocalLinks = html => {
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const path = decodeURIComponent(match[1]);
    assert.ok(path.startsWith(basePath), `Link escapes deployment directory: ${path}`);
    const target = join('dist', path.slice(basePath.length));
    assert.ok(existsSync(target), `Missing local file: ${path}`);
    if (statSync(target).isDirectory()) assert.ok(existsSync(join(target, 'index.html')), `Missing page: ${path}`);
  }
};
for (const lang of ['sk', 'hu']) {
  const html = read(`${lang}/index.html`);
  assert.match(html, new RegExp(`<html lang="${lang}"`));
  assert.match(html, /<h1[^>]*>[^<]+/);
  for (const text of ['990', '1 490', '40 €', 'Peter Štrba', 'Beáta Mišíková', 'Tibor Štrba', 'Nábrežná 5779/39A', '0905 263 409', '0918 661 146', '0907 364 159']) assert.ok(html.includes(text), `${lang}: ${text}`);
  for (const file of ['prihlaska.pdf', 'ziadost.pdf']) assert.ok(html.includes(`${basePath}documents/${file}`));
  for (const name of ['peter', 'beata', 'tibor']) assert.ok(html.includes(`${basePath}images/${name}.webp`));
  assert.ok(html.includes('/images/hero-cars-v2.webp'), 'Both-car composition missing');
  assert.ok(html.includes('class="hero-wide"'), 'Full-width road composition missing');
  assert.ok(!html.includes('stats-section') && !html.includes('motion-ribbon'), 'Removed sections returned');
  assert.ok(html.includes('portrait-outline') && html.includes('motion-toggle'), 'Motion controls or portrait treatment missing');
  assert.match(html, /hreflang="sk"/);
  assert.match(html, /hreflang="hu"/);
  assert.match(html, /rel="canonical"/);
  assert.ok(html.includes(`rel="canonical" href="${new URL(`${basePath}${lang}/`, site).href}"`), 'Incorrect canonical URL');
  assert.ok(html.includes(`href="${basePath}sk/"`) && html.includes(`href="${basePath}hu/"`), 'Language links must stay inside deployment directory');
  assert.ok(html.includes(`name="robots" content="${process.env.INDEXABLE === 'true' ? 'index,follow' : 'noindex,follow'}"`));
  assert.match(html, /application\/ld\+json/);
  assert.ok(html.includes('https://www.minv.sk/?testy'));
  assert.ok(html.includes('https://www.facebook.com/autoskolatymy'));
  const privacyPath = `${lang}/${privacySlugs[lang]}/`;
  assert.ok(html.includes(`href="${basePath}${privacyPath}"`), 'Privacy page missing from the footer');
  assert.ok(html.includes('data-consent-map') && !/<iframe\b/i.test(html), 'Google Maps must wait for explicit consent');
  const policy = read(privacyPath + 'index.html');
  assert.ok(policy.includes('43962955') && policy.includes('autoskolatymy@gmail.com'));
  assert.ok(policy.includes(`rel="canonical" href="${new URL(basePath + privacyPath, site).href}"`));
  checkLocalLinks(policy);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `Missing anchor ${match[1]}`);
  checkLocalLinks(html);
  console.log(`${lang}: HTML content, metadata, anchors, links and assets OK`);
}
for (const file of ['prihlaska.pdf', 'ziadost.pdf']) assert.equal(readFileSync(join('dist/documents', file)).subarray(0, 4).toString(), '%PDF');
assert.ok(existsSync('dist/404.html'));
checkLocalLinks(read('404.html'));
assert.ok(read('index.html').includes(`${basePath}sk/`), 'Incorrect entry-page redirect');
assert.ok(read('sitemap.xml').includes(new URL(`${basePath}sk/`, site).href));
assert.ok(read('sitemap.xml').includes(new URL(`${basePath}hu/`, site).href));
assert.ok(existsSync('dist/robots.txt'));
assert.ok(read('robots.txt').includes(process.env.INDEXABLE === 'true' ? `Sitemap: ${new URL(`${basePath}sitemap.xml`, site).href}` : 'Disallow: /'));
const files = directory => readdirSync(directory).flatMap(name => { const file = join(directory, name); return statSync(file).isDirectory() ? files(file) : [file]; });
const all = files('dist');
console.log(`Build verified: ${all.length} files, ${(all.reduce((size, file) => size + statSync(file).size, 0) / 1024 / 1024).toFixed(2)} MB.`);
