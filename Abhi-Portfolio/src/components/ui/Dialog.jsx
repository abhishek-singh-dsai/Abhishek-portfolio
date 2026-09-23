'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { pauseScroll, resumeScroll } from '@/lib/smoothScroll';

/**
 * Thin wrapper over the native <dialog> element: it gives us the top layer,
 * inert background, focus containment and Escape-to-close for free.
 */
export default function Dialog({ open, onClose, labelledBy, variant = 'modal', className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      pauseScroll();
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    const onNativeClose = () => {
      document.documentElement.style.overflow = '';
      resumeScroll();
      onClose();
    };
    d.addEventListener('close', onNativeClose);
    return () => d.removeEventListener('close', onNativeClose);
  }, [onClose]);

  // Click on the backdrop (the dialog box itself, outside the panel) closes it.
  const onClick = (e) => {
    if (e.target === ref.current) ref.current.close();
  };

  const layout =
    variant === 'sheet'
      ? 'sheet m-0 ml-auto h-dvh max-h-none w-[min(24rem,78vw)] max-w-none'
      : 'modal m-auto w-[min(42rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)]';

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      data-lenis-prevent
      onClick={onClick}
      className={`${layout} pointer-events-auto overflow-visible bg-transparent p-0 text-foreground backdrop:bg-transparent`}
    >
      <div className={`glass-strong relative h-full overflow-y-auto ${variant === 'sheet' ? 'rounded-none border-y-0 border-r-0' : 'max-h-[calc(100dvh-2rem)] rounded-[1.75rem]'} ${className}`}>
        {children}
        <button
          type="button"
          onClick={() => ref.current.close()}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </dialog>
  );
}
