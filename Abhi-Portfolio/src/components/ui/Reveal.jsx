'use client';

import { useInView } from '@/lib/hooks';

/** Fades + un-blurs its children in when scrolled into view. */
export function Reveal({ as: Tag = 'div', variant = 'fade', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  const base = variant === 'tilt' ? 'reveal-tilt' : 'reveal';
  return (
    <Tag
      ref={ref}
      className={`${base} ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Section heading whose text slides up from behind a mask.
 * `lines` is an array of lines; a line may be a string or [plain, italic].
 */
export function MaskHeading({ as: Tag = 'h2', lines, className = '', lineClassName = '', stagger = 90, ...rest }) {
  const [ref, inView] = useInView();
  const label = lines.map((l) => (Array.isArray(l) ? l.join(' ') : l)).join(' ');
  return (
    <Tag ref={ref} className={`${inView ? "is-in" : ""} ${className}`} aria-label={label} {...rest}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line" aria-hidden="true">
          <span className={lineClassName} style={{ '--delay': `${i * stagger}ms` }}>
            {Array.isArray(line) ? (
              <>
                {line[0]}{' '}
                <em className="pr-[0.06em] font-serif-display font-medium italic tracking-normal">{line[1]}</em>
              </>
            ) : (
              line
            )}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground ${className}`}>{children}</p>
  );
}
