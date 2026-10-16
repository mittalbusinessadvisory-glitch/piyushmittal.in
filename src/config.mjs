// Site-wide settings. Edit these first — they feed every page, the sitemap and the structured data.
export const site = {
  url: 'https://www.piyushmittal.in',
  name: 'Piyush Mittal',
  jobTitle: 'Business Growth & AI Solutions Consultant',
  tagline: 'Business Growth + AI Solutions',
  message: 'I understand business problems, identify opportunities, and use AI to turn ideas into practical solutions.',
  description:
    'Piyush Mittal is a business consultant helping small businesses grow with strategy, process improvement and practical AI, plus the websites and marketing to back it.',
  email: 'mittalbusinessadvisory@gmail.com',
  phone: '+91 92555 80705', // shown on the site
  phoneE164: '+919255580705', // used for tel: and WhatsApp links
  photo: '/assets/piyush-mittal.jpg',
  headshot: '/assets/piyush-mittal-headshot.jpg',
  location: { locality: '', region: '', country: 'India' }, // TODO: add your city/state for local SEO
  calendarUrl: '', // TODO: optional — Calendly/Cal.com link for "Book a call". Falls back to /contact/
  formEndpoint: '', // TODO: optional — Formspree/Getform endpoint. If blank the form opens the visitor's email app.
  // TODO: add ONLY profiles that are really yours. These become the `sameAs` links Google uses
  // to connect your website with your profiles — the single most important "Piyush Mittal" ranking signal.
  profiles: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/piyush-mittal-a200b8201/' },
    { label: 'Instagram', url: 'https://www.instagram.com/piyushmittalhq/' },
    // { label: 'GitHub', url: 'https://github.com/your-handle' },
    // { label: 'X', url: 'https://x.com/your-handle' },
    // { label: 'Instagram', url: 'https://www.instagram.com/your-handle/' },
  ],
  knowsAbout: [
    'Business strategy', 'Small business growth', 'Artificial intelligence', 'Workflow automation',
    'Website development', 'Search engine optimization', 'Digital marketing', 'Lead generation',
    'Market research', 'Competitor analysis', 'Process improvement',
  ],
};
