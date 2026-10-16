# piyushmittal.in

Personal brand website for **Piyush Mittal: Business Growth + AI Solutions**.

It's a static site built by a small dependency-free Node script: plain HTML, CSS and JS, so it loads fast. Hosting is on Netlify, which deploys from the `main` branch on GitHub.

## Deploys: weekly, on Sunday

Netlify's free plan charges 15 credits per production deploy (300 credits a month). **Commit during the week and push once on Sunday.** Every push to `main` triggers a deploy.

## Structure

```
src/
  config.mjs     ← name, email, phone, photo, location, social profiles (edit this first)
  content.mjs    ← all copy: services, articles, health check, plans, FAQs
  build.mjs      ← templates, SEO, structured data, sitemap, RSS, llms.txt, minify, _headers
  static/        ← copied as-is: CSS, JS, fonts, images, icons
tools/
  build_fonts.py   ← self-hosted subset WOFF2 fonts (run once, output is committed)
  build_images.py  ← AVIF/WebP/JPEG at 480/800/1200 px for every photo
  build_og.py      ← 1200×630 share image
dist/            ← generated site (not committed; Netlify builds it)
```

## Build and preview

```bash
node src/build.mjs
```

```bash
npx serve dist
```

After adding or replacing a photo in `src/static/assets/img/` (1200 px wide JPEG), run `python tools/build_images.py`.

## Still needed from Piyush

These are tracked in the audit (see the artifact link shared in chat):

- **Social profile links** in `config.mjs → profiles`. They feed `sameAs`, the strongest signal for ranking on your name.
- **City** in `config.mjs → location`.
- **Booking calendar link** (Cal.com or Calendly) in `config.mjs → calendarUrl`.
- **Testimonials and real case studies.**
- **About page story**, plus a professional headshot.
- **Domain auto-renew** turned on at GoDaddy.
- **Analytics** approval (Plausible, Umami or GA4).

## Ranking for "Piyush Mittal"

1. Google Search Console is verified (domain property) and the sitemap has been submitted.
2. Use the same name, photo and headline everywhere, and link every profile back to `https://www.piyushmittal.in`.
3. Claim LinkedIn, Google Business Profile and the main directories (Clutch, GoodFirms, JustDial).
4. Publish two articles a month in `content.mjs → posts`, and share each one on LinkedIn.
5. Earn mentions: guest posts, podcasts, and client sites crediting "Website by Piyush Mittal".
