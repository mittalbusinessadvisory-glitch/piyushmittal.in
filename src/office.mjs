// Virtual office: reception lobby -> kiosk -> printed visitor slip -> Piyush's cabin.
// Markup only; behaviour lives in src/static/assets/office.js, styles in styles.css ("Virtual office").

export const officeOptions = [
  ['Not sure yet — need a diagnosis', 'Tell me what feels stuck'],
  ['Business Consulting & Growth Strategy', 'A clear 90-day plan'],
  ['AI Implementation & Workflow Automation', 'Save hours every week'],
  ['Website Development', 'A site that brings enquiries'],
  ['Digital Marketing & SEO', 'Get found on Google'],
  ['Online Presence & Lead Generation', 'A steady flow of leads'],
  ['Market Research & Competitor Analysis', 'Know your market'],
  ['Business Weakness Analysis & Process Improvement', 'Fix the leaks'],
  ['Professional opportunity / collaboration', 'Partnerships, speaking, roles'],
];

const lobbySvg = (site) => `
<svg class="scene-art" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1ece1"/><stop offset="1" stop-color="#e7e0d1"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3d2d"/><stop offset="1" stop-color="#2f271d"/></linearGradient>
    <radialGradient id="lamp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff6d9" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d9" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#wall)"/>
  <rect y="318" width="1200" height="82" fill="#ddd4c1"/>
  <rect y="316" width="1200" height="3" fill="#cfc5b0"/>
  <rect y="400" width="1200" height="160" fill="url(#floor)"/>
  <g stroke="#5a4a37" stroke-width="2" opacity=".55">
    <path d="M0 440H1200M0 490H1200M0 535H1200"/>
    <path d="M120 400L60 560M320 400L290 560M520 400L515 560M720 400L745 560M920 400L975 560M1110 400L1190 560"/>
  </g>
  <rect y="398" width="1200" height="6" fill="#15140f" opacity=".35"/>

  <!-- pendant lamps -->
  <g><path d="M500 0V40" stroke="#15140f" stroke-width="2"/><path d="M480 40h40l-8 18h-24z" fill="#15140f"/><ellipse cx="500" cy="150" rx="150" ry="120" fill="url(#lamp)"/></g>
  

  <!-- wall sign -->
  <text x="720" y="112" text-anchor="middle" class="svg-serif" font-size="40" fill="#15140f" letter-spacing="4">PIYUSH MITTAL</text>
  <rect x="640" y="126" width="160" height="2" fill="#1e4d3a"/>
  <text x="720" y="152" text-anchor="middle" class="svg-sans" font-size="13" fill="#1e4d3a" letter-spacing="3">BUSINESS GROWTH + AI SOLUTIONS</text>

  <!-- poster -->
  <g transform="translate(118 132)"><rect width="150" height="110" rx="4" fill="#15140f"/><rect x="8" y="8" width="134" height="94" fill="#1e4d3a"/>
    <text x="75" y="48" text-anchor="middle" class="svg-serif" font-size="17" fill="#f5f2ea">Find the leak.</text>
    <text x="75" y="74" text-anchor="middle" class="svg-serif svg-italic" font-size="17" fill="#e8c4a8">Build the fix.</text></g>

  <!-- clock (IST) -->
  <g transform="translate(1060 112)">
    <circle r="42" fill="#fbf9f4" stroke="#15140f" stroke-width="5"/>
    <g stroke="#15140f" stroke-width="3"><path d="M0-34v8M34 0h-8M0 34v-8M-34 0h8"/></g>
    <line class="hand-h" x1="0" y1="4" x2="0" y2="-20" stroke="#15140f" stroke-width="5" stroke-linecap="round"/>
    <line class="hand-m" x1="0" y1="6" x2="0" y2="-30" stroke="#b8532f" stroke-width="3" stroke-linecap="round"/>
    <circle r="4" fill="#15140f"/>
    <text y="68" text-anchor="middle" class="svg-sans" font-size="12" fill="#615d52" letter-spacing="2">IST</text>
  </g>

  <!-- plant -->
  <g transform="translate(70 300)">
    <path d="M30 100h60l-8 60h-44z" fill="#b8532f"/>
    <g fill="#2f6b4f"><ellipse cx="60" cy="58" rx="16" ry="44" transform="rotate(-8 60 58)"/><ellipse cx="38" cy="72" rx="12" ry="36" transform="rotate(-34 38 72)"/><ellipse cx="84" cy="70" rx="12" ry="36" transform="rotate(30 84 70)"/></g>
    <g fill="#1e4d3a"><ellipse cx="50" cy="40" rx="9" ry="30" transform="rotate(-18 50 40)"/><ellipse cx="72" cy="44" rx="9" ry="30" transform="rotate(16 72 44)"/></g>
  </g>

  <!-- cabin door -->
  <g transform="translate(905 168)">
    <rect x="-10" y="-34" width="160" height="26" rx="3" fill="#15140f"/>
    <text x="70" y="-16" text-anchor="middle" class="svg-sans" font-size="12" fill="#f5f2ea" letter-spacing="2">CABIN · PIYUSH</text>
    <rect width="140" height="232" fill="#2b2a24"/>
    <rect x="6" y="6" width="128" height="226" fill="#0e0d0a"/>
    <g class="door"><rect x="6" y="6" width="128" height="226" fill="#1e4d3a"/><rect x="20" y="22" width="100" height="80" rx="3" fill="none" stroke="#2f6b4f" stroke-width="3"/><rect x="20" y="118" width="100" height="96" rx="3" fill="none" stroke="#2f6b4f" stroke-width="3"/><circle cx="118" cy="120" r="6" fill="#e8c4a8"/></g>
  </g>

  <!-- kiosk stand -->
  <g transform="translate(250 300)"><rect x="30" y="20" width="10" height="90" fill="#15140f"/><rect x="10" y="104" width="50" height="8" rx="3" fill="#15140f"/><rect x="0" y="-6" width="70" height="44" rx="6" fill="#15140f"/><rect class="kiosk-glow" x="5" y="-1" width="60" height="34" rx="3" fill="#1e4d3a"/></g>

  <!-- receptionist (walks to the cabin door) -->
  <g class="clerk">
    <g class="clerk-legs"><rect class="leg leg-l" x="548" y="300" width="16" height="92" rx="7" fill="#15140f"/><rect class="leg leg-r" x="572" y="300" width="16" height="92" rx="7" fill="#15140f"/><rect x="542" y="388" width="26" height="10" rx="5" fill="#0b0a07"/><rect x="568" y="388" width="26" height="10" rx="5" fill="#0b0a07"/></g>
    <path d="M532 236c0-14 12-24 36-24s36 10 36 24v74h-72z" fill="#1e4d3a"/>
    <path d="M556 214h24v14c0 6-24 6-24 0z" fill="#b97a57"/>
    <circle cx="568" cy="190" r="28" fill="#c98e6b"/>
    <path d="M540 186c0-24 14-36 30-36 18 0 30 14 28 34-6-12-18-18-30-18-12 0-22 8-28 20z" fill="#2a1d14"/>
    <circle cx="594" cy="156" r="13" fill="#2a1d14"/>
    <circle cx="558" cy="192" r="2.6" fill="#2a1d14"/><circle cx="578" cy="192" r="2.6" fill="#2a1d14"/>
    <path d="M560 204q8 7 16 0" stroke="#7a3f28" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M540 190a28 28 0 0 1 56 0" stroke="#15140f" stroke-width="3" fill="none"/><rect x="535" y="186" width="9" height="14" rx="3" fill="#15140f"/><path d="M540 200q4 14 18 14" stroke="#15140f" stroke-width="2" fill="none"/>
    <rect x="548" y="250" width="40" height="12" rx="3" fill="#f5f2ea"/><text x="568" y="259" text-anchor="middle" class="svg-sans" font-size="8" fill="#15140f">RIYA</text>
    <g class="clerk-slip"><rect x="600" y="262" width="34" height="44" rx="2" fill="#fbf9f4" stroke="#cfc5b0"/><path d="M606 274h22M606 282h22M606 290h14" stroke="#cfc5b0" stroke-width="2"/></g>
  </g>

  <!-- reception desk (in front of the receptionist) -->
  <g>
    <rect x="380" y="292" width="460" height="18" rx="3" fill="#15140f"/>
    <rect x="392" y="310" width="436" height="112" fill="#1e4d3a"/>
    <rect x="392" y="310" width="436" height="8" fill="#163b2c"/>
    <circle cx="610" cy="364" r="26" fill="#f5f2ea"/><text x="610" y="372" text-anchor="middle" class="svg-serif" font-size="20" fill="#15140f">PM</text>
    <text x="470" y="372" text-anchor="middle" class="svg-sans" font-size="13" fill="#d6e3d9" letter-spacing="3">RECEPTION</text>
    <text x="752" y="372" text-anchor="middle" class="svg-sans" font-size="13" fill="#d6e3d9" letter-spacing="3">WELCOME</text>
  </g>

  <!-- printer on the desk -->
  <g transform="translate(700 252)">
    <clipPath id="paperClip"><rect x="0" y="-70" width="80" height="82"/></clipPath>
    <g clip-path="url(#paperClip)"><g class="paper"><rect x="14" y="-8" width="52" height="40" rx="2" fill="#fbf9f4" stroke="#cfc5b0"/><path d="M22 2h36M22 10h36M22 18h22" stroke="#cfc5b0" stroke-width="2"/></g></g>
    <rect x="0" y="10" width="80" height="32" rx="6" fill="#2b2a24"/>
    <rect x="10" y="10" width="60" height="5" rx="2" fill="#0e0d0a"/>
    <circle class="printer-led" cx="68" cy="30" r="3.5" fill="#5fd39a"/>
  </g>
</svg>`;

const cabinSvg = (site) => `
<svg class="scene-art" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="cwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21362b"/><stop offset="1" stop-color="#1a2b22"/></linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c79b"/><stop offset="1" stop-color="#f7e3c4"/></linearGradient>
    <linearGradient id="cfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3d2d"/><stop offset="1" stop-color="#2f271d"/></linearGradient>
    <clipPath id="face"><circle cx="640" cy="196" r="50"/></clipPath>
  </defs>
  <rect width="1200" height="400" fill="url(#cwall)"/>
  <rect y="400" width="1200" height="160" fill="url(#cfloor)"/>
  <g stroke="#5a4a37" stroke-width="2" opacity=".5"><path d="M0 450H1200M0 505H1200"/></g>

  <!-- window with skyline -->
  <g transform="translate(800 60)"><rect width="300" height="220" rx="6" fill="#15140f"/><rect x="10" y="10" width="280" height="200" fill="url(#sky)"/>
    <g fill="#c98e6b" opacity=".55"><rect x="20" y="120" width="40" height="90"/><rect x="66" y="90" width="34" height="120"/><rect x="106" y="140" width="50" height="70"/><rect x="162" y="70" width="38" height="140"/><rect x="206" y="110" width="44" height="100"/><rect x="254" y="130" width="30" height="80"/></g>
    <circle cx="230" cy="58" r="22" fill="#fff3dc"/><rect x="146" y="10" width="8" height="200" fill="#15140f"/></g>

  <!-- bookshelf -->
  <g transform="translate(80 80)"><rect width="190" height="300" fill="#15140f"/>
    <g fill="#2b2a24"><rect x="10" y="10" width="170" height="80"/><rect x="10" y="100" width="170" height="80"/><rect x="10" y="190" width="170" height="100"/></g>
    <g><rect x="18" y="30" width="16" height="60" fill="#b8532f"/><rect x="36" y="22" width="14" height="68" fill="#d6e3d9"/><rect x="52" y="34" width="18" height="56" fill="#f5f2ea"/><rect x="74" y="26" width="12" height="64" fill="#1e4d3a"/>
       <rect x="20" y="120" width="18" height="60" fill="#f5f2ea"/><rect x="40" y="112" width="14" height="68" fill="#b8532f"/><rect x="58" y="126" width="16" height="54" fill="#9cc5ae"/>
       <circle cx="140" cy="150" r="22" fill="#1e4d3a"/><rect x="120" y="240" width="46" height="50" fill="#b8532f"/><ellipse cx="143" cy="232" rx="20" ry="14" fill="#2f6b4f"/></g></g>

  <!-- Piyush at the desk -->
  <g class="boss">
    <path d="M572 268c0-16 20-30 68-30s68 14 68 30v90H572z" fill="#15140f"/>
    <path d="M622 240l18 34 18-34" fill="#d6e3d9"/><path d="M634 246h12l-2 46h-8z" fill="#5a4a37"/>
    <path d="M622 220h36v22c0 8-36 8-36 0z" fill="#b97a57"/>
    <circle cx="640" cy="196" r="52" fill="#1e4d3a"/>
    <image href="${site.headshot}" x="590" y="146" width="100" height="100" clip-path="url(#face)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="640" cy="196" r="51" fill="none" stroke="#f5f2ea" stroke-width="3"/>
  </g>

  <!-- desk -->
  <g>
    <rect x="340" y="330" width="600" height="18" rx="3" fill="#6b4f35"/>
    <rect x="360" y="348" width="560" height="80" fill="#4a3624"/>
    <rect x="560" y="374" width="160" height="34" rx="3" fill="#15140f"/><text x="640" y="396" text-anchor="middle" class="svg-sans" font-size="12" fill="#e8c4a8" letter-spacing="2">PIYUSH MITTAL</text>
    <g transform="translate(720 270)"><rect x="0" y="0" width="120" height="66" rx="4" fill="#2b2a24"/><rect x="6" y="6" width="108" height="54" fill="#1e4d3a"/><path d="M14 46l20-14 16 8 22-20 24 12" stroke="#9cc5ae" stroke-width="3" fill="none"/><rect x="-14" y="60" width="148" height="8" rx="3" fill="#15140f"/></g>
    <g transform="translate(420 296)"><rect width="34" height="34" rx="4" fill="#f5f2ea"/><path d="M34 8h8a8 8 0 0 1 0 16h-8" stroke="#f5f2ea" stroke-width="4" fill="none"/></g>
  </g>
</svg>`;

export const officeBody = ({ site, esc, waHref, ARROW, crumbs }) => `
<section class="page-hero office-hero">
  <div class="wrap">
    ${crumbs([['Office', '/office/']])}
    <p class="eyebrow" data-reveal>Virtual office</p>
    <h1 data-reveal>Walk in. <em>Tell us what you need.</em></h1>
    <p class="lede" data-reveal>Step into my virtual office: the front desk takes your request, prints your visitor slip and brings it straight to my cabin. It's a real enquiry; I read every one.</p>
  </div>
</section>
<section class="section pt0">
  <div class="wrap">
    <div class="office" data-office data-scene="lobby" data-email="${esc(site.email)}" data-wa="${esc(waHref)}">
      <div class="office-stage">
        <div class="scene scene-lobby">${lobbySvg(site)}</div>
        <div class="scene scene-cabin" aria-hidden="true">${cabinSvg(site)}</div>
        <div class="bubble bubble-clerk" aria-hidden="true"><b>Riya · Front desk</b><span class="bubble-text">Namaste! Haanji, how can we help you today?</span></div>
        <div class="bubble bubble-boss" aria-hidden="true"><b>Piyush</b><span class="bubble-text"></span></div>
        <article class="slip" aria-hidden="true">
          <header><span>VISITOR SLIP</span><span class="slip-token"></span></header>
          <dl><dt>Name</dt><dd class="slip-name"></dd><dt>Need</dt><dd class="slip-need"></dd><dt>Contact</dt><dd class="slip-contact"></dd><dt>Note</dt><dd class="slip-note"></dd></dl>
          <footer><span class="slip-time"></span><span class="stamp">RECEIVED</span></footer>
        </article>
        <p class="office-status sr" aria-live="polite"></p>
      </div>

      <div class="kiosk" role="region" aria-label="Reception kiosk">
        <div class="kiosk-bar"><span class="kiosk-dot"></span><span>Reception kiosk</span><span class="kiosk-step">Step 1 of 2</span></div>

        <div class="kiosk-pane pane-choose">
          <h2 class="kiosk-title" tabindex="-1">How can we help you?</h2>
          <div class="kiosk-options">
            ${officeOptions.map(([t, d]) => `<button type="button" class="opt" data-topic="${esc(t)}"><b>${esc(t.replace(' — need a diagnosis', '').replace('Business Weakness Analysis & ', ''))}</b><span>${esc(d)}</span></button>`).join('')}
          </div>
        </div>

        <form class="kiosk-pane pane-form" novalidate hidden>
          <h2 class="kiosk-title" tabindex="-1">A few details for Piyush</h2>
          <p class="kiosk-chosen"></p>
          <div class="field"><label for="o-name">Your name</label><input id="o-name" name="name" autocomplete="name" required data-label="your name" aria-describedby="o-name-err"><span class="field-err" id="o-name-err"></span></div>
          <div class="kiosk-row">
            <div class="field"><label for="o-email">Email</label><input id="o-email" name="email" type="email" autocomplete="email" required data-label="your email" aria-describedby="o-email-err"><span class="field-err" id="o-email-err"></span></div>
            <div class="field"><label for="o-phone">Phone / WhatsApp <span>(optional)</span></label><input id="o-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+91"></div>
          </div>
          <div class="field"><label for="o-company">Business / website <span>(optional)</span></label><input id="o-company" name="company" autocomplete="organization"></div>
          <div class="field"><label for="o-msg">What's going on in your business?</label><textarea id="o-msg" name="message" rows="3" required data-label="a short note" aria-describedby="o-msg-err"></textarea><span class="field-err" id="o-msg-err"></span></div>
          <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="kiosk-actions"><button type="button" class="btn btn-ghost kiosk-back">Back</button><button type="submit" class="btn">Submit &amp; print slip ${ARROW}</button></div>
          <p class="consent">By sending, you agree to the <a href="/privacy/">privacy policy</a>.</p>
        </form>

        <div class="kiosk-pane pane-wait" hidden>
          <h2 class="kiosk-title" tabindex="-1">Your slip is on its way</h2>
          <ol class="journey"><li data-j="print">Printing your visitor slip</li><li data-j="walk">Riya is taking it to the cabin</li><li data-j="review">Piyush is reviewing your request</li></ol>
        </div>

        <div class="kiosk-pane pane-done" hidden>
          <h2 class="kiosk-title" tabindex="-1">Request received</h2>
          <p class="done-text"></p>
          <div class="kiosk-actions"><a class="btn" href="${esc(waHref)}" target="_blank" rel="noopener">Chat on WhatsApp now ${ARROW}</a><button type="button" class="btn btn-ghost office-print">Print my slip</button><button type="button" class="btn btn-ghost office-again">Start again</button></div>
        </div>
      </div>
      <noscript><p class="office-noscript">The virtual office needs JavaScript. You can <a href="/contact/">send a message on the contact page</a> instead.</p></noscript>
    </div>
  </div>
</section>`;
