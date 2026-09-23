import { Fragment } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '@/data/portfolio';
import { GitHubIcon } from './icons';
import { LinkButton } from './ui/Button';
import { Eyebrow, MaskHeading, Reveal } from './ui/Reveal';

const hostOf = (url) => (url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Architecture drawn from the repo README: stacked rows joined by connectors. */
function FlowVisual({ visual, title }) {
  return (
    <figure className="flex aspect-[16/10] flex-col justify-center gap-0 bg-[radial-gradient(90%_80%_at_50%_0%,rgb(var(--g2)/.12),transparent_70%)] px-5 py-6 sm:px-10">
      <figcaption className="sr-only">{`${title}: ${visual.label}. ${visual.rows.map((r) => r.join(' and ')).join(', then ')}.`}</figcaption>
      {visual.rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <div className="flex justify-center" aria-hidden="true">
              <span className="h-3 w-px bg-gradient-to-b from-g2/70 to-g3/70 sm:h-4" />
            </div>
          )}
          <div className="flex justify-center gap-2 sm:gap-3" aria-hidden="true">
            {row.map((node, ni) => {
              const [name, detail] = node.split(' · ');
              return (
                <div
                  key={`${node}-${ni}`}
                  className="min-w-0 max-w-[16rem] flex-1 rounded-lg border border-border bg-foreground/[0.04] px-2.5 py-1.5 text-center sm:rounded-xl sm:px-3 sm:py-2"
                >
                  <p className="truncate font-display text-[11px] font-semibold text-foreground sm:text-[13px]">{name}</p>
                  {detail && <p className="truncate text-[9px] text-muted-foreground sm:text-[11px]">{detail}</p>}
                </div>
              );
            })}
          </div>
        </Fragment>
      ))}
      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70" aria-hidden="true">
        {visual.label}
      </p>
    </figure>
  );
}

function TreeVisual({ visual, title }) {
  return (
    <figure className="flex aspect-[16/10] flex-col justify-center bg-[radial-gradient(90%_80%_at_50%_0%,rgb(var(--g3)/.12),transparent_70%)] px-5 py-6 sm:px-10">
      <pre
        className="overflow-hidden font-mono text-[10px] leading-relaxed text-foreground/85 sm:text-[13px]"
        aria-label={`${title}: ${visual.label}`}
      >
        {visual.lines.map((line, li) => {
          const [code, comment] = line.split('#');
          return (
            <span key={li} className="block">
              {code}
              {comment && <span className="text-muted-foreground/70">#{comment}</span>}
            </span>
          );
        })}
      </pre>
      <figcaption className="mt-4 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">{visual.label}</figcaption>
    </figure>
  );
}

function BrowserFrame({ project }) {
  const addr = hostOf(project.liveUrl || project.githubUrl);
  return (
    <div className="group rounded-[1.75rem] border border-border/80 bg-foreground/[0.035] p-2 shadow-[0_24px_60px_-32px_rgb(0_0_0/0.35)]">
      <div className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-card">
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-2.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="ml-3 hidden truncate text-[11px] text-muted-foreground/70 sm:block">{addr}</span>
        </div>
        <div className="overflow-hidden">
          <div className="transition-transform duration-700 ease-out-strong group-hover:scale-[1.02]">
            {project.image ? (
              <Image
                src={asset(project.image)}
                alt={project.imageAlt}
                width={project.imageWidth}
                height={project.imageHeight}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="aspect-[16/10] h-auto w-full bg-white object-contain p-3"
              />
            ) : project.visual?.type === 'tree' ? (
              <TreeVisual visual={project.visual} title={project.title} />
            ) : (
              <FlowVisual visual={project.visual} title={project.title} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, flip }) {
  return (
    <article className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
      <Reveal variant="tilt" className={`md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
        <BrowserFrame project={project} />
      </Reveal>
      <div className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
        <Reveal>
          <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h3>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">{project.tagline}</p>
        </Reveal>
        <Reveal delay={60}>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">{project.description}</p>
        </Reveal>
        <ul className="mt-6 space-y-2.5">
          {project.bullets.map((b, i) => (
            <Reveal as="li" key={i} delay={100 + i * 60} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
              <span
                aria-hidden="true"
                className={`mt-[0.7em] h-px w-5 shrink-0 ${i === 0 ? 'bg-foreground/40' : 'bg-gradient-to-r from-g2 to-g3'}`}
              />
              {b}
            </Reveal>
          ))}
        </ul>
        <Reveal delay={200}>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.map((t, i) => (
              <li key={i} className="rounded-full border border-border px-3 py-0.5 text-[13px] font-medium text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <LinkButton href={project.liveUrl} external variant="primary" size="md" className="group" aria-label={`${project.title} live site`}>
                Live site <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
              </LinkButton>
            )}
            {project.githubUrl && (
            <LinkButton
              href={project.githubUrl}
              external
              variant={project.liveUrl ? 'outline' : 'primary'}
              size="md"
              aria-label={`${project.title} source on GitHub`}
            >
              <GitHubIcon className="size-4" /> GitHub
            </LinkButton>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export default function Projects() {
  const { projects, projectsIntro, personal } = portfolio;
  return (
    <section id="projects" className="scroll-mt-24 py-24 md:py-36" aria-labelledby="projects-title">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <Eyebrow className="mb-4">Selected work</Eyebrow>
        </Reveal>
        <MaskHeading
          id="projects-title"
          lines={[['Things I have', 'built']]}
          className="font-display text-4xl font-bold leading-[1.22] tracking-[-0.02em] md:text-5xl"
        />
        <Reveal>
          <p className="mt-5 max-w-[60ch] font-serif text-base leading-relaxed text-muted-foreground md:text-lg">{projectsIntro}</p>
        </Reveal>

        <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} flip={i % 2 === 1} />
          ))}
        </div>

        {personal.github && (
        <Reveal className="mt-20 flex justify-center">
          <LinkButton href={personal.github} external variant="orbit" size="md" className="group font-semibold">
            More on GitHub <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </LinkButton>
        </Reveal>
        )}
      </div>
    </section>
  );
}
