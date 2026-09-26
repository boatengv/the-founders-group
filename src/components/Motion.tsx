import { Children, isValidElement, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { MotionValue } from 'motion/react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import '../motion.css';

export const EASE = [0.22, 1, 0.36, 1] as const;

// Scenes come in the way they do on a film site: blurred and a little low,
// then settling into focus once 12% is on screen. They reset only after
// leaving the screen entirely, remembering which edge they left by, so
// scrolling back up plays them in again from above.
function useScene<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in-view');
      return;
    }
    const enter = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.classList.add('in-view');
      },
      { threshold, rootMargin: '0px 0px -25px 0px' },
    );
    const exit = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) return;
        el.classList.remove('in-view');
        el.classList.toggle('from-above', e.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    enter.observe(el);
    exit.observe(el);
    return () => {
      enter.disconnect();
      exit.disconnect();
    };
  }, [threshold]);
  return ref;
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useScene<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={'reveal' + (className ? ' ' + className : '')}
      style={delay ? { transitionDelay: delay + 's' } : undefined}
    >
      {children}
    </div>
  );
}

// A grid whose items come into focus one after another.
export function StaggerGrid({
  className,
  children,
  list,
}: {
  className: string;
  children: ReactNode;
  list?: boolean;
}) {
  const ref = useScene<HTMLDivElement>(0.05);
  return (
    <div ref={ref} className={className + ' stagger'} role={list ? 'list' : undefined}>
      {Children.map(children, (child, i) => (
        <div
          key={isValidElement(child) && child.key != null ? String(child.key) : i}
          className='stagger-item'
          role={list ? 'listitem' : undefined}
          style={{ '--i': i } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// A headline that reads itself in: each word brightens and sharpens in turn
// as the line travels up the screen, and dims again on the way back.
export function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.6'] });
  if (reduce) return <>{text}</>;
  const words = text.split(' ');
  return (
    <span ref={ref} className='scroll-words' aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length}>
          {w}
        </Word>
      ))}
    </span>
  );
}

function Word({
  progress,
  from,
  to,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  children: string;
}) {
  const opacity = useTransform(progress, [from, to], [0.16, 1]);
  const filter = useTransform(progress, [from, to], ['blur(6px)', 'blur(0px)']);
  return (
    <>
      <motion.span aria-hidden='true' style={{ opacity, filter }}>
        {children}
      </motion.span>{' '}
    </>
  );
}

// A thin accent bar across the top that fills as you scroll the page.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className='scroll-progress' style={{ scaleX }} aria-hidden='true' />;
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
