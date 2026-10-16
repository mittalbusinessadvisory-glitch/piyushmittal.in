// Zero-dependency static site generator. Run: node src/build.mjs  → outputs ./dist
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './config.mjs';
import { services, posts, healthCheck, engagements, homeFaqs } from './content.mjs';
import { officeBody } from './office.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const today = new Date().toISOString().slice(0, 10);
// Sitemap dates: last commit that touched the site source, not the build time
let siteUpdated = today;
try { siteUpdated = execSync('git log -1 --format=%cs -- src', { cwd: root }).toString().trim() || today; } catch {}
const PRIVACY_UPDATED = '2026-10-16'; // change only when the policy text changes
const pages = []; // for sitemap

if (existsSync(out)) rmSync(out, { recursive: true });
cpSync(join(root, 'src', 'static'), out, { recursive: true });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => site.url + p;
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const svc = (slug) => services.find((s) => s.slug === slug);
const ctaHref = site.calendarUrl || '/contact/';
const ctaAttrs = site.calendarUrl ? ' target="_blank" rel="noopener"' : '';
const pad = (n) => String(n).padStart(2, '0');
const telHref = `tel:${site.phoneE164}`;
const linkedin = site.profiles.find((p) => p.label === 'LinkedIn')?.url;
const waHref = `https://wa.me/${site.phoneE164.replace('+', '')}`;
// Responsive images: AVIF/WebP/JPEG at 480/800/1200 px (tools/build_images.py)
const SIZES = {
  'card-img': '(max-width: 760px) calc(100vw - 32px), (max-width: 980px) 50vw, 380px',
  'media-img': '(max-width: 980px) calc(100vw - 32px), 460px',
  'cover-img': '(max-width: 780px) calc(100vw - 32px), 740px',
};
const variants = (src, ext, widths) => widths.map((w) => `${src.replace('.jpg', `-${w}.${ext}`)} ${w}w`).join(', ');
// vt: view-transition-name shared by a card image and its page's hero, so the image morphs between pages
const pic = (im, { cls = '', eager = false, vt = '' } = {}) => {
  const widths = [480, 800, 1200].filter((w) => w <= im.w);
  const sizes = SIZES[cls] || '100vw';
  return `<picture${cls ? ` class="${cls}"` : ''}${vt ? ` style="view-transition-name: vt-${vt}"` : ''}>`
    + `<source type="image/avif" srcset="${variants(im.src, 'avif', widths)}" sizes="${sizes}">`
    + `<source type="image/webp" srcset="${variants(im.src, 'webp', widths)}" sizes="${sizes}">`
    + `<img src="${im.src.replace('.jpg', '-800.jpg')}" srcset="${variants(im.src, 'jpg', widths)}" sizes="${sizes}" alt="${esc(im.alt)}" width="${im.w}" height="${im.h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
};
const preloadImg = (im, cls) => im ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${variants(im.src, 'avif', [480, 800, 1200].filter((w) => w <= im.w))}" imagesizes="${SIZES[cls]}" fetchpriority="high">` : '';
const portrait = (eager = false) =>
  `<picture class="portrait" data-reveal><source type="image/avif" srcset="/assets/piyush-mittal-480.avif 480w"><source type="image/webp" srcset="/assets/piyush-mittal-480.webp 480w"><img src="${site.photo}" srcset="/assets/piyush-mittal-480.jpg 480w, ${site.photo} 520w" sizes="(max-width: 980px) 280px, 400px" alt="${esc(site.name)}, business growth and AI solutions consultant" width="520" height="650"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
const avatar = (cls = 'avatar') => `<img class="${cls}" src="${site.headshot}" alt="" width="64" height="64" loading="lazy" decoding="async">`;

const PERSON_ID = abs('/#person');
const BUSINESS_ID = abs('/#business');
const WEBSITE_ID = abs('/#website');
const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: site.name,
  url: abs('/'),
  jobTitle: site.jobTitle,
  description: site.description,
  email: `mailto:${site.email}`,
  telephone: site.phoneE164,
  image: abs(site.photo),
  knowsAbout: site.knowsAbout,
  worksFor: { '@id': BUSINESS_ID },
  address: { '@type': 'PostalAddress', addressCountry: site.location.country, ...(site.location.locality && { addressLocality: site.location.locality }), ...(site.location.region && { addressRegion: site.location.region }) },
  ...(site.profiles.length && { sameAs: site.profiles.map((p) => p.url) }),
};
const business = {
  '@type': 'ProfessionalService', '@id': BUSINESS_ID, name: `${site.name} — ${site.tagline}`, url: abs('/'),
  description: site.description, image: abs(site.photo), logo: abs('/assets/apple-touch-icon.png'),
  email: site.email, telephone: site.phoneE164, founder: { '@id': PERSON_ID },
  areaServed: { '@type': 'Country', name: site.location.country },
  address: { '@type': 'PostalAddress', addressCountry: site.location.country, ...(site.location.locality && { addressLocality: site.location.locality }) },
  knowsAbout: site.knowsAbout,
  ...(site.profiles.length && { sameAs: site.profiles.map((p) => p.url) }),
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, url: abs(`/services/${s.slug}/`) } })) },
};
const website = { '@type': 'WebSite', '@id': WEBSITE_ID, url: abs('/'), name: site.name, alternateName: `${site.name} — ${site.tagline}`, description: site.description, publisher: { '@id': PERSON_ID }, inLanguage: 'en-IN' };
const breadcrumb = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'], ...trail].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

const ARROW = '<svg class="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function layout({ path, title, description, body, schema = [], type = 'website', nav = '', noindex = false, image = null, hero = '', scripts = [] }) {
  const shareImage = image ? abs(image.src) : abs('/assets/og-image.jpg');
  const shareSize = image ? [image.w, image.h] : [1200, 630];
  const url = abs(path);
  const navItems = [['Home', '/'], ['Services', '/services/'], ['Office', '/office/'], ['About', '/about/'], ['Insights', '/insights/']];
  const jsonld = { '@context': 'https://schema.org', '@graph': schema };
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="author" content="${esc(site.name)}">
<meta name="theme-color" content="#f5f2ea">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${shareImage}">
<meta property="og:image:width" content="${shareSize[0]}">
<meta property="og:image:height" content="${shareSize[1]}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${shareImage}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} — Insights" href="/insights/feed.xml">
<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
${hero}
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add('js')</script>
${schema.length ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">PM</span><span class="brand-name">${esc(site.name)}</span></a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav"><span class="sr">Menu</span><span class="bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      ${navItems.map(([l, h]) => `<a href="${h}"${nav === h ? ' aria-current="page"' : ''}>${l}${h === '/office/' ? '<span class="nav-new">New</span>' : ''}</a>`).join('')}
      <a class="btn btn-small" href="/contact/"${nav === '/contact/' ? ' aria-current="page"' : ''}>Let's talk</a>
    </nav>
  </div>
</header>
<div class="progress" aria-hidden="true"><span></span></div>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-cta">
      <p class="footer-statement">Every growing business has a next bottleneck. Let's find yours and fix it.</p>
      <a class="btn btn-light" href="${ctaHref}"${ctaAttrs}>Start a conversation ${ARROW}</a>
    </div>
    <div class="footer-grid">
      <div>
        <p class="footer-name">${esc(site.name)}</p>
        <p class="footer-role">${esc(site.jobTitle)}${site.location.locality ? ` · ${esc(site.location.locality)}` : ''}, ${esc(site.location.country)}</p>
        <p><a href="mailto:${site.email}">${site.email}</a><br><a href="${telHref}">${esc(site.phone)}</a> · <a href="${waHref}" target="_blank" rel="noopener">WhatsApp</a></p>
      </div>
      <div>
        <p class="footer-h">Services</p>
        <ul>${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.short)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <p class="footer-h">Explore</p>
        <ul><li><a href="/office/">Virtual office</a></li><li><a href="/about/">About</a></li><li><a href="/insights/">Insights</a></li><li><a href="/contact/">Contact</a></li></ul>
      </div>
      ${site.profiles.length ? `<div><p class="footer-h">Elsewhere</p><ul>${site.profiles.map((p) => `<li><a href="${p.url}" rel="me noopener" target="_blank">${esc(p.label)}</a></li>`).join('')}</ul></div>` : ''}
    </div>
    <p class="footer-legal"><span>© ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</span><a href="/privacy/">Privacy</a></p>
  </div>
</footer>
<a class="fab-wa" href="${waHref}?text=${encodeURIComponent('Hi Piyush, I found your website and would like to talk about my business.')}" target="_blank" rel="noopener" aria-label="Chat with ${esc(site.name)} on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5 0-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5 0-.2-.3-.3-.6-.4Z"/></svg><span>Chat on WhatsApp</span></a>
<button class="to-top" type="button" aria-label="Back to top"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V5m-4.5 4.5L10 5l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<script src="/assets/site.js" defer></script>
<script src="/assets/bot.js" defer></script>${scripts.map((s) => `
<script src="${s}" defer></script>`).join('')}
</body>
</html>
`;
}

function emit(path, html, { priority = '0.7', lastmod = siteUpdated, sitemap = true } = {}) {
  const file = path.endsWith('.html') || path.endsWith('.xml') ? join(out, path) : join(out, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (sitemap) pages.push({ path, priority, lastmod });
}

const crumbs = (trail) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${trail.map(([l, h], i) => (i === trail.length - 1 ? `<span aria-current="page">${esc(l)}</span>` : `<a href="${h}">${esc(l)}</a>`)).join('')}</nav>`;

const ctaBand = (heading = 'Have a problem worth solving?', text = 'Tell me what is slowing your business down. You\'ll get an honest view of what I\'d look at first — even if we don\'t end up working together.', href = ctaHref, label = 'Book a free 30-minute call') => `
<section class="cta-band" data-reveal>
  <div class="wrap cta-inner">
    <h2>${heading}</h2>
    <div><p>${text}</p><a class="btn" href="${href}"${href === site.calendarUrl ? ctaAttrs : ''}>${label} ${ARROW}</a></div>
  </div>
</section>`;

const postCard = (p) => `
<article class="post-card" data-reveal>
  <a href="/insights/${p.slug}/">
    ${p.image ? pic(p.image, { cls: 'card-img', vt: `post-${p.slug}` }) : ''}
    <p class="meta"><span class="tag">${esc(p.tag)}</span><time datetime="${p.date}">${fmtDate(p.date)}</time></p>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <span class="link">Read article ${ARROW}</span>
  </a>
</article>`;

const savingsCalc = `
<section class="section" id="savings">
  <div class="wrap calc-wrap">
    <header data-reveal>
      <p class="eyebrow">Savings calculator</p>
      <h2>What is repetitive work <em>costing</em> you?</h2>
      <p class="lede">Move the sliders to match your team. The estimate shows the time and money a well-chosen automation could give back each year.</p>
      <p class="muted small">Estimates only — real savings depend on the task. A free call gives you a proper number.</p>
    </header>
    <form class="calc" data-reveal data-calc onsubmit="return false">
      <label><span>People doing repetitive tasks <output data-for="people">3</output></span><input type="range" name="people" min="1" max="25" value="3"></label>
      <label><span>Hours per person each week <output data-for="hours">6</output></span><input type="range" name="hours" min="1" max="30" value="6"></label>
      <label><span>Cost of one hour of their time (₹) <output data-for="rate">300</output></span><input type="range" name="rate" min="100" max="2000" step="50" value="300"></label>
      <label><span>Share that can be automated <output data-for="share">50</output>%</span><input type="range" name="share" min="20" max="80" step="5" value="50"></label>
      <div class="calc-out" aria-live="polite">
        <div><b data-out="hours">0</b><span>hours saved a year</span></div>
        <div><b data-out="days">0</b><span>working days freed</span></div>
        <div class="big"><b data-out="money">₹0</b><span>value returned every year</span></div>
      </div>
      <a class="btn" href="/contact/?topic=${encodeURIComponent('AI Implementation & Workflow Automation')}">Find my first automation ${ARROW}</a>
    </form>
  </div>
</section>`;

/* ---------------- Home ---------------- */
const problems = [
  ['Sales are growing, but profit isn\'t', 'business-consulting-growth-strategy', 'Fixable. Let\'s find where the margin goes.'],
  ['Everything still runs through the owner', 'business-weakness-analysis-process-improvement', 'Fixable. Let\'s free up your calendar.'],
  ['We keep losing deals and don\'t know why', 'market-research-competitor-analysis', 'Fixable. Let\'s see what your buyers see.'],
  ['Growth has stalled and the next move isn\'t obvious', 'business-consulting-growth-strategy', 'Fixable. Let\'s build a 90-day plan.'],
  ['Leads arrive, but follow-up is slow or forgotten', 'online-presence-lead-generation', 'Fixable. Let\'s make sure no lead goes cold.'],
  ['Your team loses hours to copy-paste and reporting', 'ai-implementation-workflow-automation', 'Fixable. Let AI do the boring bits.'],
];
// bento layout for the homepage services: [slug, size, tone]
const bento = [
  ['business-consulting-growth-strategy', 'xl', 'img'],
  ['business-weakness-analysis-process-improvement', 'wide', 'coral'],
  ['market-research-competitor-analysis', 'sq', 'zap'],
  ['ai-implementation-workflow-automation', 'sq', 'ink'],
  ['online-presence-lead-generation', 'wide', 'img'],
  ['digital-marketing-seo', 'sq', 'lime'],
  ['website-development', 'sq', 'paper'],
];
const tickerItems = ['Business consulting', 'Growth strategy', 'Pricing & margins', 'Process fixes', 'Market research', '90-day plans', 'AI automation', 'Lead follow-up', 'Websites that sell', 'Business first'];

emit('/', layout({
  path: '/',
  nav: '/',
  title: `${site.name} — Business Growth & AI Solutions Consultant`,
  description: site.description,
  schema: [website, person, business, { '@type': 'WebPage', '@id': abs('/#webpage'), url: abs('/'), name: `${site.name} — ${site.tagline}`, isPartOf: { '@id': WEBSITE_ID }, about: { '@id': PERSON_ID }, inLanguage: 'en-IN' }, { '@type': 'FAQPage', '@id': abs('/#faq'), mainEntity: homeFaqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
  body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="status-pill" data-reveal><span class="live-dot" aria-hidden="true"></span>${esc(site.tagline)}<span class="pill-extra"> · replies within 24h</span></p>
      <h1 data-reveal><span class="hello">Hi, I'm ${esc(site.name)} 👋</span> I find what's holding your business back and build <em class="hl">the fix</em>.</h1>
      <p class="lede" data-reveal>${esc(site.message)} I'm a business consultant first: I work with owners on strategy, profit, pricing and processes, then build whatever the plan needs, from AI automation to websites and marketing.</p>
      <p class="rotator" data-reveal aria-live="off">Today that could be <span class="rot-words"><span class="is-on">a 90-day growth plan</span><span>a business that runs without you</span><span>healthier margins</span><span>an AI assistant that replies in minutes</span><span>a website that sells</span></span></p>
      <div class="hero-actions" data-reveal>
        <a class="btn" href="${ctaHref}"${ctaAttrs}>Book a free strategy call ${ARROW}</a>
        <a class="btn btn-ghost" href="#health-check">Take the 2-minute health check</a>
      </div>
    </div>
    <div class="diag-wrap">
    <span class="sticker sticker-1" aria-hidden="true">Strategy + AI ⚡</span>
    <span class="sticker sticker-2" aria-hidden="true">No jargon</span>
    <span class="sticker sticker-3" aria-hidden="true">Business first ✓</span>
    <aside class="diag" data-reveal aria-label="Example of a business growth diagnostic">
      <div class="diag-head"><span>Growth diagnostic</span><span class="diag-tag">Example</span></div>
      <ul class="diag-list">
        <li><span>Enquiry follow-up</span><span class="bar"><i style="--w:28%"></i></span><b class="st st-bad">Leaking</b></li>
        <li><span>Website clarity</span><span class="bar"><i style="--w:46%"></i></span><b class="st st-mid">Weak</b></li>
        <li><span>Manual admin</span><span class="bar"><i style="--w:38%"></i></span><b class="st st-mid">6 hrs/wk</b></li>
        <li><span>Search visibility</span><span class="bar"><i style="--w:55%"></i></span><b class="st st-mid">Patchy</b></li>
        <li><span>Repeat customers</span><span class="bar"><i style="--w:82%"></i></span><b class="st st-good">Strong</b></li>
      </ul>
      <div class="diag-foot"><span>Biggest lever</span><strong>Automate first response → reply in minutes, not days</strong></div>
    </aside>
    </div>
  </div>
</section>

<section class="ticker" aria-label="What I work on">
  <div class="ticker-track">${[0, 1].map((n) => `<ul class="ticker-list"${n ? ' aria-hidden="true"' : ''}>${tickerItems.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`).join('')}</div>
  <button class="ticker-toggle" type="button" aria-pressed="false" aria-label="Pause scrolling text"><span aria-hidden="true">❚❚</span></button>
</section>

<section class="strip" aria-label="How I work">
  <div class="wrap strip-inner">
    <p><b>Business first.</b> Every engagement starts with your numbers and your customers — not a tool.</p>
    <p><b>Built, not just advised.</b> I implement what I recommend: sites, campaigns, automations.</p>
    <p><b>Small-business sized.</b> Plans scaled to your team, budget and pace.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="section-head" data-reveal>
      <p class="eyebrow">Sound familiar?</p>
      <h2>The problems I'm usually called in to solve</h2>
    </header>
    <ul class="chats">
      ${problems.map(([p, s, reply]) => `<li class="chat" data-reveal><a href="/services/${s}/">
        <span class="chat-head"><span class="chat-avatar" aria-hidden="true">BO</span><span><b>Business owner</b><small>online</small></span></span>
        <span class="msg msg-in">${esc(p)}</span>
        <span class="typing" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="msg msg-out">${esc(reply)} <u>${esc(svc(s).short)} ${ARROW}</u></span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section-tint" id="health-check">
  <div class="wrap hc-wrap">
    <header class="hc-intro" data-reveal>
      <p class="eyebrow">Free 2-minute tool</p>
      <h2>How healthy is your business, <em>really</em>?</h2>
      <p class="lede">Answer eight quick questions. You'll get a growth score and the two areas worth fixing first — no email required.</p>
    </header>
    <div class="hc" data-reveal data-hc="${esc(JSON.stringify({ q: healthCheck, s: Object.fromEntries(services.map((s) => [s.slug, { t: s.title, u: `/services/${s.slug}/` }])) }))}">
      <noscript><p>Turn on JavaScript to use the health check, or <a href="/contact/">ask me for a free diagnosis</a>.</p></noscript>
    </div>
  </div>
</section>

<section class="section section-ink">
  <div class="wrap">
    <header class="section-head split" data-reveal>
      <div><p class="eyebrow">Services</p><h2>Seven ways I help businesses grow</h2></div>
      <p>Consulting comes first: understand the business, find the opportunity, then build the solution. Strategy, processes and research lead; technology follows the plan.</p>
    </header>
    <ul class="bento">
      ${bento.map(([slug, size, tone]) => { const s = svc(slug); return `<li class="tile tile-${size} tone-${tone}" data-reveal><a href="/services/${s.slug}/">
        ${tone === 'img' && s.image ? pic(s.image, { cls: 'tile-img' }) : ''}
        <span class="tile-body"><span class="tile-tag">${esc(s.short)}</span><span class="tile-title">${esc(s.title)}</span><span class="tile-sum">${esc(s.summary)}</span></span>
        <span class="tile-go" aria-hidden="true">${ARROW}</span>
      </a></li>`; }).join('')}
    </ul>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="section-head" data-reveal>
      <p class="eyebrow">Approach</p>
      <h2>Consulting first. Then we build.</h2>
    </header>
    <ol class="steps">
      <li data-reveal><span class="num">01</span><h3>Understand</h3><p>How you make money, where customers come from, and where time and revenue leak.</p></li>
      <li data-reveal><span class="num">02</span><h3>Identify</h3><p>The two or three opportunities with the biggest payoff for the least effort.</p></li>
      <li data-reveal><span class="num">03</span><h3>Build</h3><p>The website, campaign, process or AI automation that captures the opportunity.</p></li>
      <li data-reveal><span class="num">04</span><h3>Measure</h3><p>Clear numbers each week, so we keep what works and drop what doesn't.</p></li>
    </ol>
    <dl class="stats" data-reveal>
      <div><dt><span data-count="7">7</span></dt><dd>services under one roof — no hand-offs between agencies</dd></div>
      <div><dt><span data-count="30">30</span><small>min</small></dt><dd>free first call to diagnose your biggest problem</dd></div>
      <div><dt><span data-count="24">24</span><small>h</small></dt><dd>maximum reply time to every message</dd></div>
      <div><dt><span data-count="1">1</span></dt><dd>person from first call to launch — the one who diagnoses also builds</dd></div>
    </dl>
  </div>
</section>

<section class="section section-tint">
  <div class="wrap">
    <header class="section-head split" data-reveal>
      <div><p class="eyebrow">Working together</p><h2>Three ways to start</h2></div>
      <p class="muted">Every business is different, so there are no packages to squeeze into — just three clear ways to begin, scoped to your goals and budget.</p>
    </header>
    <div class="plans">
      ${engagements.map((e) => `<article class="plan${e.featured ? ' is-featured' : ''}" data-reveal>
        <p class="plan-tag">${esc(e.tag)}</p>
        <h3>${esc(e.name)}</h3>
        <p class="plan-len">${esc(e.length)}</p>
        <p>${esc(e.summary)}</p>
        <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <a class="btn${e.featured ? '' : ' btn-ghost'}" href="/contact/?topic=${encodeURIComponent(e.name)}">Start with ${esc(e.name)} ${ARROW}</a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap about-teaser">
    ${portrait()}
    <div data-reveal>
      <p class="eyebrow">About</p>
      <h2>A business mind with a builder's toolkit</h2>
      <p class="lede">I'm ${esc(site.name)}. I sit between business owners and technology: I can read a P&amp;L and a customer journey, and I can also build the website, the campaign or the AI workflow that fixes what I find.</p>
      <p>That combination matters for small businesses, which can't afford a strategy firm, an agency and a developer who don't talk to each other.</p>
      <a class="link" href="/about/">More about me ${ARROW}</a>
    </div>
  </div>
</section>

<section class="section section-tint">
  <div class="wrap">
    <header class="section-head split" data-reveal>
      <div><p class="eyebrow">Insights</p><h2>Notes on growth, AI and small business</h2></div>
      <a class="link" href="/insights/">All articles ${ARROW}</a>
    </header>
    <div class="card-grid three">${posts.map(postCard).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap two-col wide-left">
    <header data-reveal><p class="eyebrow">FAQ</p><h2>Questions people ask before the first call</h2><p class="muted">Still unsure? <a class="link" href="${waHref}" target="_blank" rel="noopener">Ask me on WhatsApp ${ARROW}</a></p></header>
    <div class="faqs">${homeFaqs.map(([q, a]) => `<details data-reveal><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>
${ctaBand()}`,
}), { priority: '1.0' });

/* ---------------- Services ---------------- */
emit('/services/', layout({
  path: '/services/',
  nav: '/services/',
  title: `Services — Business Growth, AI & Digital | ${site.name}`,
  description: 'Growth strategy, AI automation, websites, SEO, market research, process improvement and lead generation for small businesses — by Piyush Mittal.',
  schema: [breadcrumb([['Services', '/services/']]), {
    '@type': 'ItemList', name: 'Services by Piyush Mittal',
    itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/services/${s.slug}/`), name: s.title })),
  }],
  body: `
<section class="page-hero">
  <div class="wrap">
    ${crumbs([['Services', '/services/']])}
    <p class="eyebrow" data-reveal>Services</p>
    <h1 data-reveal>Strategy to find the opportunity. <em>Technology</em> to capture it.</h1>
    <p class="lede" data-reveal>Pick a single service, or let me diagnose the business first and recommend the right mix. Either way, the work is tied to one outcome: more of the right customers, with less wasted effort.</p>
  </div>
</section>
<section class="section pt0">
  <div class="wrap">
    <div class="svc-grid">
      ${services.map((s, i) => `<article class="svc-card" data-reveal><a href="/services/${s.slug}/">${s.image ? pic(s.image, { cls: 'card-img', vt: `svc-${s.slug}` }) : ''}<span class="num">${pad(i + 1)}</span><h2>${esc(s.title)}</h2><p>${esc(s.summary)}</p><ul>${s.deliverables.slice(0, 3).map((d) => `<li>${esc(d)}</li>`).join('')}</ul><span class="link">Learn more ${ARROW}</span></a></article>`).join('')}
    </div>
  </div>
</section>
${ctaBand('Not sure which one you need?', 'Most clients aren\'t. Describe the problem and I\'ll tell you where I\'d start — and what I wouldn\'t spend money on yet.')}`,
}), { priority: '0.9' });

services.forEach((s, idx) => {
  const path = `/services/${s.slug}/`;
  emit(path, layout({
    path,
    nav: '/services/',
    title: `${s.title} | ${site.name}`,
    image: s.image,
    hero: preloadImg(s.image, 'media-img'),
    description: s.metaDescription,
    schema: [
      breadcrumb([['Services', '/services/'], [s.title, path]]),
      { '@type': 'Service', '@id': abs(path + '#service'), name: s.title, description: s.metaDescription, serviceType: s.title, url: abs(path), provider: { '@id': PERSON_ID }, areaServed: { '@type': 'Country', name: site.location.country } },
      { '@type': 'FAQPage', mainEntity: s.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      person,
    ],
    body: `
<section class="page-hero">
  <div class="wrap${s.image ? ' hero-media' : ''}">
    <div>
      ${crumbs([['Services', '/services/'], [s.short, path]])}
      <p class="eyebrow" data-reveal>Service ${pad(idx + 1)} / ${pad(services.length)}</p>
      <h1 data-reveal>${esc(s.title)}</h1>
      <p class="lede" data-reveal>${esc(s.intro)}</p>
      <div class="hero-actions" data-reveal><a class="btn" href="${ctaHref}"${ctaAttrs}>Discuss your project ${ARROW}</a></div>
    </div>
    ${s.image ? pic(s.image, { cls: 'media-img', eager: true, vt: `svc-${s.slug}` }) : ''}
  </div>
</section>
<section class="section pt0">
  <div class="wrap two-col">
    <div data-reveal>
      <h2 class="h3">Signs you need this</h2>
      <ul class="x-list">${s.problems.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    </div>
    <div data-reveal>
      <h2 class="h3">Who it's for</h2>
      <ul class="dot-list">${s.forWho.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    </div>
  </div>
</section>
<section class="section section-ink">
  <div class="wrap two-col wide-left">
    <header data-reveal><p class="eyebrow">What you get</p><h2>Deliverables</h2></header>
    <ol class="deliverables">${s.deliverables.map((d, i) => `<li data-reveal><span class="num">${pad(i + 1)}</span>${esc(d)}</li>`).join('')}</ol>
  </div>
</section>
${s.slug === 'ai-implementation-workflow-automation' ? savingsCalc : ''}
<section class="section">
  <div class="wrap">
    <header class="section-head" data-reveal><p class="eyebrow">Process</p><h2>How it works</h2></header>
    <ol class="steps">${s.process.map(([t, d], i) => `<li data-reveal><span class="num">${pad(i + 1)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="section section-tint">
  <div class="wrap two-col wide-left">
    <header data-reveal><p class="eyebrow">FAQ</p><h2>Common questions</h2></header>
    <div class="faqs">${s.faqs.map(([q, a]) => `<details data-reveal><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <header class="section-head" data-reveal><p class="eyebrow">Often paired with</p><h2>Related services</h2></header>
    <div class="card-grid">${s.related.map((r) => svc(r)).map((r) => `<article class="svc-card" data-reveal><a href="/services/${r.slug}/">${r.image ? pic(r.image, { cls: 'card-img', vt: `svc-${r.slug}` }) : ''}<h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p><span class="link">Learn more ${ARROW}</span></a></article>`).join('')}</div>
  </div>
</section>
${ctaBand(`Ready to start on ${esc(s.short)}?`, `Tell me where your business is today. On a free 30-minute call I will show you where ${esc(s.short)} could make the biggest difference in the next 90 days, and what it would take.`, `/contact/?topic=${encodeURIComponent(s.title)}`, 'Discuss your project')}`,
  }), { priority: '0.8' });
});

/* ---------------- About ---------------- */
emit('/about/', layout({
  path: '/about/',
  nav: '/about/',
  title: `About ${site.name} — Business Growth & AI Consultant`,
  description: `About ${site.name}: a business growth and AI solutions consultant who helps small businesses identify opportunities and turn ideas into practical solutions.`,
  type: 'profile',
  hero: '<link rel="preload" as="image" type="image/avif" href="/assets/piyush-mittal-480.avif" fetchpriority="high">',
  schema: [breadcrumb([['About', '/about/']]), { '@type': 'ProfilePage', '@id': abs('/about/#profile'), url: abs('/about/'), name: `About ${site.name}`, mainEntity: { '@id': PERSON_ID }, isPartOf: { '@id': WEBSITE_ID }, dateModified: today }, person],
  body: `
<section class="page-hero">
  <div class="wrap about-hero">
    <div>
      ${crumbs([['About', '/about/']])}
      <p class="eyebrow" data-reveal>About</p>
      <h1 data-reveal>I'm ${esc(site.name)}. I help small businesses <em>grow on purpose</em>.</h1>
      <p class="lede" data-reveal>${esc(site.message)}</p>
    </div>
    ${portrait(true)}
  </div>
</section>
<section class="section pt0">
  <div class="wrap two-col wide-right">
    <aside class="facts" data-reveal>
      <dl>
        <dt>Focus</dt><dd>Business growth + AI solutions</dd>
        <dt>Works with</dt><dd>Small &amp; owner-led businesses</dd>
        <dt>Based in</dt><dd>${site.location.locality ? esc(site.location.locality) + ', ' : ''}${esc(site.location.country)} · working remotely</dd>
        <dt>Email</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd>
        ${linkedin ? `<dt>LinkedIn</dt><dd><a href="${linkedin}" rel="me noopener" target="_blank">Connect with Piyush</a></dd>` : ''}
        <dt>Phone / WhatsApp</dt><dd><a href="${telHref}">${esc(site.phone)}</a> · <a href="${waHref}" target="_blank" rel="noopener">Chat on WhatsApp</a></dd>
      </dl>
    </aside>
    <div class="prose" data-reveal>
      <!-- TODO: personalise this story — background, education, first business experience, a specific moment that shaped your approach. Real details build trust and help Google understand who you are. -->
      <h2>Why I do this</h2>
      <p>Small businesses are where most people work and where most ideas begin — yet they're the last to get good strategy or good technology. Big companies have consultants, agencies and IT teams. A business with ten people has the owner, a phone and not enough hours.</p>
      <p>I started working with small businesses because I kept seeing the same pattern: capable owners, good products, and growth held back by a handful of fixable problems — slow follow-up, a website that didn't explain enough, hours lost to manual work, decisions made without clear numbers.</p>
      <h2>How I think</h2>
      <p>I start with the business, not the technology. Before recommending a website, a campaign or an AI tool, I want to understand how you make money, who your best customers are, and where effort is being wasted. Often the most valuable thing I do is tell a client what <em>not</em> to spend on.</p>
      <p>Then I build. Because I work across strategy, marketing, web and AI, the solution doesn't get lost between an adviser and a vendor. The person who diagnosed the problem is the person who fixes it.</p>
      <h2>What I believe</h2>
      <ul>
        <li><strong>Clarity beats complexity.</strong> A simple plan the team follows is worth more than a perfect one nobody reads.</li>
        <li><strong>AI is a tool, not a strategy.</strong> It earns its place by saving hours or winning customers — measurably.</li>
        <li><strong>Small wins compound.</strong> Fix one leak, measure it, then fix the next.</li>
        <li><strong>Honesty is a service.</strong> If something won't work for your business, you'll hear it from me first.</li>
      </ul>
      <h2>Beyond client work</h2>
      <p>I write about growth, AI and small business in <a href="/insights/">Insights</a>, and I'm open to conversations about collaborations, speaking and professional opportunities where business thinking and technology meet.</p>
      ${site.profiles.length ? `<p>You can also find me on ${site.profiles.map((p) => `<a href="${p.url}" rel="me noopener" target="_blank">${esc(p.label)}</a>`).join(', ')}.</p>` : ''}
    </div>
  </div>
</section>
${ctaBand('Let\'s talk about your business', 'Whether you\'re a business owner with a problem to solve or someone with an opportunity to discuss, I\'d like to hear from you.')}`,
}), { priority: '0.9' });

/* ---------------- Insights ---------------- */
emit('/insights/', layout({
  path: '/insights/',
  nav: '/insights/',
  title: `Insights on Business Growth & AI | ${site.name}`,
  description: 'Practical articles by Piyush Mittal on small business growth, AI implementation, websites, marketing and process improvement.',
  schema: [breadcrumb([['Insights', '/insights/']]), { '@type': 'Blog', '@id': abs('/insights/#blog'), name: `${site.name} — Insights`, url: abs('/insights/'), author: { '@id': PERSON_ID }, blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(`/insights/${p.slug}/`), datePublished: p.date })) }],
  body: `
<section class="page-hero">
  <div class="wrap">
    ${crumbs([['Insights', '/insights/']])}
    <p class="eyebrow" data-reveal>Insights</p>
    <h1 data-reveal>Practical notes on <em>growth</em>, AI and running a better business</h1>
    <p class="lede" data-reveal>No hype, no jargon. What I'm seeing work for small businesses — and what isn't worth your money yet.</p>
  </div>
</section>
<section class="section pt0"><div class="wrap"><h2 class="sr">All articles</h2><div class="card-grid three">${posts.map(postCard).join('')}</div></div></section>
${ctaBand()}`,
}), { priority: '0.8' });

posts.forEach((p) => {
  const path = `/insights/${p.slug}/`;
  const others = posts.filter((o) => o !== p).slice(0, 2);
  emit(path, layout({
    path,
    nav: '/insights/',
    title: `${p.seoTitle || p.title} | ${site.name}`,
    image: p.image,
    hero: preloadImg(p.image, 'cover-img'),
    description: p.description,
    type: 'article',
    schema: [
      breadcrumb([['Insights', '/insights/'], [p.title, path]]),
      { '@type': 'BlogPosting', '@id': abs(path + '#article'), headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, url: abs(path), mainEntityOfPage: abs(path), image: abs(p.image ? p.image.src : site.photo), author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID }, isPartOf: { '@id': abs('/insights/#blog') }, inLanguage: 'en-IN' },
      person,
    ],
    body: `
<article>
  <header class="page-hero article-hero">
    <div class="wrap narrow">
      ${crumbs([['Insights', '/insights/'], [p.tag, path]])}
      <p class="meta" data-reveal><span class="tag">${esc(p.tag)}</span><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.readingTime} min read</p>
      <h1 data-reveal>${esc(p.title)}</h1>
      <p class="lede" data-reveal>${esc(p.description)}</p>
      <p class="byline" data-reveal>${avatar()}By <a href="/about/" rel="author">${esc(site.name)}</a></p>
    </div>
  </header>
  ${p.image ? `<div class="wrap narrow">${pic(p.image, { cls: 'cover-img', eager: true, vt: `post-${p.slug}` })}</div>` : ''}
  <div class="wrap narrow prose article-body">${p.body}</div>
  <div class="wrap narrow share" data-share>
    <span>Share this article</span>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(abs(path))}" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://wa.me/?text=${encodeURIComponent(p.title + ' — ' + abs(path))}" target="_blank" rel="noopener">WhatsApp</a>
    <a href="https://x.com/intent/post?text=${encodeURIComponent(p.title)}&amp;url=${encodeURIComponent(abs(path))}" target="_blank" rel="noopener">X</a>
    <button type="button" data-copy="${abs(path)}">Copy link</button>
  </div>
  ${p.related ? `<aside class="wrap narrow help-box"><p class="footer-h">Want help putting this into practice?</p><ul>${p.related.map((slug) => svc(slug)).map((r) => `<li><a href="/services/${r.slug}/"><b>${esc(r.title)}</b><span>${esc(r.summary)}</span></a></li>`).join('')}</ul></aside>` : ''}
  <aside class="wrap narrow author-box">
    ${avatar('avatar lg')}
    <div><p class="footer-h">About the author</p><p><strong>${esc(site.name)}</strong> is a business growth and AI solutions consultant helping small businesses find what's holding them back and fix it. <a href="/about/">More about Piyush</a>${linkedin ? ` or <a href="${linkedin}" rel="me noopener" target="_blank">follow on LinkedIn</a>` : ''}.</p></div>
  </aside>
</article>
<section class="section section-tint">
  <div class="wrap"><header class="section-head" data-reveal><p class="eyebrow">Keep reading</p><h2>More insights</h2></header><div class="card-grid">${others.map(postCard).join('')}</div></div>
</section>
${ctaBand('Want this working in your business?', 'Reading is the easy part. On a free 30-minute call we can pick the one change from this article that would make the biggest difference for you.')}`,
  }), { priority: '0.7', lastmod: p.date });
});

/* ---------------- Contact ---------------- */
emit('/contact/', layout({
  path: '/contact/',
  nav: '/contact/',
  title: `Contact ${site.name} — Book a Free Strategy Call`,
  description: `Contact ${site.name} about business growth, AI automation, websites or marketing. Book a free 30-minute call or send a message.`,
  schema: [breadcrumb([['Contact', '/contact/']]), { '@type': 'ContactPage', url: abs('/contact/'), name: `Contact ${site.name}`, about: { '@id': PERSON_ID } }],
  body: `
<section class="page-hero">
  <div class="wrap contact-grid">
    <div>
      ${crumbs([['Contact', '/contact/']])}
      <p class="eyebrow" data-reveal>Contact</p>
      <h1 data-reveal>Tell me what's <em>slowing you down</em>.</h1>
      <p class="lede" data-reveal>Share a little about your business and the problem you want solved. I reply to every message within one working day.</p>
      <ol class="next" data-reveal>
        <li><b>You send a message</b> — a few lines is enough.</li>
        <li><b>We talk for 30 minutes</b> — free, no pitch deck.</li>
        <li><b>You get a clear recommendation</b> — what I'd do first, and whether I'm the right fit.</li>
      </ol>
      <p class="direct" data-reveal>Want something more fun? <a href="/office/">Walk into my virtual office</a> and the front desk will take your request.</p>
      <p class="direct" data-reveal>Prefer to reach out directly?<br>${linkedin ? `Connect on <a href="${linkedin}" rel="me noopener" target="_blank">LinkedIn</a><br>` : ''}Email <a href="mailto:${site.email}">${site.email}</a><br>Call <a href="${telHref}">${esc(site.phone)}</a> or <a href="${waHref}" target="_blank" rel="noopener">message on WhatsApp</a>${site.calendarUrl ? `<br>Or <a href="${site.calendarUrl}" target="_blank" rel="noopener">pick a time on my calendar</a>.` : ''}</p>
    </div>
    <form class="contact-form" name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="_gotcha" data-reveal data-endpoint="${esc(site.formEndpoint)}" data-email="${esc(site.email)}" novalidate>
      <input type="hidden" name="form-name" value="contact">
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required data-label="your name" aria-describedby="f-name-err"><span class="field-err" id="f-name-err"></span></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required data-label="your email" aria-describedby="f-email-err"><span class="field-err" id="f-email-err"></span></div>
      <div class="field"><label for="f-phone">Phone / WhatsApp <span>(optional, for a quicker reply)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+91"></div>
      <div class="field"><label for="f-company">Business / website <span>(optional)</span></label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="f-topic">What can I help with?</label>
        <select id="f-topic" name="topic">
          <option>Not sure yet — need a diagnosis</option>
          ${services.map((s) => `<option>${esc(s.title)}</option>`).join('')}
          <option>Professional opportunity / collaboration</option>
        </select></div>
      <div class="field"><label for="f-msg">What's the problem or opportunity?</label><textarea id="f-msg" name="message" rows="5" required data-label="a short message" aria-describedby="f-msg-err"></textarea><span class="field-err" id="f-msg-err"></span></div>
      <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn" type="submit">Send message ${ARROW}</button>
      <p class="consent">By sending, you agree to the <a href="/privacy/">privacy policy</a>. Your details are only used to reply to you.</p>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`,
}), { priority: '0.8' });

/* ---------------- Virtual office ---------------- */
emit('/office/', layout({
  path: '/office/',
  nav: '/office/',
  title: `Virtual Office — Walk In and Ask | ${site.name}`,
  description: "Visit Piyush Mittal's virtual office: tell the front desk what you need, get a visitor slip and have it delivered to Piyush's cabin.",
  schema: [breadcrumb([['Office', '/office/']]), { '@type': 'ContactPage', url: abs('/office/'), name: `Virtual office of ${site.name}`, about: { '@id': PERSON_ID } }],
  scripts: ['/assets/office.js'],
  body: officeBody({ site, esc, waHref, ARROW, crumbs }),
}), { priority: '0.8' });

/* ---------------- Privacy & thanks ---------------- */
emit('/privacy/', layout({
  path: '/privacy/',
  title: `Privacy Policy | ${site.name}`,
  description: `How ${site.name}'s website handles your information: what is collected, why, and your choices.`,
  schema: [breadcrumb([['Privacy', '/privacy/']])],
  body: `
<section class="page-hero">
  <div class="wrap narrow">
    ${crumbs([['Privacy', '/privacy/']])}
    <p class="eyebrow">Privacy</p>
    <h1>Privacy policy</h1>
    <p class="lede">Short version: I only collect what you choose to send me, I use it only to reply to you, and I never sell it.</p>
  </div>
</section>
<section class="section pt0">
  <div class="wrap narrow prose">
    <h2>What I collect</h2>
    <p>When you use the contact form, I receive the details you enter — your name, email, business and message. If you message me on WhatsApp or by email, I receive what you send there.</p>
    <h2>How it is used</h2>
    <p>Only to reply to your enquiry and, if we work together, to deliver that work. I don't add you to mailing lists without asking, and I never sell or rent your information.</p>
    <h2>Where it is stored</h2>
    <p>The website is hosted on Netlify, which processes contact-form submissions. Email is handled by Google. Both providers keep data secure under their own privacy policies.</p>
    <h2>Cookies and tracking</h2>
    <p>This site does not use advertising or tracking cookies. Fonts are loaded from Google Fonts, which may log basic technical information such as your IP address.</p>
    <h2>The tools on this site</h2>
    <p>The business health check and savings calculator run entirely in your browser. Your answers are not sent anywhere.</p>
    <h2>Your choices</h2>
    <p>You can ask me to see, correct or delete anything you've sent me at any time: <a href="mailto:${site.email}">${site.email}</a>.</p>
    <p class="muted small">Last updated ${fmtDate(PRIVACY_UPDATED)}.</p>
  </div>
</section>`,
}), { priority: '0.3' });

emit('/contact/thanks/', layout({
  path: '/contact/thanks/', noindex: true,
  title: `Thank you | ${site.name}`,
  description: 'Your message has been received.',
  body: `<section class="page-hero"><div class="wrap narrow"><p class="eyebrow">Message sent</p><h1>Thank you — <em>I'll be in touch</em> within one working day.</h1><p class="lede">Want a faster answer? <a href="${waHref}" target="_blank" rel="noopener">Message me on WhatsApp</a>. Meanwhile, you might like the <a href="/#health-check">business health check</a> or the latest <a href="/insights/">insights</a>.</p><div class="hero-actions"><a class="btn" href="${waHref}" target="_blank" rel="noopener">Message on WhatsApp ${ARROW}</a>${site.profiles.find((p) => p.label === 'LinkedIn') ? `<a class="btn btn-ghost" href="${site.profiles.find((p) => p.label === 'LinkedIn').url}" target="_blank" rel="noopener">Follow on LinkedIn</a>` : '<a class="btn btn-ghost" href="/insights/">Read the insights</a>'}</div></div></section>`,
}), { sitemap: false });

/* ---------------- 404, sitemap, robots, feed, manifest ---------------- */
emit('/404.html', layout({
  path: '/404.html', noindex: true,
  title: `Page not found | ${site.name}`,
  description: 'This page could not be found.',
  body: `<section class="page-hero"><div class="wrap narrow"><p class="eyebrow">404</p><h1>This page has <em>moved or never existed</em>.</h1><p class="lede">The link may be old, or the page may have been removed. These are the most useful places to go next:</p>
<ul class="lost-links"><li><a href="/#health-check"><b>Business health check</b><span>Score your business in 2 minutes</span></a></li><li><a href="/services/"><b>Services</b><span>Seven ways I help businesses grow</span></a></li><li><a href="/insights/"><b>Insights</b><span>Practical articles on growth and AI</span></a></li><li><a href="/contact/"><b>Contact</b><span>Ask me directly</span></a></li></ul></div></section>`,
}), { sitemap: false });

writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(out, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /404.html
Disallow: /contact/thanks/

Sitemap: ${abs('/sitemap.xml')}
`);

writeFileSync(join(out, 'insights', 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>
<title>${esc(site.name)} — Insights</title><link>${abs('/insights/')}</link><description>Notes on business growth, AI and small business.</description><language>en-in</language>
<atom:link href="${abs('/insights/feed.xml')}" rel="self" type="application/rss+xml"/>
${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${abs(`/insights/${p.slug}/`)}</link><guid>${abs(`/insights/${p.slug}/`)}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.description)}</description><content:encoded><![CDATA[${p.image ? `<img src="${abs(p.image.src)}" alt="${esc(p.image.alt)}">` : ''}${p.body}]]></content:encoded></item>`).join('\n')}
</channel></rss>
`);

// Plain-language facts for AI assistants and answer engines (https://llmstxt.org)
writeFileSync(join(out, 'llms.txt'), `# ${site.name}

> ${site.description}

Role: ${site.jobTitle}, based in ${site.location.locality ? site.location.locality + ', ' : ''}${site.location.country}. Works with small and owner-led businesses, in person and remotely.

In ${site.name.split(' ')[0]}'s words: "${site.message}"

- Website: ${abs('/')}
- Email: ${site.email}
- Phone / WhatsApp: ${site.phone}
${site.profiles.map((p) => `- ${p.label}: ${p.url}`).join('\n')}

## Services
${services.map((s) => `- [${s.title}](${abs(`/services/${s.slug}/`)}): ${s.summary}`).join('\n')}

## Ways to work together
${engagements.map((e) => `- ${e.name} (${e.length}): ${e.summary}`).join('\n')}

## Insights
${posts.map((p) => `- [${p.title}](${abs(`/insights/${p.slug}/`)}): ${p.description}`).join('\n')}

## Pages
- [About](${abs('/about/')})
- [Contact](${abs('/contact/')})
- [Privacy](${abs('/privacy/')})
`.replace(/\n{3,}/g, '\n\n'));

writeFileSync(join(out, 'site.webmanifest'), JSON.stringify({ name: site.name, short_name: 'PM', start_url: '/', display: 'browser', background_color: '#f5f2ea', theme_color: '#f5f2ea', icons: [{ src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, null, 2));

/* ---------------- Post-processing: minify, fingerprint, headers ---------------- */
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const minCss = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();
// conservative: drop comment-only lines and indentation, keep line breaks (no ASI risk)
const minJs = (s) => s.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//') && !l.startsWith('/*')).join('\n');
const assets = {};
for (const [file, min] of [['styles.css', minCss], ['site.js', minJs], ['office.js', minJs], ['bot.js', minJs]]) {
  const p = join(out, 'assets', file);
  const code = min(readFileSync(p, 'utf8'));
  const name = file.replace('.', `.${hash(code)}.`);
  writeFileSync(join(out, 'assets', name), code);
  rmSync(p);
  assets[`/assets/${file}`] = `/assets/${name}`;
}
const htmlFiles = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && htmlFiles.push(p); } })(out);
const INLINE_JS = "document.documentElement.classList.add('js')";
for (const f of htmlFiles) {
  let h = readFileSync(f, 'utf8');
  for (const [from, to] of Object.entries(assets)) h = h.split(`"${from}"`).join(`"${to}"`);
  h = h.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
  writeFileSync(f, h);
}
const scriptHash = createHash('sha256').update(INLINE_JS).digest('base64');
const csp = [
  "default-src 'self'", `script-src 'self' 'sha256-${scriptHash}'`, "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:", "font-src 'self'", `connect-src 'self'${site.formEndpoint ? ' ' + new URL(site.formEndpoint).origin : ''}`,
  "form-action 'self'", "frame-ancestors 'self'", "base-uri 'self'", "object-src 'none'", 'upgrade-insecure-requests',
].join('; ');
writeFileSync(join(out, '_headers'), `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*.css
  Cache-Control: public, max-age=31536000, immutable
/assets/*.js
  Cache-Control: public, max-age=31536000, immutable
/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/assets/img/*
  Cache-Control: public, max-age=2592000
`);

console.log(`Built ${pages.length} pages → dist/ (${Object.values(assets).join(', ')})`);
