import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import '../chapters.css';

const pad = (n: number) => String(n).padStart(2, '0');

// One full-screen "page" of the home page. It pins under the nav once its end
// is on screen (a tall chapter scrolls through first), and the next chapter
// slides up over it while it sinks back and darkens, so moving on feels like
// turning to a new page rather than scrolling a long one.
export function Chapter({
  n,
  total,
  next,
  pin = true,
  className,
  children,
}: {
  n?: number;
  total?: number;
  next?: string;
  pin?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cover = useMotionValue(0);
  const scale = useTransform(cover, [0, 1], [1, 0.93]);
  const shade = useTransform(cover, [0, 1], [0, 0.72]);
  const still = reduce || !pin;

  useEffect(() => {
    const el = ref.current;
    if (!el || !pin) return;
    const root = document.documentElement;
    let navH = 0;
    const fit = () => {
      const nav = document.querySelector<HTMLElement>('.nav');
      navH = nav ? nav.offsetHeight : 0;
      root.style.setProperty('--nav-h', navH + 'px');
      el.style.top = Math.min(navH, window.innerHeight - el.offsetHeight) + 'px';
      track();
    };
    // How far the next chapter has risen over this one, from 0 to 1.
    const track = () => {
      const after = el.nextElementSibling as HTMLElement | null;
      if (!after) return;
      const room = Math.max(1, window.innerHeight - navH);
      const top = after.getBoundingClientRect().top - navH;
      cover.set(Math.min(1, Math.max(0, 1 - top / room)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('resize', fit);
    window.addEventListener('scroll', track, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
      window.removeEventListener('scroll', track);
    };
  }, [pin, cover]);

  return (
    <motion.div
      ref={ref}
      className={'chapter' + (pin ? ' pinned' : '') + (className ? ' ' + className : '')}
      style={still ? undefined : { scale }}
    >
      {n && total ? (
        <div className='chapter-mark' aria-hidden='true'>
          <span>
            {pad(n)} / {pad(total)}
          </span>
          {next ? <span>Next · {next} ↓</span> : null}
        </div>
      ) : null}
      {children}
      {still ? null : <motion.div className='chapter-shade' style={{ opacity: shade }} aria-hidden='true' />}
    </motion.div>
  );
}
