import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Moment, Venture } from '../data';
import { MOMENTS, VENTURES, monthLabel, ventureById } from '../data';
import { href } from '../router';
import { EASE, Reveal, ScrollWords } from './Motion';
import '../dispatch.css';

const ROTATE_MS = 6500;

// The lead story's picture: the venture's uploaded photo, or a dark poster
// with the venture's name until one exists.
function LeadVisual({ venture }: { venture: Venture }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [venture.id]);
  return (
    <div className='lead-visual' aria-hidden='true'>
      {!failed ? <img src={venture.image} alt='' onError={() => setFailed(true)} /> : null}
      {failed ? <span className='lead-watermark'>{venture.name}</span> : null}
    </div>
  );
}

function Thumb({ venture }: { venture: Venture }) {
  const [failed, setFailed] = useState(false);
  const initials = venture.name
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className='story-thumb' aria-hidden='true'>
      {!failed ? <img src={venture.image} alt='' loading='lazy' onError={() => setFailed(true)} /> : initials}
    </span>
  );
}

// Moments laid out like a newsroom front page: a rotating lead story,
// a numbered list of top stories, and a desk per venture to filter by.
export function Dispatch() {
  const desks = VENTURES.filter(v => MOMENTS.some(m => m.ventureId === v.id));
  const [desk, setDesk] = useState('all');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const stories: Moment[] = desk === 'all' ? MOMENTS : MOMENTS.filter(m => m.ventureId === desk);
  const lead = stories[Math.min(active, stories.length - 1)];
  const leadVenture = lead ? ventureById(lead.ventureId) : undefined;
  const issue = MOMENTS.length ? monthLabel(MOMENTS[0].month) : '';

  useEffect(() => setActive(0), [desk]);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || paused || stories.length < 2) return;
    const id = window.setTimeout(() => setActive(a => (a + 1) % stories.length), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, stories.length]);

  if (!lead || !leadVenture) return null;

  return (
    <section className='section dispatch' id='moments'>
      <Reveal className='dispatch-mast'>
        <div>
          <p className='eyebrow'>Moments</p>
          <h2>
            <ScrollWords text='The Dispatch' />
          </h2>
        </div>
        <p className='dispatch-issue'>
          <span className='live-dot' aria-hidden='true' />
          {issue} · {MOMENTS.length} {MOMENTS.length === 1 ? 'story' : 'stories'} · newest first
        </p>
      </Reveal>

      <nav className='desks' aria-label='Filter moments by venture'>
        <button type='button' aria-pressed={desk === 'all'} onClick={() => setDesk('all')}>
          All desks <small>{MOMENTS.length}</small>
        </button>
        {desks.map(v => (
          <button key={v.id} type='button' aria-pressed={desk === v.id} onClick={() => setDesk(v.id)}>
            {v.name} <small>{MOMENTS.filter(m => m.ventureId === v.id).length}</small>
          </button>
        ))}
      </nav>

      <Reveal delay={0.1}>
      <div className='dispatch-grid' onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <article className='lead'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={desk + ':' + active}
              className='lead-inner'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <LeadVisual venture={leadVenture} />
              <div className='lead-copy'>
                <span className='tag'>{leadVenture.name}</span>
                <motion.h3
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                >
                  {lead.title}
                </motion.h3>
                <div className='lead-meta'>
                  <a href={href('/ventures/' + lead.ventureId)}>
                    Read the story <ArrowRight size={15} />
                  </a>
                  {lead.link ? (
                    <a href={lead.link} target='_blank' rel='noopener noreferrer'>
                      See it live <ArrowUpRight size={15} />
                    </a>
                  ) : null}
                  <span>{monthLabel(lead.month)}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {stories.length > 1 ? (
            <div className='lead-progress' aria-hidden='true'>
              {stories.map((_, i) => (
                <i key={desk + i} className={i < active ? 'done' : i === active ? 'on' : ''}>
                  {i === active ? <b key={active} className={paused ? 'paused' : ''} /> : null}
                </i>
              ))}
            </div>
          ) : null}
        </article>

        <aside className='top-stories'>
          <h3>Top stories</h3>
          <ol>
            {stories.map((m, i) => {
              const v = ventureById(m.ventureId);
              if (!v) return null;
              return (
                <li key={desk + i}>
                  <button
                    type='button'
                    className={'story' + (i === active ? ' on' : '')}
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <Thumb venture={v} />
                    <span className='story-text'>
                      <span className='story-title'>{m.title}</span>
                      <span className='story-meta'>
                        {v.name} · {monthLabel(m.month)}
                        {i === 0 && desk === 'all' ? <em>Latest</em> : null}
                      </span>
                    </span>
                    <span className='story-num' aria-hidden='true'>
                      {i + 1}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <a className='story-next' href={href('/apply')}>
            <span>
              <span className='story-title'>Your moment could be next.</span>
              <span className='story-meta'>Membership by application</span>
            </span>
            <ArrowRight size={18} />
          </a>
        </aside>
      </div>
      </Reveal>
    </section>
  );
}
