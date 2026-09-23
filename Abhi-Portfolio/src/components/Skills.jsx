'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useReducedMotion } from '@/lib/hooks';
import { toolIcons } from '@/lib/toolIcons';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';

const { skills, skillsIntro, toolLogos } = portfolio;

const logos = toolLogos.map((k) => toolIcons[k]).filter(Boolean);
const isDarkHex = (hex) => {
  const n = parseInt(hex, 16);
  const l = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return l < 60;
};

function Chip({ label }) {
  return (
    <li className="chip text-sm font-medium" data-physics="chip">
      <span className="chip-inner">
        <span className="chip-face">{label}</span>
        <span className="chip-face back" aria-hidden="true">{label}</span>
      </span>
    </li>
  );
}

/**
 * Logos in round badges orbiting on two counter-rotating rings. Positions are set
 * from JS each frame so the "Drop them" physics can take over the same elements.
 */
function LogoRing() {
  const wrap = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    const nodes = [...el.querySelectorAll('[data-physics="logo"]')];
    const inner = Math.min(6, Math.floor(nodes.length / 3));
    let radius = 0;
    let angle = 0;
    let raf = 0;
    let hovering = false;

    const place = () => {
      nodes.forEach((n, i) => {
        const onInner = i < inner;
        const count = onInner ? inner : nodes.length - inner;
        const idx = onInner ? i : i - inner;
        const r = radius * (onInner ? 0.52 : 1);
        const a = (idx / count) * Math.PI * 2 + (onInner ? -angle * 1.4 : angle) + (onInner ? 0.3 : 0);
        n.style.transform = `translate3d(${Math.cos(a) * r}px, ${Math.sin(a) * r}px, 0)`;
      });
    };
    const measure = () => {
      radius = el.clientWidth / 2 - 34;
      place();
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (hovering || el.closest('.physics-on')) return;
      angle = (now / 1000) * 0.12;
      place();
    };
    const play = () => {
      if (!reduced && !raf) raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()));
    io.observe(el);
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    measure();
    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden="true">
      {/* orbit guides */}
      <span className="absolute inset-[34px] rounded-full border border-dashed border-border" />
      <span className="absolute inset-[26%] rounded-full border border-dashed border-border/70" />
      <span className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-g2/20 blur-2xl" />
      {logos.map((icon) => (
        <span
          key={icon.slug}
          data-physics="logo"
          title={icon.title}
          className="absolute left-1/2 top-1/2 -ml-6 -mt-6 flex size-12 items-center justify-center rounded-full border border-border bg-card/80 shadow-[0_8px_24px_-12px_rgb(0_0_0/.5)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-foreground/30"
        >
          <svg viewBox="0 0 24 24" className="size-6" style={{ color: isDarkHex(icon.hex) ? 'rgb(var(--foreground))' : `#${icon.hex}` }} fill="currentColor">
            <path d={icon.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Lets every chip and logo fall into a pile you can drag around. Matter.js loads on first use. */
function usePhysics(containerRef) {
  const state = useRef(null);
  const [active, setActive] = useState(false);

  const stop = useCallback(() => {
    const s = state.current;
    if (!s) return;
    cancelAnimationFrame(s.raf);
    s.cleanup();
    s.items.forEach(({ el, orig }) => {
      el.style.cssText = orig;
    });
    containerRef.current.style.height = '';
    containerRef.current.classList.remove('physics-on');
    state.current = null;
    setActive(false);
  }, [containerRef]);

  const start = useCallback(async () => {
    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = (await import('matter-js')).default;
    const box = containerRef.current;
    const rect = box.getBoundingClientRect();
    const els = [...box.querySelectorAll('[data-physics]')].filter((el) => el.offsetWidth > 0);
    // Body coordinates live in the container's space; CSS offsets in each element's offsetParent.
    const measured = els.map((el) => {
      const r = el.getBoundingClientRect();
      const p = (el.offsetParent || box).getBoundingClientRect();
      return { el, orig: el.style.cssText, x: r.left - rect.left, y: r.top - rect.top, ox: r.left - p.left, oy: r.top - p.top, w: r.width, h: r.height };
    });

    box.style.height = `${rect.height}px`;
    box.classList.add('physics-on');
    const engine = Engine.create({ gravity: { y: 1.1 } });
    const W = rect.width;
    const H = rect.height;
    const wall = { isStatic: true };
    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, H + 50, W * 3, 100, wall),
      Bodies.rectangle(-50, H / 2, 100, H * 4, wall),
      Bodies.rectangle(W + 50, H / 2, 100, H * 4, wall),
    ]);

    const items = measured.map((m) => {
      const round = m.el.dataset.physics === 'logo';
      const body = round
        ? Bodies.circle(m.x + m.w / 2, m.y + m.h / 2, m.w / 2, { restitution: 0.35, friction: 0.2 })
        : Bodies.rectangle(m.x + m.w / 2, m.y + m.h / 2, m.w, m.h, { chamfer: { radius: m.h / 2 }, restitution: 0.25, friction: 0.3 });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: Math.random() * -2 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
      Object.assign(m.el.style, {
        position: 'absolute', left: `${m.ox}px`, top: `${m.oy}px`, width: `${m.w}px`, height: `${m.h}px`,
        margin: '0', zIndex: '5', willChange: 'transform', animation: 'none', cursor: 'grab',
      });
      return { ...m, body, cx: m.x + m.w / 2, cy: m.y + m.h / 2 };
    });
    Composite.add(engine.world, items.map((i) => i.body));

    // Drag with a mouse; touch keeps normal page scrolling.
    let cleanup = () => {};
    if (window.matchMedia('(pointer: fine)').matches) {
      const mouse = Mouse.create(box);
      const el = mouse.element;
      el.removeEventListener('wheel', mouse.mousewheel);
      el.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      el.removeEventListener('touchmove', mouse.mousemove);
      el.removeEventListener('touchstart', mouse.mousedown);
      el.removeEventListener('touchend', mouse.mouseup);
      Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } }));
      cleanup = () => {
        el.removeEventListener('mousemove', mouse.mousemove);
        el.removeEventListener('mousedown', mouse.mousedown);
        el.removeEventListener('mouseup', mouse.mouseup);
      };
    }

    const s = { items, raf: 0, cleanup: () => { cleanup(); Engine.clear(engine); } };
    const tick = () => {
      Engine.update(engine, 1000 / 60);
      for (const it of items) {
        const { x, y } = it.body.position;
        it.el.style.transform = `translate3d(${x - it.cx}px, ${y - it.cy}px, 0) rotate(${it.body.angle}rad)`;
      }
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    state.current = s;
    setActive(true);
  }, [containerRef]);

  useEffect(() => () => state.current && stop(), [stop]);
  return { active, start, stop };
}

export default function Skills() {
  const box = useRef(null);
  const reduced = useReducedMotion();
  const { active, start, stop } = usePhysics(box);

  return (
    <section id="skills" className="scroll-mt-24 py-24 md:py-36" aria-labelledby="skills-title">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 id="skills-title" className="font-display text-2xl font-semibold tracking-tight">Tools I think in</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">{skillsIntro}</p>
        </Reveal>

        <div ref={box} className="relative mt-10 grid gap-10 md:grid-cols-12">
          <div className="space-y-7 md:col-span-7">
            {skills.map((g, gi) => (
              <Reveal key={`${g.group}-${gi}`} delay={gi * 40}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{g.group}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((item, i) => (
                    <Chip key={`${item}-${i}`} label={item} />
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          {logos.length > 0 && (
            <div className="md:col-span-5 md:flex md:items-center">
              <LogoRing />
            </div>
          )}
        </div>

        {!reduced && (
          <div className="mt-10">
            <Button
              variant="outline"
              size="sm"
              onClick={active ? stop : start}
              aria-pressed={active}
              className="!h-8 !px-4 text-[13px]"
            >
              {active ? 'Reset' : (<>Drop them <span aria-hidden="true">💥</span></>)}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
