// "Biz Bot": a small helper that roams the edges of the screen, follows the cursor with its eyes
// and shares business facts. Facts with a statistic name their source; tips are marked as tips.
(() => {
  if (window.matchMedia('print').matches) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  const FACTS = [
    { k: 'Biz fact', t: 'Reply to a new lead within 5 minutes and you are far more likely to reach them than if you wait 30 minutes.', s: 'Lead Response Management Study, MIT & InsideSales' },
    { k: 'Biz fact', t: 'Winning a new customer can cost 5 to 25 times more than keeping one you already have.', s: 'Harvard Business Review, 2014' },
    { k: 'Biz fact', t: 'A 5% rise in customer retention can lift profits by 25% to 95%.', s: 'Bain & Company' },
    { k: 'Biz fact', t: '53% of mobile visitors leave a site that takes longer than 3 seconds to load.', s: 'Google, 2016' },
    { k: 'Biz fact', t: 'Fewer than 1 in 100 Google searchers click a result on page two.', s: 'Backlinko, 2023' },
    { k: 'Biz fact', t: 'Visitors form a first impression of your website in about 50 milliseconds.', s: 'Lindgaard et al., 2006' },
    { k: 'Biz fact', t: 'About 3 in 4 people judge a company’s credibility by its website design.', s: 'Stanford Web Credibility Research' },
    { k: 'Pro tip', t: 'An unanswered WhatsApp message is a customer asking your competitor next.' },
    { k: 'Pro tip', t: 'Prices you haven’t reviewed in years quietly shrink your margin as costs rise.' },
    { k: 'Pro tip', t: 'Every hour spent copy-pasting data is an hour not spent selling. Automate the boring bits first.' },
    { k: 'Pro tip', t: 'If your business can’t run for a week without you, the owner is the bottleneck.' },
    { k: 'Pro tip', t: 'More leads into a leaky follow-up process mostly produce more lost leads. Fix the leak first.' },
    { k: 'Pro tip', t: 'Not sure where you are leaking money? The 2-minute health check on the homepage tells you.', href: '/#health-check' },
  ];

  /* ---------- build the bot ---------- */
  const bot = document.createElement('div');
  bot.className = 'bot';
  bot.innerHTML = `
    <div class="bot-bubble" role="status" aria-live="polite">
      <b class="bot-kind"></b><p class="bot-text"></p><small class="bot-src"></small>
      <span class="bot-actions"><button type="button" class="bot-next">Next fact</button><button type="button" class="bot-hide">Hide bot</button></span>
    </div>
    <button type="button" class="bot-body" aria-label="Biz Bot: show a business fact">
      <svg viewBox="0 0 80 84" aria-hidden="true" focusable="false">
        <line x1="40" y1="10" x2="40" y2="20" stroke="#15140f" stroke-width="3"/>
        <circle class="bot-antenna" cx="40" cy="8" r="6" fill="#d4f57a" stroke="#15140f" stroke-width="2.5"/>
        <rect x="8" y="20" width="64" height="54" rx="20" fill="#c9b8ff" stroke="#15140f" stroke-width="3"/>
        <rect x="2" y="40" width="8" height="16" rx="4" fill="#ff9a76" stroke="#15140f" stroke-width="2.5"/>
        <rect x="70" y="40" width="8" height="16" rx="4" fill="#ff9a76" stroke="#15140f" stroke-width="2.5"/>
        <rect x="16" y="30" width="48" height="32" rx="13" fill="#15140f"/>
        <g class="bot-eye"><circle cx="30" cy="45" r="8" fill="#d4f57a"/><circle class="bot-pupil" cx="30" cy="45" r="3.6" fill="#15140f"/></g>
        <g class="bot-eye"><circle cx="50" cy="45" r="8" fill="#d4f57a"/><circle class="bot-pupil" cx="50" cy="45" r="3.6" fill="#15140f"/></g>
        <path class="bot-mouth" d="M34 56q6 4 12 0" stroke="#d4f57a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>
    </button>`;
  const restore = document.createElement('button');
  restore.type = 'button';
  restore.className = 'bot-restore';
  restore.textContent = 'Show Biz Bot';
  document.body.append(bot, restore);

  const bubble = bot.querySelector('.bot-bubble');
  const body = bot.querySelector('.bot-body');
  const pupils = [...bot.querySelectorAll('.bot-pupil')];
  const eyes = [...bot.querySelectorAll('.bot-eye circle:first-child')];

  /* ---------- hide / show ---------- */
  const setHidden = (hidden) => {
    bot.hidden = hidden;
    restore.hidden = !hidden;
    store.set('pm-bot-hidden', hidden ? '1' : '0');
  };
  bot.querySelector('.bot-hide').addEventListener('click', () => { setHidden(true); restore.focus(); });
  restore.addEventListener('click', () => { setHidden(false); body.focus(); });
  setHidden(store.get('pm-bot-hidden') === '1');

  /* ---------- eyes follow the cursor (or look around on touch) ---------- */
  let target = null;
  const look = () => {
    eyes.forEach((eye, i) => {
      const r = eye.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let dx = 0;
      let dy = 0;
      if (target) {
        const ang = Math.atan2(target.y - cy, target.x - cx);
        const dist = Math.min(Math.hypot(target.x - cx, target.y - cy) / 40, 1);
        dx = Math.cos(ang) * 3.6 * dist;
        dy = Math.sin(ang) * 3.6 * dist;
      }
      pupils[i].setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
    });
  };
  let raf = 0;
  const onPoint = (e) => { target = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(() => { raf = 0; look(); }); };
  window.addEventListener('pointermove', onPoint, { passive: true });
  window.addEventListener('pointerdown', onPoint, { passive: true });

  /* ---------- roam along the edges of the screen ---------- */
  const SIZE = () => (window.innerWidth < 640 ? 56 : 68);
  const rand = (a, b) => a + Math.random() * (b - a);
  let edge = 'left';
  const place = (x, y, newEdge) => {
    edge = newEdge;
    bot.dataset.edge = edge;
    bot.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  };
  const roam = (first = false) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const s = SIZE();
    const m = 12;
    const top = 84; // clear of the sticky header
    const spots = [
      () => place(m, rand(h * 0.22, h * 0.72), 'left'),
      () => place(w - s - m, rand(h * 0.2, h * 0.55), 'right'), // stays above the WhatsApp button
      () => place(rand(w * 0.12, w * 0.7), top, 'top'),
      () => place(rand(w * 0.05, w * 0.55), h - s - m, 'bottom'), // left of the WhatsApp button
    ];
    const options = spots.filter((_, i) => ['left', 'right', 'top', 'bottom'][i] !== edge || first);
    bot.classList.add('moving');
    (first ? spots[3] : options[Math.floor(Math.random() * options.length)])();
    setTimeout(() => bot.classList.remove('moving'), reduce ? 0 : 2600);
    setTimeout(look, reduce ? 0 : 2700);
  };
  roam(true);
  window.addEventListener('resize', () => roam(true));

  /* ---------- facts ---------- */
  let i = Math.floor(Math.random() * FACTS.length);
  let hideTimer = 0;
  const showFact = (fromClick = false) => {
    if (bot.hidden) return;
    const f = FACTS[i % FACTS.length];
    i += 1;
    bot.querySelector('.bot-kind').textContent = f.k;
    const text = bot.querySelector('.bot-text');
    text.textContent = f.t;
    if (f.href) { const a = document.createElement('a'); a.href = f.href; a.textContent = ' Try it →'; text.append(a); }
    bot.querySelector('.bot-src').textContent = f.s ? `Source: ${f.s}` : '';
    bot.classList.add('talking');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (!bot.matches(':hover, :focus-within')) bot.classList.remove('talking'); }, fromClick ? 14000 : 9000);
  };
  body.addEventListener('click', () => (bot.classList.contains('talking') ? bot.classList.remove('talking') : showFact(true)));
  bot.querySelector('.bot-next').addEventListener('click', () => showFact(true));
  bot.addEventListener('mouseleave', () => { clearTimeout(hideTimer); hideTimer = setTimeout(() => bot.classList.remove('talking'), 2500); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') bot.classList.remove('talking'); });

  if (!reduce) {
    // wander every 14–22 s; share a fact every ~30 s while the visitor stays
    const wander = () => { if (!document.hidden && !bot.classList.contains('talking')) roam(); setTimeout(wander, rand(14000, 22000)); };
    setTimeout(wander, 9000);
    setTimeout(() => showFact(), 6000);
    setInterval(() => { if (!document.hidden && !bot.classList.contains('talking')) showFact(); }, 30000);
  }
  if (!finePointer) setInterval(() => { target = { x: rand(0, window.innerWidth), y: rand(0, window.innerHeight) }; look(); }, 3500);
})();
