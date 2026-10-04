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
