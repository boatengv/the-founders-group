import { Children, isValidElement, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import '../motion.css';

export const EASE = [0.22, 1, 0.36, 1] as const;

// Fades and lifts its content into place the first time it scrolls into view.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// A grid whose items rise in one after another.
export function StaggerGrid({
  className,
  children,
  list,
}: {
  className: string;
  children: ReactNode;
  list?: boolean;
}) {
  return (
    <motion.div
      className={className}
      role={list ? 'list' : undefined}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {Children.map(children, (child, i) => (
        <motion.div
          key={isValidElement(child) && child.key != null ? String(child.key) : i}
          className='stagger-item'
          role={list ? 'listitem' : undefined}
          variants={{
            hidden: { opacity: 0, y: 32, scale: 0.98 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// A thin accent bar across the top that fills as you scroll the page.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className='scroll-progress' style={{ scaleX }} aria-hidden='true' />;
}

// Venture names sliding past in a continuous band.
export function Marquee({ items }: { items: string[] }) {
  const row = items.concat(items, items, items);
  return (
    <div className='marquee' aria-hidden='true'>
      <div className='marquee-track'>
        {row.concat(row).map((t, i) => (
          <span key={i} className={i % 2 === 0 ? 'solid' : 'outline'}>
            {t}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

// Weighted wheel scrolling: the wheel moves a target and the page eases toward
// it each frame, so a flick glides to a stop instead of jumping in steps.
// Keyboard, scrollbar and touch stay native, and any outside jump (a route
// change, find-in-page) simply resyncs. Reduced motion and touch opt out.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduce || touch) return;
    const WEIGHT = 0.28; // seconds to close 63% of the gap; higher is heavier
    const root = document.documentElement;
    const clamp = (v: number) => Math.min(Math.max(v, 0), Math.max(0, root.scrollHeight - window.innerHeight));
    let running = false;
    let current = window.scrollY;
    let target = current;
    let settled = current;
    let prev = 0;
    let raf = 0;
    const sync = () => {
      current = target = settled = window.scrollY;
    };
    const scrollsItself = (node: EventTarget | null) => {
      for (let el = node instanceof Element ? node : null; el && el !== document.body; el = el.parentElement) {
        const y = getComputedStyle(el).overflowY;
        if ((y === 'auto' || y === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true;
      }
      return false;
    };
    const frame = (now: number) => {
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 1 / 60;
      prev = now;
      if (Math.abs(window.scrollY - settled) > 1) sync();
      target = clamp(target);
      current += (target - current) * (1 - Math.exp(-dt / WEIGHT));
      if (Math.abs(target - current) < 0.3) current = target;
      window.scrollTo(0, current);
      settled = window.scrollY;
      running = current !== target;
      if (running) raf = requestAnimationFrame(frame);
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY) || scrollsItself(e.target)) return;
      e.preventDefault();
      if (!running) sync();
      const unit = e.deltaMode === 1 ? 100 / 3 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = clamp(target + e.deltaY * unit);
      if (!running) {
        running = true;
        prev = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    root.classList.add('smooth-scroll');
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(raf);
      root.classList.remove('smooth-scroll');
    };
  }, []);
}
