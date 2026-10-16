// All page copy lives here so it can be edited without touching templates.

// Images in src/static/assets/img (each has a .jpg and a .webp). Photos from Unsplash (free licence).
const img = {
  growth: { src: '/assets/img/growth-strategy.jpg', w: 1200, h: 675, alt: 'Laptop showing business growth charts on a sunlit desk' },
  ai: { src: '/assets/img/ai-automation.jpg', w: 1200, h: 800, alt: 'Friendly humanoid AI assistant robot' },
  web: { src: '/assets/img/website-development.jpg', w: 1200, h: 799, alt: 'Laptop with website code on a clean desk' },
  seo: { src: '/assets/img/digital-marketing-seo.jpg', w: 1200, h: 855, alt: 'Marketing analytics dashboard on a laptop' },
  research: { src: '/assets/img/market-research.jpg', w: 1200, h: 675, alt: 'Team organising research insights with sticky notes' },
  process: { src: '/assets/img/process-improvement.jpg', w: 1200, h: 800, alt: 'Person mapping a business process on a whiteboard' },
  leads: { src: '/assets/img/lead-generation.jpg', w: 1200, h: 801, alt: 'Business handshake closing a new deal' },
  aiHand: { src: '/assets/img/ai-human-hand.jpg', w: 1200, h: 727, alt: 'A person touching the hand of a white robot' },
  smallBiz: { src: '/assets/img/small-business.jpg', w: 1200, h: 800, alt: 'Customer being served at a small business counter' },
  webLeads: { src: '/assets/img/website-leads.jpg', w: 1200, h: 800, alt: 'Person browsing a business website on laptop and phone' },
};

export const services = [
  {
    slug: 'business-consulting-growth-strategy',
    image: img.growth,
    title: 'Business Consulting & Growth Strategy',
    short: 'Growth Strategy',
    summary: 'A clear, prioritised plan for where your next stage of growth comes from — and what to stop doing.',
    metaDescription:
      'Business consulting and growth strategy for small businesses by Piyush Mittal. Find your real growth levers, prioritise, and execute with a 90-day plan.',
    intro:
      'Most small businesses don\'t lack ideas. They lack a ranked list. I work with owners to separate what feels urgent from what actually moves revenue, then turn it into a plan the team can run every week.',
    forWho: ['Owner-led businesses stuck at the same revenue for 12+ months', 'Founders planning a new product, location or market', 'Teams busy all day but unsure what is working'],
    problems: [
      'Revenue has plateaued and nobody can say exactly why',
      'Too many initiatives running at once, none finished',
      'Decisions are made on gut feel because the numbers are scattered',
      'Growth depends entirely on the owner being in every conversation',
    ],
    deliverables: [
      'Business snapshot: unit economics, channel mix, customer concentration',
      'Opportunity map ranking 10–15 growth levers by impact and effort',
      '90-day growth plan with owners, milestones and weekly metrics',
      'Simple KPI dashboard so progress is visible without spreadsheets',
      'Monthly review sessions to adjust as results come in',
    ],
    process: [
      ['Listen', 'Founder interview, data pull, and conversations with 3–5 customers.'],
      ['Diagnose', 'Where money is made, lost and left on the table.'],
      ['Prioritise', 'Pick the three bets worth making this quarter.'],
      ['Execute', 'Weekly cadence, clear owners, and adjustments as we learn.'],
    ],
    faqs: [
      ['Do you only give advice, or do you also implement?', 'Both. Strategy is only useful if it ships, so I can build the website, automation or campaigns the plan calls for — or work alongside your team or vendors.'],
      ['How long is a typical engagement?', 'A strategy sprint takes 2–3 weeks. Many clients continue with a monthly growth retainer for execution and reviews.'],
      ['My business is very small. Is this still for me?', 'Yes. The smaller the business, the more one good decision matters. The plan is scaled to your budget and team.'],
    ],
    related: ['business-weakness-analysis-process-improvement', 'market-research-competitor-analysis'],
  },
  {
    slug: 'ai-implementation-workflow-automation',
    image: img.ai,
    title: 'AI Implementation & Workflow Automation',
    short: 'AI & Automation',
    summary: 'Practical AI that removes repetitive work — lead follow-up, reporting, support, data entry — without a big IT project.',
    metaDescription:
      'AI implementation and workflow automation for small businesses. Piyush Mittal builds practical AI assistants and automations that save hours every week.',
    intro:
      'AI is useful when it is pointed at a specific, boring, expensive problem. I start with your workflows, find the tasks that eat hours or lose customers, and automate them with tools that fit your team — not a science project.',
    forWho: ['Teams spending hours a week on copy-paste work', 'Businesses missing leads because follow-up is slow', 'Owners curious about AI but unsure where it actually pays off'],
    problems: [
      'Enquiries wait hours or days for a reply',
      'Staff re-type the same data into three different tools',
      'Reports take a full day to compile every month',
      'Customer questions repeat, but answers live in one person\'s head',
    ],
    deliverables: [
      'Workflow audit with an hours-saved estimate for each automation',
      'AI assistants for enquiries, quotes, FAQs or internal knowledge',
      'Automations connecting forms, CRM, WhatsApp, email and sheets',
      'Guardrails: human review points, logging and clear fallbacks',
      'Team training and simple documentation so it keeps working',
    ],
    process: [
      ['Map', 'Shadow the real workflow and time each step.'],
      ['Pick', 'Choose the automation with the best payback first.'],
      ['Build', 'Ship a working version in days, then refine with your team.'],
      ['Hand over', 'Training, docs and monitoring so it doesn\'t silently break.'],
    ],
    faqs: [
      ['Is my business data safe?', 'I design with the minimum data access needed, prefer tools with clear data-handling terms, and keep a human in the loop wherever an error would be costly.'],
      ['Do I need a technical team?', 'No. Automations are built on tools your team can understand, with documentation and training included.'],
      ['What does it cost to run?', 'Most small-business automations run on low monthly tool costs. You get an estimate of running cost and hours saved before anything is built.'],
    ],
    related: ['business-weakness-analysis-process-improvement', 'online-presence-lead-generation'],
  },
  {
    slug: 'website-development',
    image: img.web,
    title: 'Website Development',
    short: 'Websites',
    summary: 'Fast, credible websites built to turn visitors into enquiries — not just to look good.',
    metaDescription:
      'Website development for small businesses by Piyush Mittal. Fast, SEO-ready, conversion-focused websites that build trust and generate enquiries.',
    intro:
      'Your website is often the first serious conversation a customer has with your business. I build sites that load fast, explain clearly what you do and for whom, and make the next step obvious.',
    forWho: ['Businesses with an outdated or slow site', 'New ventures that need credibility quickly', 'Companies whose site gets traffic but few enquiries'],
    problems: [
      'Visitors leave before understanding what you offer',
      'The site is slow on mobile and invisible on Google',
      'Every small change needs a developer',
      'There is no way to tell which pages bring in business',
    ],
    deliverables: [
      'Messaging and page structure based on how your customers buy',
      'Custom, responsive design — no recycled templates',
      'Technical SEO: metadata, schema, sitemap, Core Web Vitals',
      'Lead capture: forms, WhatsApp, call tracking and analytics',
      'Easy content editing and post-launch support',
    ],
    process: [
      ['Clarify', 'Who you serve, what they need to believe, and what action matters.'],
      ['Structure', 'Sitemap, wireframes and copy before visuals.'],
      ['Design & build', 'Fast, accessible pages that reflect your brand.'],
      ['Launch & measure', 'Analytics, Search Console and a 30-day tune-up.'],
    ],
    faqs: [
      ['How long does a website take?', 'A focused business website typically takes 3–6 weeks depending on pages, content readiness and integrations.'],
      ['Will I be able to update it myself?', 'Yes. You get an editing setup suited to how often you publish, plus a short walkthrough.'],
      ['Do you write the content?', 'I shape the messaging and structure, and can write or polish the copy so it speaks to buyers rather than just listing features.'],
    ],
    related: ['digital-marketing-seo', 'online-presence-lead-generation'],
  },
  {
    slug: 'digital-marketing-seo',
    image: img.seo,
    title: 'Digital Marketing & SEO',
    short: 'Marketing & SEO',
    summary: 'Get found by people already searching for what you sell — and turn that attention into customers.',
    metaDescription:
      'Digital marketing and SEO services by Piyush Mittal. Local SEO, content and paid campaigns that bring qualified leads to small businesses.',
    intro:
      'Good marketing for a small business is rarely about being everywhere. It\'s about being visible at the exact moment someone needs you, with a message that makes choosing you easy.',
    forWho: ['Local and service businesses that depend on search', 'Brands spending on ads without clear returns', 'Businesses with great work but low visibility'],
    problems: [
      'Competitors appear on Google; you don\'t',
      'Ad spend is going out, but nobody knows what it brings back',
      'Social media is posted to, but doesn\'t produce enquiries',
      'No consistent content or marketing rhythm',
    ],
    deliverables: [
      'SEO audit and keyword map tied to buying intent',
      'On-page fixes, Google Business Profile and local citations',
      'Content plan: service pages, guides and case studies',
      'Paid search/social campaigns with conversion tracking',
      'Monthly report focused on leads and revenue, not vanity metrics',
    ],
    process: [
      ['Audit', 'Where you stand vs. competitors in search and ads.'],
      ['Fix the base', 'Technical SEO, tracking and Google Business Profile.'],
      ['Create', 'Pages and content that answer buyer questions.'],
      ['Compound', 'Test, measure and double down on what converts.'],
    ],
    faqs: [
      ['How quickly will SEO show results?', 'Technical and local fixes can show movement in weeks; competitive rankings usually take 3–6 months of consistent work.'],
      ['Do you run Google and Meta ads?', 'Yes, when the numbers make sense. Tracking is set up first so every rupee spent can be judged on results.'],
      ['Can you guarantee first position on Google?', 'No honest marketer can. What I guarantee is a clear plan, transparent reporting and work focused on the searches that bring customers.'],
    ],
    related: ['website-development', 'online-presence-lead-generation'],
  },
  {
    slug: 'market-research-competitor-analysis',
    image: img.research,
    title: 'Market Research & Competitor Analysis',
    short: 'Market Research',
    summary: 'Know your market, your customers and your competitors well enough to make confident decisions.',
    metaDescription:
      'Market research and competitor analysis for small businesses by Piyush Mittal. Customer insight, pricing benchmarks and positioning you can act on.',
    intro:
      'Before you launch, price, or expand, it pays to know what the market already looks like. I combine desk research, customer conversations and AI-assisted analysis to give you a picture you can act on.',
    forWho: ['Businesses entering a new market or city', 'Founders validating a product idea', 'Owners losing deals to competitors and unsure why'],
    problems: [
      'Pricing is guessed rather than benchmarked',
      'You don\'t know why customers choose competitors',
      'A new idea feels promising but is untested',
      'Positioning sounds the same as everyone else\'s',
    ],
    deliverables: [
      'Market sizing and demand signals for your category',
      'Competitor teardown: offers, pricing, messaging, reviews, channels',
      'Customer interview synthesis — needs, objections, buying triggers',
      'Positioning options with a recommended direction',
      'A short decision memo: go, adjust, or don\'t',
    ],
    process: [
      ['Frame', 'Define the decision the research must support.'],
      ['Gather', 'Desk research, review mining, interviews and search data.'],
      ['Analyse', 'Patterns, gaps and white space.'],
      ['Recommend', 'Clear options with trade-offs, not a 100-page deck.'],
    ],
    faqs: [
      ['How long does research take?', 'Most projects take 2–4 weeks depending on scope and how many customer interviews are needed.'],
      ['How is AI used in research?', 'To process large volumes of reviews, listings and search data quickly. Interpretation and recommendations are always human-led.'],
      ['Can you research international markets?', 'Yes — desk research and digital signals work across markets; interviews depend on access to the target audience.'],
    ],
    related: ['business-consulting-growth-strategy', 'digital-marketing-seo'],
  },
  {
    slug: 'business-weakness-analysis-process-improvement',
    image: img.process,
    title: 'Business Weakness Analysis & Process Improvement',
    short: 'Process Improvement',
    summary: 'Find the leaks that quietly cost you money and time — then fix the process, not just the symptom.',
    metaDescription:
      'Business weakness analysis and process improvement by Piyush Mittal. Find bottlenecks, reduce wasted time and build systems that run without the owner.',
    intro:
      'Every business has leaks — slow handovers, lost leads, rework, unclear ownership. They rarely show up in the accounts until they are expensive. I find them, size them, and redesign the process so they stay fixed.',
    forWho: ['Owners who are the bottleneck for every decision', 'Growing teams where things fall through the cracks', 'Businesses with healthy sales but thin margins'],
    problems: [
      'The same mistakes and delays keep repeating',
      'Nobody is sure who owns what',
      'Margins shrink as revenue grows',
      'The business can\'t run for a week without the owner',
    ],
    deliverables: [
      'Business health check across sales, operations, finance and team',
      'Process maps of key workflows with bottlenecks highlighted',
      'Leak register: what each problem costs per month',
      'Redesigned processes, SOPs and clear ownership',
      'Automation opportunities ranked by payback',
    ],
    process: [
      ['Observe', 'Walk through how work really flows — not how it\'s meant to.'],
      ['Size', 'Put a monthly cost on each problem found.'],
      ['Redesign', 'Simplify, assign owners, and document.'],
      ['Embed', 'Train, automate where useful, and review in 30 days.'],
    ],
    faqs: [
      ['Will this disrupt my team?', 'The analysis is light-touch: short interviews and observation. Changes are introduced one process at a time.'],
      ['What happens after the analysis?', 'You get a prioritised fix list. I can implement it with you, or hand it to your team with clear SOPs.'],
      ['Is this only for larger companies?', 'No. Small teams often benefit most because one fixed bottleneck frees up a large share of capacity.'],
    ],
    related: ['ai-implementation-workflow-automation', 'business-consulting-growth-strategy'],
  },
  {
    slug: 'online-presence-lead-generation',
    image: img.leads,
    title: 'Online Presence & Lead Generation',
    short: 'Lead Generation',
    summary: 'A connected system — profiles, website, content and follow-up — that brings in a steady flow of qualified enquiries.',
    metaDescription:
      'Online presence and lead generation for small businesses by Piyush Mittal. Build a credible presence and a predictable pipeline of qualified leads.',
    intro:
      'Leads don\'t come from one channel; they come from a system. I set up the pieces — profiles, website, offers, follow-up — so that people who find you can trust you and contact you easily, and nobody slips through.',
    forWho: ['Businesses relying only on word of mouth', 'Service providers with feast-or-famine months', 'Teams that get enquiries but lose them in follow-up'],
    problems: [
      'Months swing between too busy and too quiet',
      'Your online profiles are incomplete or inconsistent',
      'There is no clear offer that gets people to reach out',
      'Leads are tracked in WhatsApp chats and memory',
    ],
    deliverables: [
      'Presence audit: Google, LinkedIn, social and directories',
      'Consistent profiles, reviews strategy and trust signals',
      'Lead magnets and offers matched to your buyers',
      'Simple CRM pipeline with automated follow-up',
      'Weekly lead dashboard with source tracking',
    ],
    process: [
      ['Audit', 'How easy you are to find, trust and contact today.'],
      ['Build trust', 'Profiles, proof and reviews in the right places.'],
      ['Capture', 'Offers, forms and channels that turn interest into leads.'],
      ['Convert', 'Follow-up and pipeline so leads become customers.'],
    ],
    faqs: [
      ['Which channels will you focus on?', 'The ones your buyers already use. For local businesses that\'s usually Google and WhatsApp; for B2B it\'s often LinkedIn and search.'],
      ['Do you buy lead lists?', 'No. The focus is on attracting and converting people who actually want what you sell.'],
      ['How do I know it\'s working?', 'Every lead is tagged with its source, so you can see what each channel produces each week.'],
    ],
    related: ['digital-marketing-seo', 'ai-implementation-workflow-automation'],
  },
];

export const posts = [
  {
    slug: 'where-small-businesses-should-start-with-ai',
    related: ['ai-implementation-workflow-automation', 'business-weakness-analysis-process-improvement'],
    image: img.aiHand,
    title: 'Where small businesses should actually start with AI',
    description: 'Skip the hype. A practical way for small business owners to find the first AI use case that pays for itself.',
    date: '2026-10-01',
    readingTime: 6,
    tag: 'AI',
    body: `
<p>Most conversations about AI in small business start in the wrong place: with the tool. "Should we use ChatGPT?" "Do we need an AI chatbot?" The better question is simpler and less exciting: <strong>where does work get stuck, repeated, or dropped?</strong></p>
<p>AI is not a strategy. It is a very capable assistant that is good at specific kinds of work — reading, sorting, drafting, summarising, answering repeat questions. Pointed at the right problem, it pays for itself in weeks. Pointed at the wrong one, it becomes another subscription nobody uses.</p>
<h2>Step 1: List the work nobody enjoys</h2>
<p>Ask your team one question: <em>what do you do every week that feels like a waste of your skills?</em> The answers are usually the same handful of things:</p>
<ul>
<li>Replying to the same enquiry questions again and again</li>
<li>Copying details from forms or WhatsApp into a sheet or CRM</li>
<li>Writing quotes, follow-ups and proposals from scratch</li>
<li>Compiling a weekly or monthly report</li>
</ul>
<p>That list is your AI shortlist.</p>
<h2>Step 2: Put a number on each item</h2>
<p>For each task, estimate two things: hours per week, and what happens when it's done late or badly. Slow enquiry replies, for example, often cost more in lost customers than in staff time. A task that takes two hours a week but loses one customer a month is worth more than one that takes five hours and loses nothing.</p>
<h2>Step 3: Choose the boring, contained one</h2>
<p>Your first AI project should be small, frequent and easy to check. Good first projects:</p>
<ul>
<li><strong>Enquiry first-response:</strong> an assistant drafts an instant, accurate reply using your FAQs and prices; a person approves or edits.</li>
<li><strong>Data capture:</strong> details from emails or forms are extracted and added to your sheet or CRM automatically.</li>
<li><strong>Proposal drafting:</strong> a first draft built from your templates and the client's brief, finished by a human.</li>
</ul>
<p>Notice the pattern: AI does the first 80%, a person checks the last 20%. That keeps quality high and risk low while you learn.</p>
<h2>Step 4: Measure, then expand</h2>
<p>Track the before and after: response time, hours saved, errors, conversion rate. If the numbers move, take the next item on the list. If they don't, you've learned cheaply.</p>
<h2>What to avoid</h2>
<p>Don't start with a customer-facing bot that answers anything without review. Don't automate a broken process — fix the process first, then automate it. And don't buy five tools before you've proven one use case.</p>
<p>The businesses that get real value from AI aren't the ones with the most tools. They're the ones that picked one real problem and solved it properly.</p>
`,
  },
  {
    slug: 'five-leaks-that-quietly-kill-small-business-growth',
    related: ['business-weakness-analysis-process-improvement', 'business-consulting-growth-strategy'],
    image: img.smallBiz,
    title: 'The five leaks that quietly kill small business growth',
    description: 'Revenue rarely stalls for one big reason. It leaks through small, fixable gaps. Here are the five most common — and how to spot them.',
    date: '2026-09-18',
    readingTime: 5,
    tag: 'Growth',
    body: `
<p>When growth stalls, owners usually look for a big answer — a new product, a new market, a bigger ad budget. In my experience, the problem is more often a set of small leaks that, added together, drain a surprising share of potential revenue.</p>
<h2>1. Slow or missing follow-up</h2>
<p>An enquiry is at its warmest in the first hour. Many businesses reply the next day — or never, because the message was buried in a phone. <strong>Check:</strong> pick your last 20 enquiries. How long did each wait for a reply, and how many were never followed up?</p>
<h2>2. A website that explains what you do, but not why you</h2>
<p>Visitors decide in seconds whether you're relevant. If your homepage talks about your history before it talks about their problem, they leave. <strong>Check:</strong> can a stranger tell, in five seconds, who you help and what to do next?</p>
<h2>3. Pricing that hasn't been reviewed in years</h2>
<p>Costs rise every year; prices often don't. Underpricing feels safe but slowly removes the margin you need to invest in growth. <strong>Check:</strong> when did you last compare your pricing against competitors and against the value you deliver?</p>
<h2>4. Everything runs through the owner</h2>
<p>If every quote, decision and escalation needs you, the business can only grow as fast as your calendar. <strong>Check:</strong> list the decisions you made last week. Which could someone else make with a clear rule or template?</p>
<h2>5. No single view of the numbers</h2>
<p>Sales in one place, leads in another, costs in an accountant's file once a quarter. Without a simple weekly view, problems are spotted months late. <strong>Check:</strong> could you state last week's leads, conversions and cash position in two minutes?</p>
<h2>Fix the leak before you pour in more water</h2>
<p>It's tempting to fix stalled growth with more marketing. But more leads into a leaky system mostly produce more lost leads. Fix follow-up, clarity, pricing, ownership and visibility first — then every rupee of marketing works harder.</p>
`,
  },
  {
    slug: 'why-your-website-is-not-generating-leads',
    related: ['website-development', 'online-presence-lead-generation'],
    image: img.webLeads,
    title: 'Why your website isn\'t generating leads (and what to fix first)',
    description: 'Traffic without enquiries is a clarity problem, not a design problem. A priority-ordered checklist for small business websites.',
    date: '2026-09-02',
    readingTime: 5,
    tag: 'Websites',
    body: `
<p>"We get visitors, but nobody contacts us." It's one of the most common things I hear from business owners. The instinct is to redesign. Usually, the fix is smaller and more specific.</p>
<h2>Fix these in order</h2>
<h3>1. The first screen</h3>
<p>Your headline should say who you help and with what — in their words, not yours. "Innovative solutions for tomorrow" says nothing. "Commercial vehicle bodies built to your spec, delivered on schedule" says everything.</p>
<h3>2. One clear next step</h3>
<p>Pick the action that matters most — call, WhatsApp, enquiry form — and make it visible on every page, especially on mobile. Five competing buttons is the same as none.</p>
<h3>3. Proof near the ask</h3>
<p>People hesitate right before they act. Put reviews, client logos, project photos or a short case study next to your contact button, not hidden on a separate page.</p>
<h3>4. Speed on a normal phone</h3>
<p>Most small business traffic is mobile, often on average connections. Heavy images and plugins make visitors leave before the page loads. Aim for the main content to appear in under two and a half seconds.</p>
<h3>5. A form that asks for less</h3>
<p>Every extra field loses people. Ask for what you need to reply — name, contact, a short message — and gather the rest in conversation.</p>
<h3>6. Tracking you can trust</h3>
<p>If you don't know which pages and channels produce enquiries, you can't improve them. Set up conversion tracking for form submits, calls and WhatsApp clicks.</p>
<h2>Then, and only then, redesign</h2>
<p>A redesign is worth it when the structure no longer fits your business. But many sites start converting with a sharper headline, one clear call to action and some proof in the right place — changes that take days, not months.</p>
`,
  },
];

// Homepage "Business health check" quiz. A "No" answer points to the linked service.
export const healthCheck = [
  { q: 'New enquiries get a reply within an hour.', service: 'online-presence-lead-generation' },
  { q: 'My website clearly says who I help and what to do next.', service: 'website-development' },
  { q: 'We show up on Google when people search for what we sell.', service: 'digital-marketing-seo' },
  { q: 'I know which marketing channel brings in the most customers.', service: 'digital-marketing-seo' },
  { q: 'My team spends less than 5 hours a week on repetitive admin.', service: 'ai-implementation-workflow-automation' },
  { q: 'The business runs smoothly for a week without me.', service: 'business-weakness-analysis-process-improvement' },
  { q: 'I have compared my prices and offer with competitors in the last year.', service: 'market-research-competitor-analysis' },
  { q: 'I have a written growth plan for this year.', service: 'business-consulting-growth-strategy' },
];

// Ways to work together (no fixed prices — scoped to each business).
export const engagements = [
  {
    name: 'Diagnose',
    tag: 'Start here',
    length: '2–3 weeks',
    summary: 'A focused look at your business to find what is holding growth back and where the quickest wins are.',
    points: ['Business and customer interviews', 'Leak register with monthly cost of each problem', 'Ranked opportunity map', '90-day action plan'],
  },
  {
    name: 'Build',
    tag: 'Most popular',
    length: '3–8 weeks',
    summary: 'A fixed-scope project that ships the fix: a website, an automation, a campaign or a new process.',
    points: ['Clear scope, timeline and price up front', 'Weekly progress updates', 'Launch, training and handover', '30 days of post-launch support'],
    featured: true,
  },
  {
    name: 'Grow',
    tag: 'Ongoing',
    length: 'Monthly',
    summary: 'A long-term growth partner: strategy, marketing and automation, reviewed against your numbers every month.',
    points: ['Monthly growth review and plan', 'Ongoing SEO, content and campaigns', 'New automations as you scale', 'Priority WhatsApp access'],
  },
];

export const homeFaqs = [
  ['What kind of businesses do you work with?', 'Small and owner-led businesses — local services, manufacturers, traders, travel, retail and professional firms. If you have customers and want more of the right ones, we should talk.'],
  ['Do you work with clients outside my city?', 'Yes. Most work happens over video calls, WhatsApp and shared documents, so I work with businesses across India and abroad.'],
  ['How much does it cost?', 'It depends on scope. Every project starts with a free 30-minute call; after it you get a clear proposal with a fixed price, so there are no surprises. Tell me your budget and I will tell you honestly what it can achieve.'],
  ['How quickly can we start?', 'Usually within one to two weeks of the first call. Small fixes, like a sharper homepage or a first automation, can often go live in days.'],
  ['What should I prepare for the first call?', 'Nothing formal. A rough idea of your monthly revenue, where customers come from, and the one problem you most want solved is plenty.'],
];
