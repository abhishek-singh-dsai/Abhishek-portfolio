import { ArrowUpRight, Box, Camera, Cpu, Gamepad2, Music, Palette, PenLine, Trophy } from 'lucide-react';
import { portfolio } from '@/data/portfolio';
import { MaskHeading, Reveal } from './ui/Reveal';

const iconMap = { PenLine, Trophy, Cpu, Camera, Music, Palette, Gamepad2, Box };
const { creative } = portfolio;

function Card({ card }) {
  const Icon = iconMap[card.icon] ?? PenLine;
  const inner = (
    <>
      <span className="inline-flex text-foreground/90 transition-transform duration-300 ease-out-strong group-hover:-rotate-6 group-hover:scale-110">
        <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="mt-5 flex items-center gap-1.5 font-display text-lg font-bold tracking-tight">
        {card.title}
        {card.href && (
          <ArrowUpRight
            className="size-4 opacity-50 transition-[opacity,transform] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:opacity-100"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground/80">{card.meta}</p>
    </>
  );
  const cls = 'group block h-full rounded-2xl border border-border/80 bg-gradient-to-br from-g2/[0.07] to-transparent p-6';
  return card.href ? (
    <a href={card.href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-colors duration-300 hover:border-foreground/25`}>
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function Creative() {
  return (
    <section id="creative" className="relative isolate scroll-mt-24 overflow-hidden py-24 md:py-36" aria-labelledby="creative-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 size-[36rem] rounded-full bg-g2/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-60 bottom-0 -z-10 size-[30rem] rounded-full bg-g3/[0.06] blur-3xl"
      />
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <MaskHeading
          id="creative-title"
          lines={[creative.title]}
          className="font-display text-4xl font-bold leading-[1.22] tracking-[-0.02em] md:text-5xl"
        />
        <Reveal>
          <p className="mt-5 max-w-[60ch] font-serif text-base leading-relaxed text-muted-foreground md:text-lg">{creative.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creative.cards.map((c, i) => (
            <Reveal as="li" key={i} delay={i * 70} className="h-full">
              <Card card={c} />
            </Reveal>
          ))}
        </ul>

        {creative.articles.length > 0 && (
        <Reveal className="mt-16">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{creative.articlesTitle}</h3>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {creative.articles.map((a) => (
              <li key={a.url}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 py-5 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="font-display text-[15px] font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground md:text-base">
                    <span className="bg-gradient-to-r from-g2 to-g3 bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-strong group-hover:bg-[length:100%_1px]">
                      {a.title}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    {a.date} · {a.readTime}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        )}
      </div>
    </section>
  );
}
