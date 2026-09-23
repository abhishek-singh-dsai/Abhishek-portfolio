'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { scrollToId } from '@/lib/smoothScroll';
import { Menu, Moon, Sun } from 'lucide-react';
import { portfolio } from '@/data/portfolio';
import { sections } from '@/lib/sections';
import { socials } from '@/lib/socials';
import { Button } from './ui/Button';
import Dialog from './ui/Dialog';

const { personal } = portfolio;

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return active;
}

// The theme lives on <html class="dark|light"> (set before paint in layout.jsx).
const subscribeTheme = (cb) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
};
const isDarkNow = () => !document.documentElement.classList.contains('light');

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeTheme, isDarkNow, () => true);
  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    root.classList.toggle('light', !next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable */
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="!size-9 !px-0"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? <Moon className="size-[18px]" strokeWidth={1.5} /> : <Sun className="size-[18px]" strokeWidth={1.5} />}
    </Button>
  );
}

export default function Navbar({ onOpenResume }) {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the sheet first, then scroll once it has left the top layer.
  const goTo = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      scrollToId(id);
      history.replaceState(null, '', `#${id}`);
    }, 60);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:pt-5">
      <nav
        aria-label="Primary"
        className="glass initial-blur pointer-events-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 rounded-full pl-5 pr-2 md:w-auto md:pr-2"
      >
        <a
          href="#top"
          className="font-display text-[15px] font-extrabold tracking-tight"
          aria-label={`${personal.name}, back to top`}
        >
          <span className="hidden md:inline">{personal.monogram}</span>
          <span className="text-xs uppercase tracking-[0.08em] md:hidden">{personal.name}</span>
        </a>

        <ul className="hidden items-center gap-5 px-5 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className={`nav-link text-sm font-medium transition-colors duration-200 hover:text-foreground ${active === s.id ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onOpenResume && (
            <Button variant="orbit" size="md" onClick={onOpenResume} className="ml-1 hidden font-semibold md:inline-flex" aria-haspopup="dialog">
              Resume
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="!size-9 !px-0 md:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </Button>
        </div>
      </nav>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} variant="sheet" labelledBy="menu-title" className="px-7 pb-8 pt-7">
        <p id="menu-title" className="text-[13px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {personal.name} ✌️
        </p>
        <ul className="mt-10 space-y-3">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => goTo(e, s.id)}
                className="font-display text-[2rem] font-bold tracking-tight transition-colors hover:text-g2"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        {onOpenResume && (
        <Button
          variant="orbit"
          size="md"
          className="mt-12 w-full font-semibold"
          aria-haspopup="dialog"
          onClick={() => {
            setMenuOpen(false);
            setTimeout(onOpenResume, 60);
          }}
        >
          Resume
        </Button>
        )}
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="hover:text-foreground"
                {...(s.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Dialog>
    </header>
  );
}
