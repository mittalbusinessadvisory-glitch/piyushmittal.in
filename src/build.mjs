// Zero-dependency static site generator. Run: node src/build.mjs  → outputs ./dist
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './config.mjs';
import { services, posts } from './content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const today = new Date().toISOString().slice(0, 10);
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
const waHref = `https://wa.me/${site.phoneE164.replace('+', '')}`;
const portrait = (eager = false) =>
  `<picture class="portrait" data-reveal><source srcset="${site.photo.replace('.jpg', '.webp')}" type="image/webp"><img src="${site.photo}" alt="${esc(site.name)}, business growth and AI solutions consultant" width="520" height="650"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
const avatar = (cls = 'avatar') => `<img class="${cls}" src="${site.headshot}" alt="" width="64" height="64" loading="lazy" decoding="async">`;

const PERSON_ID = abs('/#person');
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
  address: { '@type': 'PostalAddress', addressCountry: site.location.country, ...(site.location.locality && { addressLocality: site.location.locality }), ...(site.location.region && { addressRegion: site.location.region }) },
  ...(site.profiles.length && { sameAs: site.profiles.map((p) => p.url) }),
};
const website = { '@type': 'WebSite', '@id': WEBSITE_ID, url: abs('/'), name: site.name, alternateName: `${site.name} — ${site.tagline}`, description: site.description, publisher: { '@id': PERSON_ID }, inLanguage: 'en-IN' };
const breadcrumb = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'], ...trail].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

const ARROW = '<svg class="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function layout({ path, title, description, body, schema = [], type = 'website', nav = '', noindex = false }) {
  const url = abs(path);
  const navItems = [['Services', '/services/'], ['About', '/about/'], ['Insights', '/insights/']];
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
<meta property="og:image" content="${abs('/assets/og-image.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs('/assets/og-image.png')}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} — Insights" href="/insights/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add('js')</script>
${schema.length ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(site.name)} — home"><span class="brand-mark" aria-hidden="true">PM</span><span class="brand-name">${esc(site.name)}</span></a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav"><span class="sr">Menu</span><span class="bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      ${navItems.map(([l, h]) => `<a href="${h}"${nav === h ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
      <a class="btn btn-small" href="/contact/"${nav === '/contact/' ? ' aria-current="page"' : ''}>Let's talk</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-cta">
      <p class="footer-statement">${esc(site.message)}</p>
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
        <ul><li><a href="/about/">About</a></li><li><a href="/insights/">Insights</a></li><li><a href="/contact/">Contact</a></li></ul>
      </div>
      ${site.profiles.length ? `<div><p class="footer-h">Elsewhere</p><ul>${site.profiles.map((p) => `<li><a href="${p.url}" rel="me noopener" target="_blank">${esc(p.label)}</a></li>`).join('')}</ul></div>` : ''}
    </div>
    <p class="footer-legal">© ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</p>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

function emit(path, html, { priority = '0.7', lastmod = today, sitemap = true } = {}) {
  const file = path.endsWith('.html') || path.endsWith('.xml') ? join(out, path) : join(out, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (sitemap) pages.push({ path, priority, lastmod });
}

const crumbs = (trail) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${trail.map(([l, h], i) => (i === trail.length - 1 ? `<span aria-current="page">${esc(l)}</span>` : `<a href="${h}">${esc(l)}</a>`)).join('')}</nav>`;

const ctaBand = (heading = 'Have a problem worth solving?', text = 'Tell me what is slowing your business down. You\'ll get an honest view of what I\'d look at first — even if we don\'t end up working together.') => `
<section class="cta-band" data-reveal>
  <div class="wrap cta-inner">
    <h2>${heading}</h2>
    <div><p>${text}</p><a class="btn" href="${ctaHref}"${ctaAttrs}>Book a free 30-minute call ${ARROW}</a></div>
  </div>
</section>`;

const postCard = (p) => `
<article class="post-card" data-reveal>
  <a href="/insights/${p.slug}/">
    <p class="meta"><span class="tag">${esc(p.tag)}</span><time datetime="${p.date}">${fmtDate(p.date)}</time></p>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <span class="link">Read article ${ARROW}</span>
  </a>
</article>`;

/* ---------------- Home ---------------- */
const problems = [
  ['Leads arrive, but follow-up is slow or forgotten', 'online-presence-lead-generation'],
  ['The website looks fine but rarely produces enquiries', 'website-development'],
  ['Your team loses hours to copy-paste and reporting', 'ai-implementation-workflow-automation'],
  ['Competitors show up on Google and you don\'t', 'digital-marketing-seo'],
  ['Growth has stalled and the next move isn\'t obvious', 'business-consulting-growth-strategy'],
  ['Everything still runs through the owner', 'business-weakness-analysis-process-improvement'],
];

emit('/', layout({
  path: '/',
  nav: '/',
  title: `${site.name} — Business Growth & AI Solutions Consultant`,
  description: site.description,
  schema: [website, person, { '@type': 'WebPage', '@id': abs('/#webpage'), url: abs('/'), name: `${site.name} — ${site.tagline}`, isPartOf: { '@id': WEBSITE_ID }, about: { '@id': PERSON_ID }, inLanguage: 'en-IN' }],
  body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow" data-reveal>${esc(site.tagline)}</p>
      <h1 data-reveal><span class="hello">Hi, I'm ${esc(site.name)}.</span> I find what's holding your business back — and build <em>the fix</em>.</h1>
      <p class="lede" data-reveal>${esc(site.message)} I work with small businesses on strategy, websites, marketing and AI automation — whatever the problem actually needs.</p>
      <div class="hero-actions" data-reveal>
        <a class="btn" href="${ctaHref}"${ctaAttrs}>Book a free strategy call ${ARROW}</a>
        <a class="btn btn-ghost" href="/services/">See how I help</a>
      </div>
    </div>
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
    <ol class="problems">
      ${problems.map(([p, s], i) => `<li data-reveal><a href="/services/${s}/"><span class="num">${pad(i + 1)}</span><span class="p">${esc(p)}</span><span class="s">${esc(svc(s).short)} ${ARROW}</span></a></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section section-ink">
  <div class="wrap">
    <header class="section-head split" data-reveal>
      <div><p class="eyebrow">Services</p><h2>Seven ways I help businesses grow</h2></div>
      <p>Each service stands on its own, but they work best together: understand the business, find the opportunity, then build the solution.</p>
    </header>
    <ul class="svc-list">
      ${services.map((s, i) => `<li data-reveal><a href="/services/${s.slug}/"><span class="num">${pad(i + 1)}</span><span class="t">${esc(s.title)}</span><span class="d">${esc(s.summary)}</span>${ARROW}</a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="section-head" data-reveal>
      <p class="eyebrow">Approach</p>
      <h2>From problem to working solution</h2>
    </header>
    <ol class="steps">
      <li data-reveal><span class="num">01</span><h3>Understand</h3><p>How you make money, where customers come from, and where time and revenue leak.</p></li>
      <li data-reveal><span class="num">02</span><h3>Identify</h3><p>The two or three opportunities with the biggest payoff for the least effort.</p></li>
      <li data-reveal><span class="num">03</span><h3>Build</h3><p>The website, campaign, process or AI automation that captures the opportunity.</p></li>
      <li data-reveal><span class="num">04</span><h3>Measure</h3><p>Clear numbers each week, so we keep what works and drop what doesn't.</p></li>
    </ol>
  </div>
</section>

<section class="section section-tint">
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

<section class="section">
  <div class="wrap">
    <header class="section-head split" data-reveal>
      <div><p class="eyebrow">Insights</p><h2>Notes on growth, AI and small business</h2></div>
      <a class="link" href="/insights/">All articles ${ARROW}</a>
    </header>
    <div class="card-grid three">${posts.map(postCard).join('')}</div>
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
      ${services.map((s, i) => `<article class="svc-card" data-reveal><a href="/services/${s.slug}/"><span class="num">${pad(i + 1)}</span><h2>${esc(s.title)}</h2><p>${esc(s.summary)}</p><ul>${s.deliverables.slice(0, 3).map((d) => `<li>${esc(d)}</li>`).join('')}</ul><span class="link">Learn more ${ARROW}</span></a></article>`).join('')}
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
    description: s.metaDescription,
    schema: [
      breadcrumb([['Services', '/services/'], [s.title, path]]),
      { '@type': 'Service', '@id': abs(path + '#service'), name: s.title, description: s.metaDescription, serviceType: s.title, url: abs(path), provider: { '@id': PERSON_ID }, areaServed: { '@type': 'Country', name: site.location.country } },
      { '@type': 'FAQPage', mainEntity: s.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      person,
    ],
    body: `
<section class="page-hero">
  <div class="wrap">
    ${crumbs([['Services', '/services/'], [s.short, path]])}
    <p class="eyebrow" data-reveal>Service ${pad(idx + 1)} / ${pad(services.length)}</p>
    <h1 data-reveal>${esc(s.title)}</h1>
    <p class="lede" data-reveal>${esc(s.intro)}</p>
    <div class="hero-actions" data-reveal><a class="btn" href="${ctaHref}"${ctaAttrs}>Discuss your project ${ARROW}</a></div>
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
    <div class="card-grid">${s.related.map((r) => svc(r)).map((r) => `<article class="svc-card" data-reveal><a href="/services/${r.slug}/"><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p><span class="link">Learn more ${ARROW}</span></a></article>`).join('')}</div>
  </div>
</section>
${ctaBand()}`,
  }), { priority: '0.8' });
});

/* ---------------- About ---------------- */
emit('/about/', layout({
  path: '/about/',
  nav: '/about/',
  title: `About ${site.name} — Business Growth & AI Consultant`,
  description: `About ${site.name}: a business growth and AI solutions consultant who helps small businesses identify opportunities and turn ideas into practical solutions.`,
  type: 'profile',
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
<section class="section pt0"><div class="wrap"><div class="card-grid three">${posts.map(postCard).join('')}</div></div></section>
${ctaBand()}`,
}), { priority: '0.8' });

posts.forEach((p) => {
  const path = `/insights/${p.slug}/`;
  const others = posts.filter((o) => o !== p).slice(0, 2);
  emit(path, layout({
    path,
    nav: '/insights/',
    title: `${p.title} | ${site.name}`,
    description: p.description,
    type: 'article',
    schema: [
      breadcrumb([['Insights', '/insights/'], [p.title, path]]),
      { '@type': 'BlogPosting', '@id': abs(path + '#article'), headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, url: abs(path), mainEntityOfPage: abs(path), image: abs(site.photo), author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID }, isPartOf: { '@id': abs('/insights/#blog') }, inLanguage: 'en-IN' },
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
  <div class="wrap narrow prose article-body">${p.body}</div>
  <aside class="wrap narrow author-box">
    ${avatar('avatar lg')}
    <div><p class="footer-h">About the author</p><p><strong>${esc(site.name)}</strong> is a business growth and AI solutions consultant helping small businesses find what's holding them back and fix it. <a href="/about/">More about Piyush</a>.</p></div>
  </aside>
</article>
<section class="section section-tint">
  <div class="wrap"><header class="section-head" data-reveal><p class="eyebrow">Keep reading</p><h2>More insights</h2></header><div class="card-grid">${others.map(postCard).join('')}</div></div>
</section>
${ctaBand()}`,
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
      <p class="direct" data-reveal>Prefer to reach out directly?<br>Email <a href="mailto:${site.email}">${site.email}</a><br>Call <a href="${telHref}">${esc(site.phone)}</a> or <a href="${waHref}" target="_blank" rel="noopener">message on WhatsApp</a>${site.calendarUrl ? `<br>Or <a href="${site.calendarUrl}" target="_blank" rel="noopener">pick a time on my calendar</a>.` : ''}</p>
    </div>
    <form class="contact-form" data-reveal data-endpoint="${esc(site.formEndpoint)}" data-email="${esc(site.email)}" novalidate>
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-company">Business / website <span>(optional)</span></label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="f-topic">What can I help with?</label>
        <select id="f-topic" name="topic">
          <option>Not sure yet — need a diagnosis</option>
          ${services.map((s) => `<option>${esc(s.title)}</option>`).join('')}
          <option>Professional opportunity / collaboration</option>
        </select></div>
      <div class="field"><label for="f-msg">What's the problem or opportunity?</label><textarea id="f-msg" name="message" rows="5" required></textarea></div>
      <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn" type="submit">Send message ${ARROW}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`,
}), { priority: '0.8' });

/* ---------------- 404, sitemap, robots, feed, manifest ---------------- */
emit('/404.html', layout({
  path: '/404.html', noindex: true,
  title: `Page not found | ${site.name}`,
  description: 'This page could not be found.',
  body: `<section class="page-hero"><div class="wrap narrow"><p class="eyebrow">404</p><h1>This page has <em>moved or never existed</em>.</h1><p class="lede">Try the <a href="/">homepage</a>, browse <a href="/services/">services</a>, or <a href="/contact/">get in touch</a>.</p></div></section>`,
}), { sitemap: false });

writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(out, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${abs('/sitemap.xml')}
`);

writeFileSync(join(out, 'insights', 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${esc(site.name)} — Insights</title><link>${abs('/insights/')}</link><description>Notes on business growth, AI and small business.</description><language>en-in</language>
<atom:link href="${abs('/insights/feed.xml')}" rel="self" type="application/rss+xml"/>
${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${abs(`/insights/${p.slug}/`)}</link><guid>${abs(`/insights/${p.slug}/`)}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('\n')}
</channel></rss>
`);

writeFileSync(join(out, 'site.webmanifest'), JSON.stringify({ name: site.name, short_name: 'PM', start_url: '/', display: 'browser', background_color: '#f5f2ea', theme_color: '#f5f2ea', icons: [{ src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, null, 2));

console.log(`Built ${pages.length} pages → dist/`);
