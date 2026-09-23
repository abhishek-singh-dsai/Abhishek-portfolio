import { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const base =
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-medium outline-none transition-[transform,background-color,color,border-color] duration-150 ease-out-strong active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

const sizes = {
  lg: 'h-12 px-6 text-[15px]',
  md: 'h-10 px-5 text-sm',
  sm: 'h-9 px-4 text-sm',
};

const variants = {
  // Solid light pill (Get in touch, Live site)
  primary: 'rounded-full bg-primary text-primary-foreground hover:bg-primary/85',
  // Bordered pill (GitHub)
  outline: 'rounded-full border border-input bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.09]',
  // Pill with an orbiting gradient comet (Resume, Send message)
  orbit: 'btn-orbit text-foreground',
  ghost: 'rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground',
};

function classes({ variant = 'primary', size = 'md', className = '' }) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export const Button = forwardRef(function Button({ variant, size, className, type = 'button', ...rest }, ref) {
  return <button ref={ref} type={type} className={classes({ variant, size, className })} {...rest} />;
});

export function LinkButton({ variant, size, className, external, children, ...rest }) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a className={classes({ variant, size, className })} {...ext} {...rest}>
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** Round arrow badge used inside primary buttons; nudges up-right on hover. */
export function ArrowBadge({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-8 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-200 ease-out-strong group-hover:-translate-y-px group-hover:translate-x-0.5 ${className}`}
    >
      <ArrowUpRight className="size-4" strokeWidth={1.5} />
    </span>
  );
}
