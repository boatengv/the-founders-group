import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Founder, Stage } from '../data';
import { VENTURES, founderById, monthLabel, ventureById } from '../data';
import { storiesFor } from '../stories';
import { href } from '../router';
import { Section } from '../components/Layout';
import { VentureCard } from '../components/Cards';
import { Avatar, Cover, StageChip } from '../components/Visuals';
import { Reveal, StaggerGrid } from '../components/Motion';

const STAGES: Array<Stage | 'All'> = ['All', 'Live', 'Launching', 'Stealth'];

export function Ventures() {
  const [stage, setStage] = useState<Stage | 'All'>('All');
  const shown = VENTURES.filter(v => stage === 'All' || v.stage === stage);
  return (
    <>
      <section className='page-head'>
        <p className='eyebrow'>Ventures</p>
        <h1>Built by members</h1>
        <p className='lede'>Every venture in the group, from live businesses to launches still in stealth.</p>
      </section>
      <div className='chips' role='group' aria-label='Filter by stage'>
        {STAGES.map(s => {
          const count = s === 'All' ? VENTURES.length : VENTURES.filter(v => v.stage === s).length;
          return (
            <button key={s} type='button' className='chip' aria-pressed={stage === s} onClick={() => setStage(s)}>
              {s} <small>{count}</small>
            </button>
          );
        })}
      </div>
      <StaggerGrid key={stage} className='vgrid'>
        {shown.map(v => (
          <VentureCard key={v.id} venture={v} />
        ))}
      </StaggerGrid>
    </>
  );
}

export function VenturePage({ id }: { id: string }) {
  const v = ventureById(id);
  if (!v) {
    return (
      <section className='page-head'>
        <h1>Venture not found</h1>
        <p className='lede'>
          That venture is not in the group. <a href={href('/ventures')}>See all ventures</a>.
        </p>
      </section>
    );
  }
  const team = v.founders.map(fid => founderById(fid)).filter((f): f is Founder => !!f);
  const moments = storiesFor(v.id);

  return (
    <>
      <a className='back' href={href('/ventures')}>
        <ArrowLeft size={16} /> All ventures
      </a>
      <section className='vhero'>
        <Reveal>
          <Cover venture={v} large />
        </Reveal>
        <Reveal className='vhero-text' delay={0.12}>
          <div className='vhero-tags'>
            <StageChip stage={v.stage} />
            <span className='sector'>{v.sector}</span>
          </div>
          <h1>{v.name}</h1>
          <p className='lede'>{v.pitch}</p>
          {v.links.length ? (
            <div className='vlinks'>
              {v.links.map(l => (
                <a key={l.url} className='btn btn-ghost' href={l.url} target='_blank' rel='noopener noreferrer'>
                  {l.label} <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          ) : null}
        </Reveal>
      </section>

      <Section
        eyebrow='The Dispatch'
        title='Stories'
        action={
          moments.length ? (
            <a className='link-arrow' href={href('/stories?v=' + v.id)}>
              All {v.name} stories <ArrowRight size={16} />
            </a>
          ) : undefined
        }
      >
        {moments.length ? (
          <ol className='timeline'>
            {moments.map(m => (
              <li key={m.id}>
                <span className='moment-date'>{monthLabel(m.month)}</span>
                <p>
                  <a className='timeline-story' href={href('/stories/' + m.id)}>
                    {m.title}
                  </a>
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className='muted'>The first stories from {v.name} are on their way.</p>
        )}
      </Section>

      <Section eyebrow='Team' title={team.length > 1 ? 'Founders' : 'Founder'}>
        <StaggerGrid className='team'>
          {team.map(f => (
            <div key={f.id} className='team-member'>
              <Avatar founder={f} />
              <div>
                <h3>{f.name}</h3>
                <p className='muted'>{f.roles.join(' · ')}</p>
              </div>
            </div>
          ))}
        </StaggerGrid>
      </Section>

      <Section eyebrow='About' title={'About ' + v.name}>
        <div className='prose'>
          {v.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {v.stage !== 'Stealth' ? (
        <section className='band'>
          <div>
            <p className='eyebrow'>For investors</p>
            <h2>Interested in {v.name}?</h2>
            <p>Ask for an introduction and we will connect you with the founders.</p>
          </div>
          <a className='btn btn-light btn-lg' href={href('/investors?v=' + v.id) + '#intro'}>
            Request an intro
          </a>
        </section>
      ) : null}
    </>
  );
}
