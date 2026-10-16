// Virtual office: reception -> kiosk -> visitor slip -> walk to cabin -> review.
// The enquiry is sent for real through the Netlify "contact" form; if that fails, the visitor's email app opens.
(() => {
  const office = document.querySelector('[data-office]');
  if (!office) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => office.querySelector(s);
  const $$ = (s) => [...office.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 150) : ms));
  const status = $('.office-status');
  const say = (msg) => { status.textContent = ''; setTimeout(() => { status.textContent = msg; }, 40); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- live IST clock on the lobby wall ---------- */
  const setClock = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === 'hour').value) % 12;
    const m = Number(parts.find((p) => p.type === 'minute').value);
    $('.hand-h')?.setAttribute('transform', `rotate(${h * 30 + m * 0.5})`);
    $('.hand-m')?.setAttribute('transform', `rotate(${m * 6})`);
  };
  setClock();
  setInterval(setClock, 30000);

  /* ---------- speech bubbles with a short typing effect ---------- */
  let typing = 0;
  const speak = async (who, text) => {
    const bubble = $(`.bubble-${who}`);
    const out = bubble.querySelector('.bubble-text');
    const run = ++typing;
    bubble.classList.add('show');
    say(`${who === 'clerk' ? 'Riya' : 'Piyush'}: ${text}`);
    if (reduce) { out.textContent = text; return; }
    out.innerHTML = '<span class="caret"></span>';
    for (let i = 1; i <= text.length; i++) {
      if (run !== typing) return;
      out.innerHTML = `${esc(text.slice(0, i))}<span class="caret"></span>`;
      await new Promise((r) => setTimeout(r, 18));
    }
    out.textContent = text;
  };
  const hush = (who) => $(`.bubble-${who}`).classList.remove('show');

  /* ---------- kiosk panes ---------- */
  const panes = { choose: $('.pane-choose'), form: $('.pane-form'), wait: $('.pane-wait'), done: $('.pane-done') };
  const show = (name, step) => {
    Object.entries(panes).forEach(([k, el]) => { el.hidden = k !== name; });
    $('.kiosk-step').textContent = step;
    const title = panes[name].querySelector('.kiosk-title');
    title?.focus({ preventScroll: true });
  };

  let topic = '';
  const firstName = () => ($('#o-name').value.trim().split(/\s+/)[0] || 'there');

  const open = async () => {
    office.classList.add('kiosk-open');
    show('choose', 'Step 1 of 2');
    await wait(300);
    speak('clerk', 'Namaste! Haanji, how can we help you today? Please choose on the screen.');
  };

  $$('.opt').forEach((btn) => btn.addEventListener('click', () => {
    topic = btn.dataset.topic;
    $('.kiosk-chosen').textContent = `You chose: ${topic}`;
    show('form', 'Step 2 of 2');
    speak('clerk', 'Wonderful. May I have a few details for Piyush?');
    setTimeout(() => $('#o-name').focus(), reduce ? 0 : 350);
  }));
  $('.kiosk-back').addEventListener('click', () => { show('choose', 'Step 1 of 2'); speak('clerk', 'No problem. What would you like help with?'); });

  /* ---------- submission ---------- */
  const form = panes.form;
  const validate = () => {
    let firstBad = null;
    form.querySelectorAll('[required]').forEach((f) => {
      const empty = !f.value.trim();
      const badEmail = f.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      const msg = empty ? `Please enter ${f.dataset.label}.` : badEmail ? 'Please enter a valid email, like name@business.com.' : '';
      f.setAttribute('aria-invalid', msg ? 'true' : 'false');
      office.querySelector(`#${f.id}-err`).textContent = msg;
      if (msg && !firstBad) firstBad = f;
    });
    if (firstBad) { firstBad.focus(); speak('clerk', 'Just one more detail, please. I have marked it on the screen.'); }
    return !firstBad;
  };

  const send = async (data) => {
    const body = new URLSearchParams({
      'form-name': 'contact', name: data.name, email: data.email, phone: data.phone, company: data.company,
      topic: data.topic, message: `[Virtual office · token ${data.token}] ${data.message}`, _gotcha: '',
    });
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      return res.ok;
    } catch { return false; }
  };

  let lastData = null;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form._gotcha.value || !validate()) return;
    const token = `PM-${String(Math.floor(100 + Math.random() * 900))}`;
    const data = {
      token, topic,
      name: $('#o-name').value.trim(), email: $('#o-email').value.trim(), phone: $('#o-phone').value.trim(),
      company: $('#o-company').value.trim(), message: $('#o-msg').value.trim(),
    };
    lastData = data;
    const sending = send(data); // runs while the animation plays

    // fill the slip
    const now = new Date();
    $('.slip-token').textContent = `TOKEN ${token}`;
    $('.slip-name').textContent = data.name + (data.company ? ` · ${data.company}` : '');
    $('.slip-need').textContent = topic;
    $('.slip-contact').textContent = data.phone ? `${data.email} · ${data.phone}` : data.email;
    $('.slip-note').textContent = data.message;
    $('.slip-time').textContent = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    show('wait', 'Please wait');
    // on small screens the kiosk sits below the scene: bring the scene back into view for the show
    if (window.innerWidth <= 900) $('.office-stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const step = (name, state) => $(`.journey [data-j="${name}"]`).className = state;
    $$('.journey li').forEach((li) => { li.className = ''; });

    // 1. print
    step('print', 'active');
    await speak('clerk', `Thank you, ${firstName()}! Printing your visitor slip, token ${token}.`);
    office.classList.add('printing');
    await wait(1900);
    office.classList.remove('printing');
    step('print', 'done');

    // 2. walk to the cabin
    step('walk', 'active');
    office.classList.add('carrying');
    await speak('clerk', 'I will take this to Piyush’s cabin right away.');
    await wait(500);
    hush('clerk');
    office.classList.add('door-open', 'walking');
    await wait(2500);
    office.classList.add('gone');
    await wait(400);
    office.classList.remove('walking');
    step('walk', 'done');

    // 3. cabin review
    step('review', 'active');
    office.dataset.scene = 'cabin';
    $('.scene-cabin').removeAttribute('aria-hidden');
    await wait(700);
    office.classList.add('slip-in');
    await wait(800);
    await speak('boss', `Thanks, ${firstName()}. Let me read your note…`);
    const ok = await sending;
    await wait(1600);
    office.classList.add('stamped');
    await wait(500);
    step('review', 'done');

    const contact = data.phone ? `${esc(data.email)} or WhatsApp (${esc(data.phone)})` : esc(data.email);
    if (ok) {
      speak('boss', 'Got it. I will get back to you within one working day.');
      $('.done-text').innerHTML = `Your request (token <b>${token}</b>) is on Piyush’s desk. You will hear back on ${contact} within one working day. Need a faster answer? Message on WhatsApp.`;
    } else {
      speak('boss', 'Our mail room is closed right now, so your email app will open with your note.');
      $('.done-text').innerHTML = `The office mail room couldn’t send your note automatically, so your email app is opening with it ready to go. You can also message Piyush on WhatsApp.`;
      const mail = `${data.message}\n\n— ${data.name}\n${data.email}${data.phone ? `\n${data.phone}` : ''}${data.company ? `\n${data.company}` : ''}\nToken ${token}`;
      setTimeout(() => { window.location.href = `mailto:${office.dataset.email}?subject=${encodeURIComponent(`Virtual office: ${topic}`)}&body=${encodeURIComponent(mail)}`; }, 1200);
    }
    show('done', 'Done');
  });

  /* ---------- after the visit ---------- */
  $('.office-print').addEventListener('click', () => {
    document.body.classList.add('print-slip');
    window.print();
    setTimeout(() => document.body.classList.remove('print-slip'), 500);
  });
  $('.office-again').addEventListener('click', () => {
    office.classList.remove('carrying', 'door-open', 'gone', 'slip-in', 'stamped');
    office.dataset.scene = 'lobby';
    $('.scene-cabin').setAttribute('aria-hidden', 'true');
    hush('boss');
    form.reset();
    lastData = null;
    show('choose', 'Step 1 of 2');
    speak('clerk', 'Welcome back! How else can we help you?');
  });

  /* ---------- open the kiosk when the office comes into view ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(open, reduce ? 0 : 600); } }, { threshold: 0.35 });
    io.observe(office);
  } else open();
})();
