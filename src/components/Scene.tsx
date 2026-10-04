import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { FOUNDERS, VENTURES } from '../data';
import '../scene.css';

// Each venture keeps its own colour in the network (and on its TV channel).
export const SCENE_COLORS: Record<string, string> = {
  'in-person-tutors': '#19b3a6',
  'fun-marketing': '#f5c518',
  adusanko: '#6c8cff',
  funeducate: '#a875ff',
  'synthetic-talent': '#e0306f',
  stealth: '#8a8f98',
};

// A slowly turning network of the group's real founders and ventures.
// Ventures sit on an inner ring in their own colours, founders orbit outside,
// and small sparks travel along each founder-venture link. Behind it sits a
// twinkling starfield with one north star, kept small and soft on purpose.
function startScene(el: HTMLDivElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return () => undefined;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 19);

  const group = new THREE.Group();
  scene.add(group);

  const disposables: Array<{ dispose: () => void }> = [];

  // Each venture keeps its own colour in the scene. Greys (none left today) are inverted on the light theme.
  const toned: Array<{ mat: THREE.Material & { color: THREE.Color }; base: THREE.Color }> = [];
  const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';
  const toneOf = (base: THREE.Color) => {
    const hsl = { h: 0, s: 0, l: 0 };
    base.getHSL(hsl);
    if (!isLight() || hsl.s > 0.1) return base.clone();
    const l = base.r * 0.3 + base.g * 0.59 + base.b * 0.11;
    const v = Math.max(0.08, 0.85 - l * 0.75);
    return new THREE.Color(v, v, v);
  };
  const tone = <M extends THREE.Material & { color: THREE.Color }>(mat: M, hex: string): M => {
    const base = new THREE.Color(hex);
    mat.color.copy(toneOf(base));
    toned.push({ mat, base });
    return mat;
  };
  const sceneColor = (id: string, fallback: string) => SCENE_COLORS[id] || fallback;
  const nodeGeo = new THREE.SphereGeometry(1, 32, 32);
  disposables.push(nodeGeo);

  // Ventures on a tilted inner ring.
  const venturePos = new Map<string, THREE.Vector3>();
  VENTURES.forEach((v, i) => {
    const a = (i / VENTURES.length) * Math.PI * 2;
    const p = new THREE.Vector3(Math.cos(a) * 3.2, Math.sin(a * 2) * 0.9, Math.sin(a) * 3.2);
    venturePos.set(v.id, p);
    const color = new THREE.Color(v.color);
    const core = tone(new THREE.MeshBasicMaterial({ color }), sceneColor(v.id, v.color));
    const halo = tone(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.14, depthWrite: false }), sceneColor(v.id, v.color));
    disposables.push(core, halo);
    const m = new THREE.Mesh(nodeGeo, core);
    m.scale.setScalar(0.24);
    m.position.copy(p);
    const h = new THREE.Mesh(nodeGeo, halo);
    h.scale.setScalar(0.55);
    h.position.copy(p);
    group.add(m, h);
  });

  // Founders outside their ventures, linked to each one they build.
  const cssColor = (name: string, fallback: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const founderMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(cssColor('--ink', '#f2f3f5')) });
  disposables.push(founderMat);
  type Spark = { from: THREE.Vector3; to: THREE.Vector3; mesh: THREE.Mesh; t: number; speed: number };
  const sparks: Spark[] = [];
  const sparkGeo = new THREE.SphereGeometry(1, 12, 12);
  disposables.push(sparkGeo);

  FOUNDERS.forEach((f, i) => {
    const centre = new THREE.Vector3();
    f.ventures.forEach(id => {
      const p = venturePos.get(id);
      if (p) centre.add(p);
    });
    centre.divideScalar(Math.max(1, f.ventures.length));
    const dir = centre.lengthSq() > 0.01 ? centre.clone().normalize() : new THREE.Vector3(1, 0, 0);
    const side = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
    const pos = dir
      .clone()
      .multiplyScalar(5.2)
      .add(side.multiplyScalar(i % 2 === 0 ? 1.1 : -1.1))
      .add(new THREE.Vector3(0, (i % 3) - 1, 0));
    const m = new THREE.Mesh(nodeGeo, founderMat);
    m.scale.setScalar(0.12);
    m.position.copy(pos);
    group.add(m);

    f.ventures.forEach((id, j) => {
      const v = VENTURES.find(x => x.id === id);
      const p = venturePos.get(id);
      if (!v || !p) return;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, p]);
      const lineMat = tone(new THREE.LineBasicMaterial({ color: new THREE.Color(v.color), transparent: true, opacity: 0.45 }), sceneColor(v.id, v.color));
      disposables.push(lineGeo, lineMat);
      group.add(new THREE.Line(lineGeo, lineMat));
      const sparkMat = tone(new THREE.MeshBasicMaterial({ color: new THREE.Color(v.color) }), sceneColor(v.id, v.color));
      disposables.push(sparkMat);
      const s = new THREE.Mesh(sparkGeo, sparkMat);
      s.scale.setScalar(0.05);
      group.add(s);
      sparks.push({ from: pos, to: p, mesh: s, t: ((i + j) * 0.37) % 1, speed: 0.0035 + ((i * 7 + j * 3) % 5) * 0.0007 });
    });
  });

  // Faint links between ventures that share a founder.
  const ringPoints = VENTURES.map(v => venturePos.get(v.id)!).concat([venturePos.get(VENTURES[0].id)!]);
  const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
  const ringMat = new THREE.LineBasicMaterial({ color: 0x9ba1ac, transparent: true, opacity: 0.12 });
  disposables.push(ringGeo, ringMat);
  group.add(new THREE.Line(ringGeo, ringMat));

  // Dust.
  const dustCount = 700;
  const dust = new Float32Array(dustCount * 3);
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < dustCount; i++) {
    const r = 4 + rand() * 7;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    dust[i * 3] = r * Math.sin(ph) * Math.cos(th);
    dust[i * 3 + 1] = r * Math.cos(ph) * 0.6;
    dust[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const dustMat = new THREE.PointsMaterial({ color: new THREE.Color(cssColor('--muted', '#9ba1ac')), size: 0.035, transparent: true, opacity: 0.55 });
  disposables.push(dustGeo, dustMat);
  scene.add(new THREE.Points(dustGeo, dustMat));

  // Soft round sprite for the stars.
  const makeTexture = (draw: (ctx: CanvasRenderingContext2D, n: number) => void, n = 64) => {
    const c = document.createElement('canvas');
    c.width = c.height = n;
    const ctx = c.getContext('2d')!;
    draw(ctx, n);
    const tex = new THREE.CanvasTexture(c);
    disposables.push(tex);
    return tex;
  };
  const glowTex = makeTexture((ctx, n) => {
    const g = ctx.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, n, n);
  });
  // Four-point flare for the north star.
  const flareTex = makeTexture((ctx, n) => {
    const h = n / 2;
    const beam = (w: number, len: number) => {
      const g = ctx.createLinearGradient(h - len, 0, h + len, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.5, 'rgba(255,255,255,1)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(h - len, h - w / 2, len * 2, w);
    };
    beam(n * 0.025, h);
    ctx.save();
    ctx.translate(h, h);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-h, -h);
    beam(n * 0.025, h);
    ctx.restore();
  }, 256);

  // The north star the ventures chase.
  const accent = () => new THREE.Color(cssColor('--accent', '#ff6a1a'));
  const northGlowMat = new THREE.SpriteMaterial({ map: glowTex, color: accent(), transparent: true, depthWrite: false, opacity: 0.5 });
  const northFlareMat = new THREE.SpriteMaterial({ map: flareTex, color: accent(), transparent: true, depthWrite: false, opacity: 0.55 });
  const northCoreMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffffff, transparent: true, depthWrite: false, opacity: 0.85 });
  disposables.push(northGlowMat, northFlareMat, northCoreMat);
  const north = new THREE.Group();
  const northGlow = new THREE.Sprite(northGlowMat);
  const northFlare = new THREE.Sprite(northFlareMat);
  const northCore = new THREE.Sprite(northCoreMat);
  northCore.scale.setScalar(0.36);
  if (isLight()) northCoreMat.color.copy(accent());
  north.add(northGlow, northFlare, northCore);
  scene.add(north);



  group.rotation.x = 0.35;

  const resize = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Fill the first screen: larger and to the right on wide screens,
    // centred and a little smaller on phones.
    const wide = w > 900;
    group.position.x = wide ? 3.6 : 0;
    group.position.y = wide ? -0.2 : 1.2;
    group.scale.setScalar(wide ? 1.35 : 0.95);
    if (wide) north.position.set(Math.min(13, 3.6 + camera.aspect * 4.2), 6.4, -5);
    else north.position.set(2.6, 8.2, -6);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  let targetX = 0;
  let targetY = 0;
  const onPointer = (e: PointerEvent) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.25;
  };
  window.addEventListener('pointermove', onPointer);

  // Follow the light and dark theme switch.
  const themeWatch = new MutationObserver(() => {
    founderMat.color.set(cssColor('--ink', '#f2f3f5'));
    dustMat.color.set(cssColor('--muted', '#9ba1ac'));
    northGlowMat.color.copy(accent());
    northFlareMat.color.copy(accent());
    if (isLight()) northCoreMat.color.copy(accent());
    else northCoreMat.color.set('#ffffff');
    toned.forEach(t => t.mat.color.copy(toneOf(t.base)));
    if (reduce) renderer.render(scene, camera);
  });
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  const io = new IntersectionObserver(entries => {
    visible = entries.some(en => en.isIntersecting);
  });
  io.observe(el);


  const sky = (time: number) => {
    const breathe = 1 + 0.04 * Math.sin(time * 1.4);
    northGlow.scale.setScalar(1.5 * breathe);
    northFlare.scale.setScalar(2.3 * breathe);
    northFlareMat.rotation = Math.sin(time * 0.25) * 0.2;
  };

  const step = () => {
    sky(performance.now() / 1000);
    group.rotation.y += 0.0016;
    group.rotation.x += (0.35 + targetY - group.rotation.x) * 0.04;
    scene.rotation.y += (targetX - scene.rotation.y) * 0.04;
    sparks.forEach(s => {
      s.t = (s.t + s.speed) % 1;
      s.mesh.position.lerpVectors(s.from, s.to, s.t);
    });
  };

  let frame = 0;
  const loop = () => {
    frame = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    step();
    renderer.render(scene, camera);
  };
  if (reduce) {
    sparks.forEach(s => s.mesh.position.lerpVectors(s.from, s.to, s.t));
    sky(0);
    renderer.render(scene, camera);
  } else {
    loop();
  }

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    io.disconnect();
    themeWatch.disconnect();
    window.removeEventListener('pointermove', onPointer);
    disposables.forEach(d => d.dispose());
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}

// Behind the home headline: an optional uploaded hero image, with the live
// founders network drawn over it.
export function HeroMedia({ fade }: { fade?: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState(true);
  const [video, setVideo] = useState(true);
  useEffect(() => {
    if (!ref.current) return;
    return startScene(ref.current);
  }, []);
  return (
    <motion.div
      className='hero-media'
      aria-hidden='true'
      style={fade ? { opacity: fade } : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
    >
      {photo ? <img className='hero-photo' src='./resources/hero.jpg' alt='' onError={() => setPhoto(false)} /> : null}
      {video ? (
        <video
          className='hero-photo'
          src='./resources/hero.mp4'
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideo(false)}
        />
      ) : null}
      <div className='hero-scene' ref={ref} />
    </motion.div>
  );
}

// A wide photo band that only appears once a collaboration photo is uploaded.
export function PhotoBand() {
  const [state, setState] = useState<'loading' | 'ok' | 'none'>('loading');
  if (state === 'none') return null;
  return (
    <figure className={'photo-band' + (state === 'ok' ? ' show' : '')}>
      <img
        src='./resources/collaboration.jpg'
        alt='Founders from the group working together'
        loading='lazy'
        onLoad={() => setState('ok')}
        onError={() => setState('none')}
      />
      <figcaption>Built side by side. Members trade intros, tools and honest feedback.</figcaption>
    </figure>
  );
}
