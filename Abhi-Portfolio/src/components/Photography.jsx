'use client';

import { useState } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { portfolio } from '@/data/portfolio';
import { MaskHeading, Reveal } from './ui/Reveal';

const { photography } = portfolio;

// Resting and fanned-out poses for the three cards in the folder.
const POSES = [
  { closed: 'translate(-40px, 10px) rotate(-8deg)', open: 'translate(-150px, -150px) rotate(-14deg)' },
  { closed: 'translate(0px, -2px) rotate(0deg)', open: 'translate(0px, -185px) rotate(0deg)' },
  { closed: 'translate(40px, 10px) rotate(8deg)', open: 'translate(150px, -150px) rotate(14deg)' },
];

function PaperCard() {
  return (
    <svg viewBox="0 0 164 214" className="size-full drop-shadow-[0_10px_20px_rgb(0_0_0/.35)]" aria-hidden="true">
      <rect x="0.5" y="0.5" width="163" height="213" rx="20" fill="#F1F1F1" stroke="#E0E0E0" />
      <rect x="14" y="31" width="135" height="12" rx="6" fill="#D4D4D4" />
      {[61, 75, 89, 103, 117, 131, 145, 159].map((y) => (
        <g key={y}>
          <rect x="15" y={y} width="64" height="6" rx="3" fill="#D9D9D9" />
          <rect x="85" y={y} width="64" height="6" rx="3" fill="#D9D9D9" />
        </g>
      ))}
    </svg>
  );
}

export default function Photography() {
  const [open, setOpen] = useState(false);
  if (!photography.enabled) return null;
  const photos = photography.photos;
  const fan = photos.length ? photos.slice(0, 3) : [null, null, null];

  return (
    <section id="photography" className="scroll-mt-24 overflow-hidden py-16 md:py-24" aria-labelledby="photo-title">
      <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
        <MaskHeading
          id="photo-title"
          lines={[photography.title]}
          className="font-display text-4xl font-bold leading-[1.22] tracking-[-0.02em] md:text-5xl"
        />
        <Reveal>
          <p className="mt-5 max-w-[60ch] font-serif text-base leading-relaxed text-muted-foreground md:text-lg">{photography.intro}</p>
        </Reveal>

        <div className="flex justify-center pb-8 pt-44 sm:pb-12 sm:pt-56">
          <button
            type="button"
            aria-pressed={open}
            aria-label={open ? 'Close photo folder' : 'Open photo folder'}
            onClick={() => setOpen((o) => !o)}
            className="relative h-[189px] w-[225px] rounded-3xl outline-offset-8 [-webkit-tap-highlight-color:transparent] sm:h-[270px] sm:w-[321px]"
          >
            <span className="absolute left-1/2 top-1/2 block h-[270px] w-[321px] -translate-x-1/2 -translate-y-1/2 scale-[.7] sm:scale-100" style={{ perspective: 800 }}>
              {/* back panel */}
              <span className="absolute inset-0 rounded-[25px] bg-black shadow-[inset_0_0_6px_2px_rgb(255_255_255/.37)]" />
              {/* cards */}
              {fan.map((photo, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 -ml-[82px] -mt-[107px] block h-[214px] w-[164px] transition-transform duration-700 ease-[cubic-bezier(.34,1.4,.64,1)]"
                  style={{ transform: open ? POSES[i].open : POSES[i].closed, transitionDelay: `${open ? i * 50 : 0}ms`, zIndex: i === 1 ? 2 : 1 }}
                >
                  {photo ? (
                    <Image src={asset(photo.src)} alt="" width={328} height={428} className="size-full rounded-[20px] border-4 border-white object-cover shadow-xl" />
                  ) : (
                    <PaperCard />
                  )}
                </span>
              ))}
              {/* front flap */}
              <span
                className="absolute inset-x-[-10px] bottom-0 z-10 block h-[62%] origin-bottom transition-transform duration-500 ease-out-strong"
                style={{ transform: open ? 'rotateX(-38deg)' : 'rotateX(0deg)' }}
              >
                <svg viewBox="0 0 341 168" preserveAspectRatio="none" className="size-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#1c1c1f" stopOpacity=".78" />
                      <stop offset="1" stopColor="#060607" stopOpacity=".92" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 1h150c10 0 16 4 22 10l12 12c6 6 12 9 22 9h95c11 0 20 9 18 20l-18 96c-2 11-9 19-20 19H38c-11 0-18-8-20-19L1 22C-1 11 9 1 20 1Z"
                    fill="url(#flap)"
                    stroke="rgb(255 255 255 / .28)"
                  />
                </svg>
                <span className="absolute inset-0 rounded-b-[25px] backdrop-blur-[6px] [clip-path:inset(18%_4%_0_4%_round_0_0_25px_25px)]" />
              </span>
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground" aria-live="polite">
          {photos.length
            ? open
              ? 'Here is a small selection.'
              : 'Tap the folder to open it.'
            : 'Photos are on the way. Tap the folder to open it.'}
        </p>

        {open && photos.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {photos.map((p) => (
              <li key={p.src} className="initial-blur overflow-hidden rounded-2xl border border-border">
                <Image src={asset(p.src)} alt={p.alt} width={p.width} height={p.height} sizes="(min-width: 768px) 33vw, 50vw" className="aspect-[4/3] size-full object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
