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
    { k: 'Biz fact', t: 'Reply to a lead in 5 minutes, not 30. You’re far likelier to reach them.', s: 'MIT & InsideSales' },
    { k: 'Biz fact', t: 'A new customer costs 5–25× more than keeping one.', s: 'Harvard Business Review' },
    { k: 'Biz fact', t: '+5% customer retention can mean +25–95% profit.', s: 'Bain & Company' },
    { k: 'Biz fact', t: '53% of mobile visitors leave if a page takes 3s+.', s: 'Google' },
    { k: 'Biz fact', t: 'Under 1% of searchers click Google’s page two.', s: 'Backlinko' },
    { k: 'Biz fact', t: 'Visitors judge your website in about 50 milliseconds.', s: 'Lindgaard et al.' },
    { k: 'Biz fact', t: '3 in 4 people judge your credibility by your website.', s: 'Stanford' },
    { k: 'Pro tip', t: 'Unanswered WhatsApp = customer asking your competitor.' },
    { k: 'Pro tip', t: 'Old prices + rising costs = shrinking margin.' },
    { k: 'Pro tip', t: 'Still copy-pasting data? Automate that first.' },
    { k: 'Pro tip', t: 'Can’t take a week off? You’re the bottleneck.' },
    { k: 'Pro tip', t: 'Fix follow-up before buying more leads.' },
    { k: 'Pro tip', t: 'Find your money leaks in 2 minutes.', href: '/#health-check' },
  ];

  /* ---------- build the bot ---------- */
  const bot = document.createElement('div');
  bot.className = 'bot';
  bot.innerHTML = `
    <div class="bot-bubble" role="status" aria-live="polite">
      <b class="bot-kind"></b><p class="bot-text"></p><small class="bot-src"></small>
      <span class="bot-actions"><button type="button" class="bot-next">Next</button><button type="button" class="bot-hide">Hide bot</button></span>
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
  // Mostly the left and right sides (where it peeks in from the edge), sometimes top or bottom.
  const goTo = (where) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const s = SIZE();
    const m = 10;
    const top = 84; // clear of the sticky header
    if (where === 'left') place(m, rand(h * 0.2, h * 0.75), 'left');
    else if (where === 'right') place(w - s - m, rand(h * 0.18, h * 0.58), 'right'); // above the WhatsApp button
    else if (where === 'top') place(rand(w * 0.15, w * 0.65), top, 'top');
    else place(rand(w * 0.06, w * 0.5), h - s - m, 'bottom'); // left of the WhatsApp button
  };
  const pickEdge = () => { const r = Math.random(); return r < 0.4 ? 'left' : r < 0.8 ? 'right' : r < 0.9 ? 'top' : 'bottom'; };
  const roam = (where = pickEdge()) => {
    bot.classList.add('moving');
    goTo(where);
    setTimeout(() => bot.classList.remove('moving'), reduce ? 0 : 2600);
    setTimeout(look, reduce ? 0 : 2700);
  };
  roam(reduce ? 'left' : Math.random() < 0.5 ? 'left' : 'right');
  let resizeTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => goTo(edge), 200); });

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
    setInterval(() => { if (!document.hidden && !bot.classList.contains('talking')) showFact(); }, 35000);
  }
  if (!finePointer) setInterval(() => { target = { x: rand(0, window.innerWidth), y: rand(0, window.innerHeight) }; look(); }, 3500);
})();
