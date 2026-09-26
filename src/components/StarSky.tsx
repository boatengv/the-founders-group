import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; layer: number; speed: number; phase: number };

// Same three tones the hero used: white, cool blue and a warm star.
const tones = (light: boolean) => (light ? ['#3d424a', '#6f747c', '#b0561c'] : ['#ffffff', '#cfd8ff', '#ffd2ad']);
const SIZES = [1.1, 1.5, 1.8];
const BASE = [0.7, 0.5, 0.5];
// Mostly white, fewer blue, only a few warm ones.
const SHARE = [1, 0.6, 0.3];
// How far each layer drifts per pixel scrolled, so the sky has depth.
const DEPTH = [0.03, 0.06, 0.1];

function sprite(color: string, size: number, dpr: number) {
  const px = Math.ceil(size * 4 * dpr);
  const c = document.createElement('canvas');
  c.width = c.height = px;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.18, color);
  g.addColorStop(0.45, color + '44');
  g.addColorStop(1, color + '00');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, px, px);
  return c;
}

// A fixed, twinkling starfield behind every page.
export function StarSky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas && canvas.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let sprites: HTMLCanvasElement[] = [];
    let raf = 0;

    const paint = () => {
      sprites = tones(isLight()).map((c, i) => sprite(c, SIZES[i], dpr));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const perLayer = Math.round((w * h) / 9000);
      stars = [];
      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < perLayer * SHARE[layer]; i++) {
          stars.push({ x: Math.random() * w, y: Math.random() * h, layer, speed: 0.5 + Math.random() * 1.2, phase: Math.random() * 6.3 });
        }
      }
      paint();
      draw(performance.now() / 1000);
    };

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scroll = reduce ? 0 : window.scrollY;
      for (const s of stars) {
        const img = sprites[s.layer];
        const size = img.width;
        let y = (s.y - scroll * DEPTH[s.layer]) % h;
        if (y < 0) y += h;
        ctx.globalAlpha = reduce ? BASE[s.layer] * 0.8 : BASE[s.layer] * (0.55 + 0.45 * Math.sin(time * s.speed + s.phase));
        ctx.drawImage(img, s.x * dpr - size / 2, y * dpr - size / 2);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw(performance.now() / 1000);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    const themeWatch = new MutationObserver(() => {
      paint();
      draw(performance.now() / 1000);
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      themeWatch.disconnect();
    };
  }, []);

  return <canvas ref={ref} className='star-sky' aria-hidden='true' />;
}
