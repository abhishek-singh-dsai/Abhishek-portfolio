'use client';

import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Asterisk } from 'lucide-react';
import { portfolio } from '@/data/portfolio';
import { prefersReducedMotion } from '@/lib/hooks';

gsap.registerPlugin(ScrollTrigger);

function Row({ hidden }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {portfolio.marquee.map((word, i) => (
        <Fragment key={i}>
          <span
            className={
              i % 2 === 0
                ? 'whitespace-nowrap px-7 font-display text-5xl font-extrabold tracking-[-0.02em] text-foreground/85 md:px-10 md:text-7xl'
                : 'whitespace-nowrap px-7 font-serif-display text-5xl font-medium italic leading-[1.2] text-foreground/60 md:px-10 md:text-7xl'
            }
          >
            {word}
          </span>
          <Asterisk className="size-6 shrink-0 text-muted-foreground/50 md:size-8" strokeWidth={1.5} aria-hidden="true" />
        </Fragment>
      ))}
    </div>
  );
}

/** Endless ticker. Scrolling speeds it up; scrolling back up reverses it. */
export default function Marquee() {
  const track = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const tween = gsap.to(track.current, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let dir = 1;
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        dir = self.direction;
        const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
        gsap.to(tween, { timeScale: dir * boost, duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.25, ease: 'power2.out' });
      },
    });
    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  return (
    <section aria-label="Specialties" className="border-y border-border/60 py-10 md:py-14">
      <p className="sr-only">{portfolio.marquee.join(', ')}</p>
      <div className="overflow-hidden" aria-hidden="true">
        <div ref={track} className="flex w-max will-change-transform">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
