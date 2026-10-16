(() => {
  const doc = document.documentElement;
  doc.classList.add('js');

  // Sticky header border
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const open = doc.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && doc.classList.contains('nav-open')) { doc.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });

  // Reveal on scroll
  const items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`; io.observe(el); });
  } else items.forEach((el) => el.classList.add('in'));

  // Contact form: POST to endpoint if configured, otherwise open the visitor's email app.
  const form = document.querySelector('.contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((f) => {
        const ok = f.value.trim() && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) valid = false;
      });
      if (!valid) { status.className = 'form-status err'; status.textContent = 'Please fill in your name, a valid email and a short message.'; return; }
      if (form._gotcha.value) return;
      const data = Object.fromEntries(new FormData(form));
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        const body = `${data.message}\n\n— ${data.name}\n${data.email}${data.company ? `\n${data.company}` : ''}`;
        window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Enquiry: ${data.topic}`)}&body=${encodeURIComponent(body)}`;
        status.className = 'form-status ok'; status.textContent = 'Opening your email app…';
        return;
      }
      status.className = 'form-status'; status.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error();
        form.reset();
        status.className = 'form-status ok'; status.textContent = 'Thank you — your message is in. I\'ll reply within one working day.';
      } catch {
        status.className = 'form-status err'; status.textContent = `Something went wrong. Please email ${form.dataset.email} directly.`;
      }
    });
  }
})();
