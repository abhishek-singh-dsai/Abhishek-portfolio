'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolio } from '@/data/portfolio';
import { prefersReducedMotion } from '@/lib/hooks';
import GrainBackground from './GrainBackground';
import { ArrowBadge, Button, LinkButton } from './ui/Button';

gsap.registerPlugin(ScrollTrigger);

const { personal } = portfolio;

export default function Hero({ onOpenResume }) {
  const root = useRef(null);
  const bg = useRef(null);
  const content = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.hero-line > span');
      if (prefersReducedMotion()) return;
      gsap.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
      gsap.from('.hero-fade', { opacity: 0, y: 16, filter: 'blur(4px)', duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.45 });
      // Background drifts slower than the page; content lifts and fades away.
      gsap.to(bg.current, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(content.current, { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'center center', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative flex min-h-[100dvh] items-end overflow-hidden" aria-labelledby="hero-title">
      <div ref={bg} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 70% 10%, rgb(var(--g2) / .15) 0%, transparent 55%), radial-gradient(90% 70% at 20% 80%, rgb(var(--g3) / .13) 0%, transparent 60%), rgb(var(--background))',
          }}
        />
        <GrainBackground shape="wave" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-background" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(100% 90% at 22% 78%, rgb(var(--background) / .82), transparent 85%)' }}
      />

      <div ref={content} className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-32 md:px-8 md:pb-28">
        {personal.status && (
        <p className="hero-fade glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium text-foreground/90">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-status/50 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-status" />
          </span>
          {personal.status}
          <span aria-hidden="true">👋</span>
        </p>
        )}

        <h1
          id="hero-title"
          className="mt-7 text-balance font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
          aria-label={`${personal.name}, ${personal.headlineRole}`}
        >
          <span className="hero-line block overflow-clip pb-[0.06em]" aria-hidden="true">
            <span className="block">{personal.name}</span>
          </span>
          <span className="hero-line block overflow-clip pb-[0.06em]" aria-hidden="true">
            <span className="text-gradient block pb-2 pl-[0.04em]">{personal.headlineRole}</span>
          </span>
        </h1>

        <p className="hero-fade mt-6 max-w-[44ch] text-pretty text-base leading-relaxed text-foreground/85 md:text-lg">
          {personal.intro}
        </p>

        <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
          <LinkButton href="#contact" variant="primary" size="lg" className="group gap-3 !pl-6 !pr-2">
            Get in touch <ArrowBadge />
          </LinkButton>
          {onOpenResume && (
            <Button variant="orbit" size="lg" onClick={onOpenResume} aria-haspopup="dialog" className="font-semibold">
              Resume
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
