// All site content lives here, so Phase 2 can move it into a database
// without touching the pages.

export type Stage = 'Live' | 'Launching' | 'Stealth';

export type VentureLink = { label: string; url: string };

export type Venture = {
  id: string;
  name: string;
  sector: string;
  stage: Stage;
  pitch: string;
  about: string[];
  color: string;
  founders: string[];
  links: VentureLink[];
  image: string;
};

export type Founder = {
  id: string;
  name: string;
  roles: string[];
  ventures: string[];
  photo: string;
};

export type Perk = { title: string; text: string };

export const GROUP = {
  name: 'The Founders Group',
  short: 'Founders Group',
};

export const VENTURES: Venture[] = [
  {
    id: 'in-person-tutors',
    name: 'In Person Tutors',
    sector: 'Education',
    stage: 'Live',
    pitch: 'One-to-one tutoring at home, from qualified teachers.',
    about: [
      'A London tutoring service matching families with qualified teachers for lessons at home, including exam preparation and support for special educational needs.',
      'The team runs on its own tools: a shared log of tutors, clients and matches, and Taskify for planning, both with Claude connectors.',
    ],
    color: '#f2f2f2',
    founders: ['controllah-gabi'],
    links: [
      { label: 'inpersontutors.space', url: 'https://inpersontutors.space/' },
      { label: 'Tutor and client log', url: 'https://tutor-and-client-log-f5ocrb.v2.appdeploy.ai/' },
      { label: 'Taskify', url: 'https://taskify-jazee1.v2.appdeploy.ai/' },
    ],
    image: './resources/ventures/in-person-tutors.jpg',
  },
  {
    id: 'fun-marketing',
    name: 'Fun Marketing',
    sector: 'Marketing',
    stage: 'Live',
    pitch: 'Food content and social media for independent restaurants.',
    about: [
      'Content creation, social media management and local marketing for independent restaurants, takeaways and cafés, turning great food into attention and local customers.',
    ],
    color: '#d6d6d6',
    founders: ['gabriel-boateng', 'hassan-hassan'],
    links: [{ label: 'funmarketing247.app', url: 'https://funmarketing247.app/' }],
    image: './resources/ventures/fun-marketing.jpg',
  },
  {
    id: 'adusanko',
    name: 'Adusanko',
    sector: 'Venture',
    stage: 'Live',
    pitch: 'Visit the site to see what Denzel is building.',
    about: ['Founded by Denzel Kesse. More on Adusanko soon.'],
    color: '#b5b5b5',
    founders: ['denzel-kesse'],
    links: [{ label: 'adusanko.com', url: 'https://adusanko.com/' }],
    image: './resources/ventures/adusanko.jpg',
  },
  {
    id: 'synthetic-talent',
    name: 'Synthetic Talent',
    sector: 'AI media',
    stage: 'Launching',
    pitch: 'AI influencers, built and managed like real talent.',
    about: [
      'An agency that creates and manages AI influencers across TikTok, YouTube and Instagram.',
      'Next: a tool for posting and analytics, content management services, then AI influencer M&A. Long term: research into long-form AI content.',
    ],
    color: '#969696',
    founders: ['victor-boateng'],
    links: [
      { label: 'Synthetic Talent site', url: 'https://boatengv.github.io/SyntheticTalent-Web/' },
    ],
    image: './resources/ventures/synthetic-talent.jpg',
  },
  {
    id: 'funeducate',
    name: 'FunEducate',
    sector: 'Books',
    stage: 'Launching',
    pitch: 'Drawing books, with the first one almost ready for Amazon.',
    about: [
      'FunEducate is Gabriel Boateng’s second company. Its first drawing book is almost finished and should be published on Amazon this week.',
    ],
    color: '#a3a3a3',
    founders: ['gabriel-boateng'],
    links: [],
    image: './resources/ventures/funeducate.jpg',
  },
  {
    id: 'stealth',
    name: 'Stealth venture',
    sector: 'To be announced',
    stage: 'Stealth',
    pitch: 'Issa Shaban is building something new. Reveal coming soon.',
    about: ['Details will be shared at launch.'],
    color: '#7a7a7a',
    founders: ['issa-shaban'],
    links: [],
    image: './resources/ventures/stealth.jpg',
  },
];

export const FOUNDERS: Founder[] = [
  {
    id: 'victor-boateng',
    name: 'Victor Boateng',
    roles: ['Founder, Synthetic Talent'],
    ventures: ['synthetic-talent'],
    photo: './resources/founders/victor-boateng.jpg',
  },
  {
    id: 'controllah-gabi',
    name: 'Controllah Gabi',
    roles: ['Co-founder, In Person Tutors'],
    ventures: ['in-person-tutors'],
    photo: './resources/founders/controllah-gabi.jpg',
  },
  {
    id: 'gabriel-boateng',
    name: 'Gabriel Boateng',
    roles: ['Co-founder, Fun Marketing', 'Founder, FunEducate'],
    ventures: ['fun-marketing', 'funeducate'],
    photo: './resources/founders/gabriel-boateng.jpg',
  },
  {
    id: 'hassan-hassan',
    name: 'Hassan Hassan',
    roles: ['Co-founder, Fun Marketing'],
    ventures: ['fun-marketing'],
    photo: './resources/founders/hassan-hassan.jpg',
  },
  {
    id: 'denzel-kesse',
    name: 'Denzel Kesse',
    roles: ['Founder, Adusanko'],
    ventures: ['adusanko'],
    photo: './resources/founders/denzel-kesse.jpg',
  },
  {
    id: 'issa-shaban',
    name: 'Issa Shaban',
    roles: ['Founder, stealth venture'],
    ventures: ['stealth'],
    photo: './resources/founders/issa-shaban.jpg',
  },
];

export const PERKS: Perk[] = [
  {
    title: 'Intros and network',
    text: 'Warm introductions to clients, partners and every member’s network.',
  },
  {
    title: 'Accountability',
    text: 'Regular check-ins where each founder sets goals and reports back to the group.',
  },
  {
    title: 'Shared tools and build help',
    text: 'The group’s own tools, such as Taskify, and hands-on help building yours.',
  },
  {
    title: 'Investor access',
    text: 'Your venture in front of investors who come to the group looking for teams.',
  },
];

export function ventureById(id: string): Venture | undefined {
  return VENTURES.find(v => v.id === id);
}

export function founderById(id: string): Founder | undefined {
  return FOUNDERS.find(f => f.id === id);
}

export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, (m || 1) - 1, 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

export function liveProductCount(): number {
  return VENTURES.reduce((n, v) => n + v.links.length, 0);
}

export function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

export function numberWord(n: number): string {
  return WORDS[n] || String(n);
}
