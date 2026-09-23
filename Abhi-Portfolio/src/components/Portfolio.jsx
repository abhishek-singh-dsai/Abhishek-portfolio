'use client';

import { useCallback, useEffect, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { startSmoothScroll } from '@/lib/smoothScroll';
import Navbar from './Navbar';
import Hero from './Hero';
import Marquee from './Marquee';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Creative from './Creative';
import Photography from './Photography';
import Contact from './Contact';
import Footer from './Footer';
import ResumeDialog from './ResumeDialog';
import { ToastProvider } from './ui/Toast';

export default function Portfolio() {
  const [resumeOpen, setResumeOpen] = useState(false);
  // No résumé configured → no Resume buttons at all (never a dead control).
  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const onOpenResume = portfolio.personal.resume.url ? openResume : null;

  useEffect(() => {
    // Enable scroll-reveal hiding only now that the observers that un-hide content are running.
    document.documentElement.classList.add('js-reveal');
    return startSmoothScroll();
  }, []);

  return (
    <ToastProvider>
      <Navbar onOpenResume={onOpenResume} />
      {/* Section order follows the reference site. */}
      <main id="main">
        <Hero onOpenResume={onOpenResume} />
        <Marquee />
        <Projects />
        <Experience />
        <Skills />
        <Creative />
        <Photography />
        <Contact />
      </main>
      <Footer />
      {onOpenResume && <ResumeDialog open={resumeOpen} onClose={closeResume} />}
    </ToastProvider>
  );
}
