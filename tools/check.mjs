// Pre-deploy check: builds the site, then verifies every page. Run: node tools/check.mjs
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
execSync('node src/build.mjs', { cwd: root, stdio: 'inherit' });

const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(dist);

const problems = [];
const titles = new Map();
const exists = (url) => {
  const clean = url.split(/[?#]/)[0];
  const p = join(dist, clean);
  return clean.endsWith('/') ? existsSync(join(p, 'index.html')) : existsSync(p);
};

for (const f of files) {
  const rel = f.slice(dist.length).replace(/\\/g, '/');
  const h = readFileSync(f, 'utf8');
  const title = (h.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const desc = (h.match(/name="description" content="(.*?)"/) || [])[1] || '';
  const noindex = h.includes('content="noindex"');
  if (!title) problems.push(`${rel}: missing <title>`);
  if (!noindex) {
    if (titles.has(title)) problems.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
    if (title.length > 70) problems.push(`${rel}: title ${title.length} chars (keep ≤ 70)`);
    if (desc.length < 70 || desc.length > 165) problems.push(`${rel}: description ${desc.length} chars (aim 70–165)`);
  }
  if ((h.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${rel}: should have exactly one <h1>`);
  for (const m of h.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)) problems.push(`${rel}: <img> without alt: ${m[0].slice(0, 60)}`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${rel}: invalid JSON-LD`); }
  }
  for (const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) problems.push(`${rel}: broken link ${m[1]}`);
  for (const m of h.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/') && !exists(u)) problems.push(`${rel}: missing image ${u}`); }
  }
  if (/<script>(?!document\.documentElement\.classList\.add\('js'\)<\/script>)/.test(h)) problems.push(`${rel}: extra inline <script> (blocked by the CSP — move it to site.js)`);
  if (/fonts\.googleapis|fonts\.gstatic/.test(h)) problems.push(`${rel}: external font request (fonts are self-hosted)`);
}

for (const f of ['_headers', 'robots.txt', 'sitemap.xml', 'llms.txt', 'insights/feed.xml']) if (!existsSync(join(dist, f))) problems.push(`missing ${f}`);

console.log(`\nChecked ${files.length} pages.`);
if (problems.length) { console.log(`${problems.length} problem(s):\n- ` + problems.join('\n- ')); process.exit(1); }
console.log('0 problems. Ready to deploy when asked.');
