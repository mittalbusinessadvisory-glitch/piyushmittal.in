(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Header, progress bar, back-to-top ---------- */
  const header = $('.site-header');
  const bar = $('.progress span');
  const toTop = $('.to-top');
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    // hide header when scrolling down, show when scrolling up
    if (!doc.classList.contains('nav-open')) header.classList.toggle('hidden', y > 320 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('hidden');
    lastY = y;
    const max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    toTop?.classList.toggle('show', y > 900);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const toggle = $('.nav-toggle');
  const closeNav = () => { doc.classList.remove('nav-open'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    const open = doc.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.site-nav a').forEach((a) => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && doc.classList.contains('nav-open')) { closeNav(); toggle.focus(); }
  });

  /* ---------- Reveal on scroll + count-up ---------- */
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    if (reduce || !end) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  const items = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`; io.observe(el); });
  } else items.forEach((el) => el.classList.add('in'));

  /* ---------- Hero word rotator ---------- */
  const rot = $('.rot-words');
  if (rot && !reduce) {
    const words = $$('span', rot);
    let i = 0;
    setInterval(() => {
      words[i].classList.remove('is-on');
      words[i].classList.add('is-off');
      const prev = words[i];
      setTimeout(() => prev.classList.remove('is-off'), 600);
      i = (i + 1) % words.length;
      words[i].classList.add('is-on');
    }, 2600);
  }

  /* ---------- Pointer effects (desktop only) ---------- */
  if (finePointer && !reduce) {
    // spotlight that follows the cursor on the dark service list
    $$('.svc-list a, .plan, .post-card a').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    // gentle 3D tilt on the hero diagnostic card
    const diag = $('.diag');
    diag?.addEventListener('pointermove', (e) => {
      const r = diag.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      diag.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    diag?.addEventListener('pointerleave', () => { diag.style.transform = ''; });
  }

  /* ---------- Business health check ---------- */
  const hc = $('[data-hc]');
  if (hc) {
    const { q: questions, s: svcMap } = JSON.parse(hc.dataset.hc);
    const answers = new Array(questions.length).fill(null);
    let idx = 0;
    const verdicts = [
      [85, 'Strong foundations', 'Your business is in good shape. The gains now come from sharpening what already works and scaling it.'],
      [60, 'Solid, with clear leaks', 'The basics are there, but a few gaps are quietly costing you customers and time. Fixing them is usually quick.'],
      [35, 'Growth is being held back', 'Several important areas need attention. The good news: small, focused fixes here tend to pay off fast.'],
      [0, 'Time for a reset', 'Growth is likely feeling hard work right now. A clear diagnosis and a simple 90-day plan will make a big difference.'],
    ];

    const renderQ = () => {
      const pct = Math.round((idx / questions.length) * 100);
      hc.innerHTML = `
        <div class="hc-top"><span>Question ${idx + 1} of ${questions.length}</span><span class="hc-meter"><i style="width:${pct}%"></i></span></div>
        <p class="hc-q">${questions[idx].q}</p>
        <div class="hc-actions">
          <button type="button" class="hc-btn" data-a="1">Yes, that's us</button>
          <button type="button" class="hc-btn" data-a="0">Not really</button>
        </div>
        ${idx > 0 ? '<button type="button" class="hc-back">← Previous question</button>' : ''}`;
      hc.classList.remove('hc-anim'); void hc.offsetWidth; hc.classList.add('hc-anim');
      $$('.hc-btn', hc).forEach((btn) => btn.addEventListener('click', () => {
        answers[idx] = btn.dataset.a === '1';
        idx += 1;
        idx < questions.length ? renderQ() : renderResult();
      }));
      $('.hc-back', hc)?.addEventListener('click', () => { idx -= 1; renderQ(); });
    };

    const renderResult = () => {
      const score = Math.round((answers.filter(Boolean).length / questions.length) * 100);
      const [, title, text] = verdicts.find(([min]) => score >= min);
      const counts = {};
      questions.forEach((qq, i) => { if (!answers[i]) counts[qq.service] = (counts[qq.service] || 0) + 1; });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([slug]) => svcMap[slug]);
      const C = 2 * Math.PI * 52;
      hc.innerHTML = `
        <div class="hc-result">
          <div class="hc-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="track"/><circle cx="60" cy="60" r="52" class="val" style="stroke-dasharray:${C};stroke-dashoffset:${C}"/></svg>
            <b><span data-score>0</span><small>/100</small></b>
          </div>
          <div>
            <p class="eyebrow">Your growth score</p>
            <h3>${title}</h3>
            <p>${text}</p>
            ${top.length ? `<p class="hc-fix">Fix these first:</p><ul class="hc-list">${top.map((t) => `<li><a href="${t.u}">${t.t} →</a></li>`).join('')}</ul>` : '<p class="hc-fix">No obvious leaks — let\'s talk about scaling what works.</p>'}
            <div class="hc-actions">
              <a class="btn" href="/contact/?topic=${encodeURIComponent(top[0]?.t || 'Not sure yet — need a diagnosis')}&score=${score}">Get a free diagnosis</a>
              <button type="button" class="hc-btn ghost hc-restart">Start again</button>
            </div>
          </div>
        </div>`;
      const val = $('.val', hc);
      const num = $('[data-score]', hc);
      requestAnimationFrame(() => requestAnimationFrame(() => { val.style.strokeDashoffset = C * (1 - score / 100); }));
      if (reduce) num.textContent = score;
      else {
        const t0 = performance.now();
        const step = (t) => { const p = Math.min((t - t0) / 1200, 1); num.textContent = Math.round(score * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
      $('.hc-restart', hc).addEventListener('click', () => { idx = 0; answers.fill(null); renderQ(); });
    };

    hc.innerHTML = `
      <div class="hc-start">
        <p class="hc-q">8 questions · about 2 minutes · answers stay in your browser</p>
        <button type="button" class="btn hc-go">Start the health check</button>
      </div>`;
    $('.hc-go', hc).addEventListener('click', renderQ);
  }

  /* ---------- AI savings calculator ---------- */
  const calc = $('[data-calc]');
  if (calc) {
    const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
    const update = () => {
      const v = Object.fromEntries($$('input[type=range]', calc).map((i) => [i.name, Number(i.value)]));
      $$('output', calc).forEach((o) => { const n = v[o.dataset.for]; o.textContent = o.dataset.for === 'rate' ? n.toLocaleString('en-IN') : n; });
      $$('input[type=range]', calc).forEach((i) => i.style.setProperty('--fill', `${((i.value - i.min) / (i.max - i.min)) * 100}%`));
      const hours = v.people * v.hours * (v.share / 100) * 48; // 48 working weeks
      $('[data-out=hours]', calc).textContent = Math.round(hours).toLocaleString('en-IN');
      $('[data-out=days]', calc).textContent = Math.round(hours / 8).toLocaleString('en-IN');
      $('[data-out=money]', calc).textContent = inr(hours * v.rate);
    };
    calc.addEventListener('input', update);
    update();
  }

  /* ---------- Copy link ---------- */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Link copied ✓'; }
    catch { btn.textContent = btn.dataset.copy; }
    setTimeout(() => { btn.textContent = 'Copy link'; }, 2200);
  }));

  /* ---------- Contact form ---------- */
  const form = $('.contact-form');
  if (form) {
    const status = $('.form-status', form);
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    if (topic) {
      const sel = form.topic;
      const match = [...sel.options].find((o) => o.text.toLowerCase().startsWith(topic.toLowerCase()));
      if (match) sel.value = match.text;
      else if (['Diagnose', 'Build', 'Grow'].includes(topic)) { sel.add(new Option(`${topic} engagement`)); sel.value = `${topic} engagement`; }
    }
    const score = params.get('score');
    if (score && !form.message.value) form.message.value = `My health check score was ${score}/100. `;

    const mailFallback = (data) => {
      const body = `${data.message}\n\n— ${data.name}\n${data.email}${data.company ? `\n${data.company}` : ''}`;
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Enquiry: ${data.topic}`)}&body=${encodeURIComponent(body)}`;
      status.className = 'form-status ok'; status.textContent = 'Opening your email app…';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      $$('[required]', form).forEach((f) => {
        const ok = f.value.trim() && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) valid = false;
      });
      if (!valid) { status.className = 'form-status err'; status.textContent = 'Please fill in your name, a valid email and a short message.'; return; }
      if (form._gotcha.value) return;
      const fd = new FormData(form);
      const data = Object.fromEntries(fd);
      const btn = $('button[type=submit]', form);
      btn.disabled = true;
      status.className = 'form-status'; status.textContent = 'Sending…';
      try {
        const endpoint = form.dataset.endpoint;
        const res = endpoint
          ? await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          : await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() });
        if (!res.ok) throw new Error(String(res.status));
        window.location.href = '/contact/thanks/';
      } catch {
        btn.disabled = false;
        mailFallback(data);
      }
    });
  }
})();
