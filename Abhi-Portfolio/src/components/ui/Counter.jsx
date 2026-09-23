'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useInView, prefersReducedMotion } from '@/lib/hooks';

const fmt = (n) => Math.round(n).toLocaleString('en-US');

/** Counts up from 0 when it scrolls into view. The final value is in the DOM from the start for SEO/AT. */
export default function Counter({ value, suffix = '', className = '' }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -10% 0px' });
  const numRef = useRef(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return undefined;
    const obj = { n: 0 };
    numRef.current.textContent = '0';
    const tween = gsap.to(obj, {
      n: value,
      duration: Math.min(2.2, 1 + value / 1500),
      ease: 'power3.out',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = fmt(obj.n);
      },
    });
    return () => tween.kill();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        <span ref={numRef} className="tabular-nums">{fmt(value)}</span>
        {suffix}
      </span>
      <span className="sr-only">{fmt(value)}{suffix}</span>
    </span>
  );
}
