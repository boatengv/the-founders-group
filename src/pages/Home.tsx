import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Handshake, LineChart, Target, Wrench } from 'lucide-react';
import { FOUNDERS, GROUP, MOMENTS, PERKS, VENTURES, liveProductCount, numberWord } from '../data';
import { href } from '../router';
import { HeroMedia, PhotoBand } from '../components/Scene';
import { EASE, Reveal, ScrollWords, StaggerGrid } from '../components/Motion';
import { Section } from '../components/Layout';
import { FounderCard, VentureCard } from '../components/Cards';
import { Dispatch } from '../components/Dispatch';

const PERK_ICONS = [Handshake, Target, Wrench, LineChart];

function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || value < 2) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setShown(Math.max(1, Math.round(value * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{String(shown).padStart(2, '0')}</>;
}

export function Home() {
  const thisYear = String(new Date().getFullYear());
  const stats = [
    { label: 'Founders', value: FOUNDERS.length },
    { label: 'Ventures', value: VENTURES.length },
    { label: 'Live products', value: liveProductCount() },
    { label: 'Moments in ' + thisYear, value: MOMENTS.filter(m => m.month.startsWith(thisYear)).length },
  ];

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const mediaFade = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const lines = [
    { text: numberWord(FOUNDERS.length) + ' founders.', accent: false },
    { text: numberWord(VENTURES.length) + ' ventures.', accent: false },
    { text: 'One standard.', accent: true },
  ];

  return (
    <>
      <section className='hero' ref={heroRef}>
        <HeroMedia fade={mediaFade} />
        <motion.div className='hero-copy' style={{ y: copyY, opacity: copyFade }}>
          <motion.p
            className='eyebrow'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          >
            {GROUP.name} · By application only
          </motion.p>
          <h1>
            {lines.map((line, i) => (
              <span key={line.text} className='line'>
                <motion.span
                  className={line.accent ? 'accent' : undefined}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.12 }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className='lede'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          >
            A small, selective group of founders building real businesses. We trade intros, tools and honest
            accountability, and we show our work.
          </motion.p>
          <motion.div
            className='hero-cta'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.72 }}
          >
            <a className='btn btn-accent btn-lg' href={href('/apply')}>
              Apply to join <ArrowRight size={18} />
            </a>
            <a className='btn btn-ghost btn-lg' href={href('/investors')}>
              For investors
            </a>
          </motion.div>
        </motion.div>
        <motion.dl
          className='stats'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
        >
          {stats.map(s => (
            <div key={s.label}>
              <dd>
                <CountUp value={s.value} />
              </dd>
              <dt>{s.label}</dt>
            </div>
          ))}
        </motion.dl>
      </section>

      <Dispatch />

      <Section
        id='ventures'
        eyebrow='Ventures'
        title='Built by members'
        action={
          <a className='link-arrow' href={href('/ventures')}>
            All ventures <ArrowRight size={16} />
          </a>
        }
      >
        <StaggerGrid className='vgrid'>
          {VENTURES.map(v => (
            <VentureCard key={v.id} venture={v} />
          ))}
        </StaggerGrid>
      </Section>

      <Section
        id='founders'
        eyebrow='Founders'
        title='The people behind them'
        action={
          <a className='link-arrow' href={href('/founders')}>
            All founders <ArrowRight size={16} />
          </a>
        }
      >
        <StaggerGrid className='fgrid'>
          {FOUNDERS.map(f => (
            <FounderCard key={f.id} founder={f} />
          ))}
        </StaggerGrid>
      </Section>

      <PhotoBand />

      <Section id='membership' eyebrow='Membership' title='What members get'>
        <StaggerGrid className='perks'>
          {PERKS.map((p, i) => {
            const Icon = PERK_ICONS[i % PERK_ICONS.length];
            return (
              <div className='perk' key={p.title}>
                <Icon size={22} aria-hidden='true' />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            );
          })}
        </StaggerGrid>
      </Section>

      <Reveal>
      <section className='band'>
        <div>
          <p className='eyebrow'>For investors</p>
          <h2>
            <ScrollWords text='Founder-led ventures, most already live.' />
          </h2>
          <p>See the whole portfolio in one place, and ask for an introduction to the founders you want to meet.</p>
        </div>
        <a className='btn btn-light btn-lg' href={href('/investors')}>
          See the portfolio <ArrowRight size={18} />
        </a>
      </section>
      </Reveal>

      <Reveal>
      <section className='closing'>
        <h2>
          <ScrollWords text='Building something real?' />
        </h2>
        <p>Membership is by application. Tell us what you are building and your biggest moment so far.</p>
        <a className='btn btn-accent btn-lg' href={href('/apply')}>
          Apply to join <ArrowRight size={18} />
        </a>
      </section>
      </Reveal>
    </>
  );
}
