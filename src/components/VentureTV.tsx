import { useEffect, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Venture } from '../data';
import { FOUNDERS, VENTURES, domainOf, founderById } from '../data';
import { href } from '../router';
import { FounderCard } from './Cards';
import { Reveal } from './Motion';
import { SCENE_COLORS } from './Scene';
import '../tv.css';

const pad = (n: number) => String(n).padStart(2, '0');

// The picture on screen: the venture's photo if it has one, otherwise a
// title card with its name in its own colour.
function Picture({ venture }: { venture: Venture }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [venture.id]);
  return (
    <div className='tv-picture' aria-hidden='true'>
      {!failed ? <img src={venture.image} alt='' onError={() => setFailed(true)} /> : null}
      {failed ? <span className='tv-card-name'>{venture.name}</span> : null}
    </div>
  );
}

// Founders stacked down the left; on the right a TV showing one venture at a
// time, with channel buttons to flick to the next programme. Pointing at a
// founder tunes the TV to their venture.
export function VentureTV({ founders = FOUNDERS }: { founders?: typeof FOUNDERS }) {
  const [channel, setChannel] = useState(0);
  const [flicks, setFlicks] = useState(0);
  const v = VENTURES[channel];
  const names = v.founders
    .map(id => founderById(id))
    .filter(Boolean)
    .map(f => f!.name)
    .join(' & ');
  const site = v.links[0];

  const tune = (i: number) => {
    const next = (i + VENTURES.length) % VENTURES.length;
    if (next === channel) return;
    setChannel(next);
    setFlicks(n => n + 1);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') tune(channel + 1);
    else if (e.key === 'ArrowLeft') tune(channel - 1);
    else return;
    e.preventDefault();
  };

  return (
    <section className='section tv-section' id='ventures'>
      <Reveal className='section-head'>
        <div>
          <p className='eyebrow'>Founders & ventures</p>
          <h2>Who is building what</h2>
        </div>
        <a className='link-arrow' href={href('/ventures')}>
          All ventures <ArrowRight size={16} />
        </a>
      </Reveal>

      <div className='tv-layout'>
        <Reveal className='tv-founders'>
          {founders.map(f => (
            <div
              key={f.id}
              className={'tv-founder' + (f.ventures.includes(v.id) ? ' on-air' : '')}
              onMouseEnter={() => tune(VENTURES.findIndex(x => x.id === f.ventures[0]))}
              onFocus={() => tune(VENTURES.findIndex(x => x.id === f.ventures[0]))}
            >
              <FounderCard
                founder={f}
                compact
                onVenture={id => tune(VENTURES.findIndex(x => x.id === id))}
              />
            </div>
          ))}
        </Reveal>

        <Reveal className='tv' delay={0.1}>
          <div
            className='tv-screen'
            style={{ '--glow': SCENE_COLORS[v.id] || '#8a8f98' } as CSSProperties}
            tabIndex={0}
            role='group'
            aria-roledescription='TV'
            aria-label={'Channel ' + pad(channel + 1) + ': ' + v.name + '. Use the arrow keys to change channel.'}
            onKeyDown={onKey}
          >
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={v.id}
                className='tv-programme'
                initial={{ scaleY: 0.01, scaleX: 0.6, opacity: 0 }}
                animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                exit={{ scaleY: 0.01, scaleX: 0.9, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <Picture venture={v} />
                <div className='tv-osd'>
                  <span className='tv-ch'>CH {pad(channel + 1)}</span>
                  <span className={'tv-stage tv-stage-' + v.stage.toLowerCase()}>
                    {v.stage === 'Live' ? <i aria-hidden='true' /> : null}
                    {v.stage}
                  </span>
                </div>
                <div className='tv-info'>
                  <p className='tv-sector'>{v.sector}</p>
                  <h3>{v.name}</h3>
                  <p className='tv-pitch'>{v.pitch}</p>
                  <p className='tv-by'>{names}</p>
                  <div className='tv-links'>
                    <a href={href('/ventures/' + v.id)}>
                      Full story <ArrowRight size={15} />
                    </a>
                    {site ? (
                      <a href={site.url} target='_blank' rel='noopener noreferrer'>
                        {domainOf(site.url)} <ArrowUpRight size={15} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <span key={flicks} className={'tv-static' + (flicks ? ' flick' : '')} aria-hidden='true' />
            <span className='tv-lines' aria-hidden='true' />
            <span className='tv-glass' aria-hidden='true' />
          </div>

          <div className='tv-controls'>
            <button type='button' className='tv-btn' onClick={() => tune(channel - 1)} aria-label='Previous channel'>
              <ChevronLeft size={16} /> CH
            </button>
            <div className='tv-dial' role='group' aria-label='Channels'>
              {VENTURES.map((x, i) => (
                <button
                  key={x.id}
                  type='button'
                  aria-pressed={i === channel}
                  aria-label={'Channel ' + pad(i + 1) + ': ' + x.name}
                  onClick={() => tune(i)}
                  style={{ '--glow': SCENE_COLORS[x.id] || '#8a8f98' } as CSSProperties}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>
            <button type='button' className='tv-btn' onClick={() => tune(channel + 1)} aria-label='Next channel'>
              CH <ChevronRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
