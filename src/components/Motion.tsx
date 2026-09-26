import { Children, isValidElement } from 'react';
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
