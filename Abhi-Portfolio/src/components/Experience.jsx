'use client';

import { useState } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { portfolio } from '@/data/portfolio';
import { experienceHeading } from '@/lib/sections';
import Counter from './ui/Counter';
import Dialog from './ui/Dialog';
import { MaskHeading, Reveal } from './ui/Reveal';

const { experience, education, certifications, stats } = portfolio;

function Bullet({ i }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[0.7em] h-px w-5 shrink-0 ${i < 2 ? 'bg-foreground/40' : 'bg-gradient-to-r from-g2 to-g3'}`}
    />
  );
}

function CardLabel({ children }) {
  return <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{children}</h3>;
}

export default function Experience() {
  const [cert, setCert] = useState(null);
  const [certOpen, setCertOpen] = useState(false);
  const [primary, ...schools] = education;

  return (
    <section id="experience" className="scroll-mt-24 py-24 md:py-36" aria-labelledby="experience-title">
      <div className="mx-auto w-full max-w-4xl px-5 md:px-8">
        <MaskHeading
          id="experience-title"
          lines={[experienceHeading]}
          className="font-display text-4xl font-bold leading-[1.22] tracking-[-0.02em] md:text-5xl"
        />

        <div className="mt-14 space-y-10">
          {experience.map((job, ji) => (
            <Reveal key={ji}>
              <article className="glass rounded-3xl p-7 md:p-9">
                <header className="flex flex-col gap-1.5 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{job.role}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {[job.company, job.location].filter(Boolean).join(', ')} · {job.period}
                  </p>
                </header>
                <ul className="mt-6 space-y-3">
                  {job.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                      <Bullet i={i} />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}

          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="h-full">
              <article className="h-full rounded-3xl border border-border bg-foreground/[0.02] p-6">
                <CardLabel>Education</CardLabel>
                <p className="mt-4 font-display text-base font-bold tracking-tight">{primary.degree}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {primary.institution}, {primary.period}
                </p>
                {primary.score && <p className="mt-2 text-sm font-medium text-foreground/85">{primary.score}</p>}
                {schools.length > 0 && (
                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {schools.map((s) => (
                    <li key={`${s.degree}-${s.period}`} className="flex items-baseline justify-between gap-4 text-sm">
                      <span>
                        <span className="font-semibold">{s.degree}</span>
                        <span className="text-muted-foreground"> · {s.institution}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {[s.period, s.score].filter(Boolean).join(' · ')}
                      </span>
                    </li>
                  ))}
                </ul>
                )}
              </article>
            </Reveal>

            <Reveal className="h-full" delay={80}>
              <article className="h-full rounded-3xl border border-border bg-foreground/[0.02] p-6">
                <CardLabel>Certifications</CardLabel>
                {certifications.some((c) => c.image) && (
                  <p className="mt-2 text-xs text-muted-foreground">Select one to view the certificate.</p>
                )}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {certifications.map((c) => (
                    <li key={c.id}>
                      {c.image ? (
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          onClick={() => {
                            setCert(c);
                            setCertOpen(true);
                          }}
                          className="rounded-full bg-muted px-3.5 py-1 text-left text-[13px] font-semibold text-foreground/90 transition-colors duration-200 hover:bg-foreground hover:text-background"
                        >
                          {c.title}
                        </button>
                      ) : (
                        <span className="inline-block rounded-full border border-dashed border-border px-3.5 py-1 text-[13px] font-medium text-muted-foreground">
                          {c.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>

          {stats.length > 0 && (
          <Reveal>
            <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse gap-1 p-6 md:p-7 ${i % 2 === 1 ? 'border-l border-border' : ''} ${i >= 2 ? 'border-t border-border md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}
                >
                  <dt className="text-xs leading-snug text-muted-foreground">{s.label}</dt>
                  <dd className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          )}
        </div>
      </div>

      <Dialog open={certOpen} onClose={() => setCertOpen(false)} labelledBy="cert-title" className="p-6 md:p-7">
        {cert && (
          <>
            <h2 id="cert-title" className="pr-10 font-display text-xl font-bold tracking-tight">{cert.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {cert.issuer}
              {cert.date ? ` · ${cert.date}` : ''}
            </p>
            <Image
              src={asset(cert.image)}
              alt={`${cert.title} certificate issued to ${portfolio.personal.name} by ${cert.issuer}`}
              width={cert.width || 1000}
              height={cert.height || 707}
              className="mt-5 h-auto w-full rounded-2xl bg-white"
            />
          </>
        )}
      </Dialog>
    </section>
  );
}
