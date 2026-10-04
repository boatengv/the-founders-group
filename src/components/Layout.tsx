import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { Reveal, ScrollProgress, ScrollWords, useSmoothScroll } from './Motion';
import { GROUP } from '../data';
import { StarSky } from './StarSky';
import { href } from '../router';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  try {
    return localStorage.getItem('fg-theme') === 'light' ? 'light' : 'dark';
  } catch (e) {
    return 'dark';
  }
}

const NAV = [
  { path: 'ventures', label: 'Ventures' },
  { path: 'founders', label: 'Founders' },
  { path: 'stories', label: 'Stories' },
  { path: 'investors', label: 'For investors' },
];

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [open, setOpen] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('fg-theme', theme);
    } catch (e) {
      // storage is optional
    }
  }, [theme]);

  useEffect(() => {
    setOpen(false);
  }, [current]);

  return (
    <MotionConfig reducedMotion='user'>
    <ScrollProgress />
    <StarSky />
      <header className='nav'>
        <a className='brand' href={href('/')}>
          <span className='brand-mark' aria-hidden='true' />
          {GROUP.short}
        </a>
        <nav className={'nav-links' + (open ? ' open' : '')} aria-label='Main'>
          {NAV.map(n => (
            <a key={n.path} href={href('/' + n.path)} aria-current={current === n.path ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
          <a className='btn btn-accent nav-apply' href={href('/apply')}>
            Apply
          </a>
        </nav>
        <div className='nav-tools'>
          <button
            type='button'
            className='icon-btn'
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type='button'
            className='icon-btn menu-btn'
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
    <div className='shell'>

      <main className='main'>{children}</main>

      <footer className='foot'>
        <div>
          <strong>{GROUP.name}</strong>
          <p>Founders building real businesses, together. Membership by application.</p>
        </div>
        <nav aria-label='Footer'>
          <a href={href('/ventures')}>Ventures</a>
          <a href={href('/founders')}>Founders</a>
          <a href={href('/stories')}>Stories</a>
          <a href={href('/investors')}>For investors</a>
          <a href={href('/apply')}>Apply</a>
          {import.meta.env.VITE_STATIC ? null : <a href={href('/admin')}>Admin</a>}
        </nav>
      </footer>
    </div>
    </MotionConfig>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  action,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className='section' id={id}>
      <Reveal className='section-head'>
        <div>
          {eyebrow ? <p className='eyebrow'>{eyebrow}</p> : null}
          <h2>
            <ScrollWords text={title} />
          </h2>
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  );
}
