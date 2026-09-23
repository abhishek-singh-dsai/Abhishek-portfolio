'use client';

import { useRef } from 'react';
import { portfolio } from '@/data/portfolio';
import { sections } from '@/lib/sections';
import { socials } from '@/lib/socials';
import { Reveal } from './ui/Reveal';

const { personal, footerCorners } = portfolio;

/** macOS-style dock: icons swell as the pointer approaches. */
function Dock() {
  const ref = useRef(null);
  const onMove = (e) => {
    ref.current.querySelectorAll('[data-dock]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      el.style.setProperty('--s', String(1 + Math.max(0, 1 - d / 140) * 0.35));
    });
  };
  const onLeave = () => ref.current.querySelectorAll('[data-dock]').forEach((el) => el.style.setProperty('--s', '1'));

  return (
    <ul
      ref={ref}
      onPointerMove={(e) => e.pointerType === 'mouse' && onMove(e)}
      onPointerLeave={onLeave}
      className="glass mx-auto flex w-fit items-end gap-2.5 rounded-[2.5rem] p-3 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)] sm:gap-3 sm:p-4"
      aria-label="Social links"
    >
      {socials.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            data-dock
            aria-label={label}
            {...(href.startsWith('mailto:') || href === '#' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="flex size-14 origin-bottom scale-[var(--s,1)] items-center justify-center rounded-full border border-border bg-gradient-to-b from-foreground/[0.14] to-foreground/[0.02] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[transform,background-color] duration-150 ease-out hover:from-foreground/[0.22] motion-reduce:!scale-100 sm:size-[4.25rem]"
          >
            <Icon className="size-7 sm:size-9" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [tl, tr, bl, br] = footerCorners;
  return (
    <footer className="border-t border-border/70 pb-10 pt-20 md:pt-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal className="relative px-3" aria-hidden="true">
          {footerCorners.length > 0 && (
          <div className="hidden justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:flex">
            <span>{tl}</span>
            <span>{tr}</span>
          </div>
          )}
          <p className="text-gradient-soft whitespace-nowrap py-2 text-center font-display text-[clamp(2.25rem,10.5vw,9.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            {personal.name}
          </p>
          {footerCorners.length > 2 && (
          <div className="hidden justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:flex">
            <span>{bl}</span>
            <span>{br}</span>
          </div>
          )}
        </Reveal>

        {socials.length > 0 && (
          <div className="mt-14">
            <Dock />
          </div>
        )}

        <nav aria-label="Footer" className="mt-14 flex justify-center">
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="nav-link text-base font-medium md:text-lg text-muted-foreground transition-colors hover:text-foreground">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {(personal.email || personal.phone || personal.location) && (
          <address className="mt-10 flex flex-col items-center gap-2 text-sm not-italic text-muted-foreground sm:flex-row sm:justify-center sm:gap-6">
            {[
              personal.email && <a key="e" href={`mailto:${personal.email}`} className="hover:text-foreground">{personal.email}</a>,
              personal.phone && <a key="p" href={`tel:${personal.phone.replace(/\s/g, '')}`} className="hover:text-foreground">{personal.phone}</a>,
              personal.location && <span key="l">{personal.location}</span>,
            ]
              .filter(Boolean)
              .flatMap((item, i) => (i ? [<span key={`d${i}`} aria-hidden="true" className="hidden sm:inline">·</span>, item] : [item]))}
          </address>
        )}

        <div className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground md:text-[15px]">
          © {year} {personal.name}{personal.location ? `, ${personal.location}` : ''}
          <span role="img" aria-label="love" className="ml-1.5">❤️</span>
        </div>
      </div>
    </footer>
  );
}
