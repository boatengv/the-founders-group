// The Dispatch: every story the group has published, one entry per story.
//
// To add a story, copy this block into STORIES (anywhere, the list is sorted
// newest first for you) and fill in what is true:
//
//   {
//     id: 'fun-marketing-first-client',      // unique, lowercase-with-dashes; becomes the page address
//     month: '2026-10',                      // year-month it happened
//     ventureId: 'fun-marketing',            // which business it belongs to (see VENTURES in data.ts)
//     title: 'First restaurant client signs',
//     summary: 'One or two sentences shown on cards and at the top of the story.',
//     body: [                                 // optional: the full story, one string per paragraph
//       'First paragraph.',
//       'Second paragraph.',
//     ],
//     image: './resources/stories/fun-marketing-first-client.jpg', // optional; falls back to the business's picture
//     link: 'https://example.com',            // optional: where to see it live
//     stats: [                                // optional: headline numbers; the first one also shows on cards
//       { value: '1 → 6', label: 'Tutors' },
//     ],
//     quote: 'A line worth pulling out of the story.', // optional
//     quoteAfter: 3,                          // optional: which paragraph the quote follows (default: halfway)
//   },
//
// Only real, dated moments go here. Leave out anything not yet known rather
// than guessing; the story page shows whatever is filled in.

import { VENTURES } from './data';

export type Story = {
  id: string;
  month: string;
  ventureId: string;
  title: string;
  summary?: string;
  body?: string[];
  image?: string;
  link?: string;
  stats?: { value: string; label: string }[];
  quote?: string;
  quoteAfter?: number;
};

const ALL: Story[] = [
  {
    id: 'wyst-beta-testing-begins',
    month: '2026-10',
    ventureId: 'wyst',
    title: 'Wyst opens testing to its first 16 users',
    summary:
      'Issa Shaban’s app for meeting people through shared interests is now in the hands of around 16 testers, and their feedback is already shaping the next version.',
    link: 'https://www.wystapp.org/',
    stats: [
      { value: '~16', label: 'Testers' },
      { value: 'Manchester', label: 'Launch city' },
      { value: 'iPhone & Android', label: 'Coming soon' },
    ],
    body: [
      'Wyst helps people meet others nearby through shared interests. You pick what you are into, from gaming and music to football, books and hiking, and Wyst matches you with a small group of people close by, with a group chat to break the ice and local events to turn it into real plans.',
      'Testing has now begun with around 16 people, and they have already sent back feedback on bugs and areas to improve.',
      'Issa is working through that feedback now, alongside adding some basic features, while strengthening the foundations the app runs on so it is ready to grow.',
      'Wyst will launch first in Manchester, on iPhone and Android.',
    ],
  },
  {
    id: 'synthetic-talent-68000-views',
    month: '2026-10',
    ventureId: 'synthetic-talent',
    title: 'Synthetic Talent’s AI creators pass 68,000 views',
    summary:
      'Views across the three flagship AI creators have more than doubled since the last update, from 28,166 to 68,416, with 61 followers between them.',
    stats: [
      { value: '28k → 68k', label: 'Views across all pages' },
      { value: '41,929', label: 'AI Cleared views' },
      { value: '61', label: 'Followers across all pages' },
      { value: '6', label: 'Posting slots a day' },
    ],
    body: [
      'Synthetic Talent has passed 68,000 views across all of its managed talent, with 68,416 so far. That is more than double the 28,166 in the last update.',
      'AI Cleared is still out in front with 41,929 views and 38 followers. Wren Ashby has caught up with Juno Ferro: Wren is on 13,312 views and 13 followers, and Juno on 13,175 views and 10 followers.',
      'The pages now run to a fixed cadence of six slots a day. AI Cleared posts twice a day across Instagram, TikTok, YouTube and Facebook, and Juno and Wren post twice a day each across Instagram, TikTok and YouTube.',
      'Every post goes through an approval step before it is published, and each day is tracked with morning, noon, evening and end-of-day reports on views and followers.',
    ],
  },
  {
    id: 'in-person-tutors-rematch-stops-losses',
    month: '2026-10',
    ventureId: 'in-person-tutors',
    title: 'One rematch stops the losses at In Person Tutors',
    summary:
      'Rematching a family with a better-suited tutor doubled their spend and stopped the losses. One more conversion would make the business profitable.',
    stats: [
      { value: '2×', label: 'Revenue from one family after a rematch' },
      { value: 'Stopped', label: 'Losses' },
      { value: '~£1k', label: 'MRR if the next family converts' },
      { value: '3', label: 'Families in the pipeline' },
    ],
    body: [
      'Last week’s focus was pricing: stop the losses and find the route to profit.',
      'The breakthrough came from an existing family. Rematching them with a better-suited tutor doubled their spend, and that rematch alone was enough to stop the losses.',
      'Three families are now in the pipeline. One has a free trial lesson this week; if they convert, monthly revenue reaches just under £1k and the business turns profitable. A second has a free consultation booked, which could take it to £1.1–1.2k. A third is a new lead, with a call planned.',
      'New sales and tech changes are also in place. The coming weeks will show whether they improve conversion.',
    ],
    quote: 'The rematch alone got us there.',
    quoteAfter: 2,
  },
  {
    id: 'fun-marketing-three-businesses-locked-in',
    month: '2026-10',
    ventureId: 'fun-marketing',
    title: 'Fun Marketing locks in three social media businesses',
    summary:
      'Three businesses are signed up for social media marketing and content production starts this week. A cosmetic shop now stocks NomadRoots hair oil, and Sempre Access has launched.',
    stats: [
      { value: '3', label: 'Social media businesses locked in' },
      { value: '1', label: 'Cosmetic shop stocking NomadRoots' },
      { value: 'This week', label: 'Content production starts' },
    ],
    body: [
      'Three social media marketing businesses are locked in, and content production starts this week. Once regular videos and concepts are uploaded, the team will track the data to see what is doing well. Recording for the football club has already started.',
      'NomadRoots hair oil is now stocked by one cosmetic shop. The website has been improved and is easier to navigate, payment is set up, and orders can now be placed.',
      'Sempre Access has launched its website. It is a key lock box installing business that also fits Ring cameras to houses, so owners can feel safer without leaving keys under the carpet, and builders or workers can get in when no one is home. Business cards will be ready on Monday and T-shirt printing begins this week.',
    ],
  },
  {
    id: 'funeducate-first-drawing-book',
    month: '2026-10',
    ventureId: 'funeducate',
    title: 'FunEducate’s first drawing book heads to Amazon',
    summary: 'The first FunEducate drawing book is almost finished and should be published on Amazon this week.',
    stats: [
      { value: 'This week', label: 'Expected Amazon publication' },
      { value: '1st', label: 'FunEducate drawing book' },
    ],
    body: [
      'FunEducate, Gabriel Boateng’s second company, is close to its first release. The first drawing book is almost finished.',
      'It should be published on Amazon this week.',
    ],
  },
  {
    id: 'fun-marketing-35-restaurants-emailed',
    month: '2026-10',
    ventureId: 'fun-marketing',
    title: 'Fun Marketing emails 35 fast food restaurants',
    summary:
      'The agency has reached out to 35 target restaurants. Next: face-to-face pitches, and a local Norbury restaurant to practise on.',
    stats: [
      { value: '35', label: 'Fast food restaurants emailed' },
      { value: 'Face to face', label: 'Next: pitches to close deals' },
      { value: 'Norbury', label: 'Practice restaurant' },
    ],
    body: [
      'This week Gabriel and Hassan sent emails to 35 target fast food restaurants for the Fun Marketing agency.',
      'Based on the responses, the plan is to move to face-to-face pitches and aim to close some membership deals.',
      'Alongside that, the team intends to work with a local fast food restaurant in Norbury, using it to practise their social media content strategies and improve its brand awareness online.',
      'From there, they will take it step by step.',
    ],
    quote: 'Practise our social media content strategies to improve brand awareness online.',
    quoteAfter: 3,
  },
  {
    id: 'adusanko-cocoa-samples-for-bakeries',
    month: '2026-10',
    ventureId: 'adusanko',
    title: 'Bakeries and cafés ask Adusanko for cocoa samples',
    summary:
      'Denzel visited bakeries and cafés to learn who supplies their chocolate cakes. A few have asked to try Adusanko’s cocoa products.',
    stats: [
      { value: 'Samples', label: 'Requested by bakeries and cafés' },
      { value: 'Next week', label: 'Sample deliveries' },
      { value: '2', label: 'Next steps' },
    ],
    body: [
      'This week Denzel Kesse visited bakeries and cafés to find out who supplies the chocolate in their cakes, and who their wholesale providers are.',
      'A few of them asked for samples of Adusanko’s cocoa products. Once the samples arrive, Denzel will deliver them next week.',
      'He also took an honest look at how he works: he needs to get better at recording the actions he has taken, and at planning each week in advance.',
      'Next, Denzel is preparing a detailed catalogue of the products Adusanko deals in, and updating the site with more details about its cocoa products.',
    ],
    quote: 'Plan what I am doing for the week rather than “winging” it.',
    quoteAfter: 3,
  },
  {
    id: 'synthetic-talent-nearing-30000-views',
    month: '2026-10',
    ventureId: 'synthetic-talent',
    title: 'Three AI creators close in on 30,000 views',
    summary:
      'Synthetic Talent’s three flagship pages have 28,166 views between them, and AI Cleared’s recent posts average about 1,280 views each, up from fewer than 20.',
    stats: [
      { value: '28,166', label: 'Views across all pages' },
      { value: '<20 → 1,280', label: 'AI Cleared average views per post' },
      { value: '63%', label: 'Of views from YouTube' },
      { value: '3', label: 'Flagship AI creators' },
    ],
    body: [
      'Synthetic Talent is approaching 30,000 views across all platforms and all of its managed talent, with 28,166 so far. AI Cleared accounts for 16,674 of them, Juno Ferro for 6,970 and Wren Ashby for 4,522.',
      'The three flagship AI influencer pages each have their own lane. AI Cleared covers AI and tech news, built from real footage. Juno Ferro is a football creator who scores spectacular goals. Wren Ashby does comedy try-on hauls of food-themed fashion.',
      'AI Cleared has made the biggest jump. Its first five posts averaged fewer than 20 views each; its five most recent average about 1,280. Four of those five passed 1,000 views, and the latest passed 1,000 within about three hours.',
      'YouTube leads with 63% of all views (17,750). TikTok follows with 29% (8,131), and Instagram brings 8% (2,285).',
      'There are no plans to monetise yet. The first priority is improving engagement and reach, and pinning down the best content to post on each page.',
      'ElevenLabs is coming in for voiceovers, because generating video footage costs too many credits. Juno’s content still needs more work. Wren is already picking up: her latest haul reached 1,558 views and brought her first real traction on TikTok.',
    ],
    quote: 'I’ve no doubt she’ll keep growing as the tools improve and the content ideas get stronger.',
    quoteAfter: 6,
  },
  {
    id: 'in-person-tutors-tutors-one-to-six',
    month: '2026-10',
    ventureId: 'in-person-tutors',
    title: 'Tutors grow from one to six as the focus turns to profit',
    summary: 'The tutor side grew sixfold in a week. Next, In Person Tutors steps back from growth to find its route to profit.',
    stats: [
      { value: '1 → 6', label: 'Tutors this week' },
      { value: 'Steady', label: 'Parents' },
      { value: '2', label: 'Parents in the pipeline' },
      { value: '1–2 wks', label: 'Typical parent sales cycle' },
    ],
    body: [
      'In Person Tutors grew its tutor side this week, from one tutor to six. The number of parents stayed the same.',
      'Two parents are in the sales pipeline: one at the interview stage, and one still deciding on a tutor. For parents, the sales cycle typically runs one to two weeks.',
      'The next phase shifts the focus to making a profit. That means taking a step back, based on what phase 3 found.',
      'Two findings drove that decision: growing the tutor side, and finding a per-hour rate that tutors are happy with. Set against the budgets parents gave in phase 3, that rate gives the team confidence there is a route to profitability.',
      'The milestone to watch is next week. Making money from a tutor would show that the growth can sustain itself.',
    ],
    quote: 'Growth as a financial objective was premature.',
  },
  {
    id: 'wyst-beta-opens',
    month: '2026-09',
    ventureId: 'wyst',
    title: 'Wyst’s iPhone beta opens to testers',
  },
  {
    id: 'synthetic-talent-launch-site',
    month: '2026-09',
    ventureId: 'synthetic-talent',
    title: 'Launch site goes live',
    link: 'https://synthetic-talent-98oer8.v2.appdeploy.ai/',
  },
  {
    id: 'in-person-tutors-claude-connector',
    month: '2026-09',
    ventureId: 'in-person-tutors',
    title: 'Claude connector ships for tutor and client records',
  },
  {
    id: 'in-person-tutors-taskify',
    month: '2026-09',
    ventureId: 'in-person-tutors',
    title: 'Taskify launches with shared team spaces',
    link: 'https://taskify-jazee1.v2.appdeploy.ai/',
  },
  {
    id: 'in-person-tutors-tutor-client-log',
    month: '2026-09',
    ventureId: 'in-person-tutors',
    title: 'Tutor and client log goes live for the team',
  },
];

// Newest first; stories from the same month keep the order they are written in.
export const STORIES: Story[] = ALL.map((s, i) => ({ s, i }))
  .sort((a, b) => b.s.month.localeCompare(a.s.month) || a.i - b.i)
  .map(x => x.s);

export function storyById(id: string): Story | undefined {
  return STORIES.find(s => s.id === id);
}

export function storiesFor(ventureId: string): Story[] {
  return STORIES.filter(s => s.ventureId === ventureId);
}

// Businesses that have at least one story, in the order they appear in VENTURES.
export function desksWithStories() {
  return VENTURES.filter(v => STORIES.some(s => s.ventureId === v.id));
}

if (import.meta.env.DEV) {
  const seen = new Set<string>();
  for (const s of ALL) {
    if (seen.has(s.id)) console.warn('Two stories share the id "' + s.id + '"; give one a new id.');
    if (!VENTURES.some(v => v.id === s.ventureId)) console.warn('Story "' + s.id + '" points at unknown venture "' + s.ventureId + '".');
    seen.add(s.id);
  }
}
