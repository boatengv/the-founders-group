import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Handshake, LineChart, Target, Wrench } from 'lucide-react';
import { PERKS } from '../data';
import { href } from '../router';
import { EASE, Reveal, StaggerGrid } from './Motion';

const PERK_ICONS = [Handshake, Target, Wrench, LineChart];

type Audience = 'founders' | 'investors';

const LANDING: Record<Audience, { label: string; title: string; text: string; cta: string; to: string }> = {
  founders: {
    label: 'For founders',
    title: 'Building something real?',
    text: 'Membership is by application. Tell us what you are building and your biggest moment so far.',
    cta: 'Apply to join',
    to: '/apply',
  },
  investors: {
    label: 'For investors',
    title: 'Founder-led ventures, most already live.',
    text: 'See the whole portfolio in one place, and ask for an introduction to the founders you want to meet.',
    cta: 'See the portfolio',
    to: '/investors',
  },
};

const PAGES: Audience[] = ['founders', 'investors'];

// Turning the page: the sheet underneath slides out past the corner and comes
// to rest on top, while the old top sheet tucks in behind, a little askew.
const TO_FRONT = { x: [14, 70, 0], y: [14, -14, 0], rotate: [1.2, 2.4, 0], zIndex: [1, 3, 3] };
const TO_BACK = { x: [0, -30, 14], y: [0, 10, 14], rotate: [0, -1.6, 1.2], zIndex: [2, 2, 1] };

// What members get down the left, and beside it two stacked pages: one for
// founders to apply, and one underneath for investors, reached by turning the
// folded corner.
export function MembershipStairs() {
  const [front, setFront] = useState<Audience>('founders');

  return (
    <section className='section stairs-section' id='membership'>
      <div className='stairs-layout'>
      <div className='stairs-col'>
        <Reveal className='section-head'>
          <div>
            <p className='eyebrow'>Membership</p>
            <h2>What members get</h2>
          </div>
        </Reveal>
        <StaggerGrid className='stairs'>
        {PERKS.map((p, i) => {
          const Icon = PERK_ICONS[i % PERK_ICONS.length];
          return (
            <div className='step' key={p.title}>
              <span className='step-num'>{String(i + 1).padStart(2, '0')}</span>
              <Icon size={20} aria-hidden='true' />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          );
        })}
      </StaggerGrid>
      </div>

      <Reveal className='pages'>
        {PAGES.map(a => {
          const page = LANDING[a];
          const isFront = a === front;
          const other = a === 'founders' ? 'investors' : 'founders';
          return (
            <motion.article
              key={a}
              className={'page page-' + a + (isFront ? ' front' : '')}
              inert={!isFront}
              initial={false}
              animate={isFront ? TO_FRONT : TO_BACK}
              transition={{ duration: 0.75, ease: EASE, times: [0, 0.45, 1] }}
            >
              <div className='page-face' aria-hidden='true' />
              <div className='page-content'>
                <div>
                  <p className='eyebrow'>{page.label}</p>
                  <h2>{page.title}</h2>
                  <p className='page-text'>{page.text}</p>
                </div>
                <a className={'btn btn-lg ' + (a === 'founders' ? 'btn-accent' : 'btn-light')} href={href(page.to)}>
                  {page.cta} <ArrowRight size={18} />
                </a>
              </div>
              <button type='button' className='turn' onClick={() => setFront(other)}>
                <span className='turn-label'>
                  {LANDING[other].label} <ArrowRight size={14} />
                </span>
                <span className='turn-fold' aria-hidden='true' />
              </button>
            </motion.article>
          );
        })}
      </Reveal>
      </div>
    </section>
  );
}
