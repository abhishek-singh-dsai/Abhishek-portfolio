'use client';

import { useCallback, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import { ToastContext } from '@/lib/toast';

const icons = { error: CircleAlert, success: CircleCheck, info: Info };

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const show = useCallback((message, type = 'info', ms = 4200) => {
    clearTimeout(timer.current);
    setToast({ message, type, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), ms);
  }, []);

  const Icon = toast ? icons[toast.type] : null;

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* Live region is always mounted so screen readers announce changes. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-start sm:inset-x-auto sm:left-6 sm:bottom-6">
        {toast && (
          <div
            key={toast.id}
            className="glass-strong initial-blur pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold"
          >
            <Icon
              aria-hidden="true"
              className={`mt-px size-4 shrink-0 ${toast.type === 'error' ? 'text-destructive' : toast.type === 'success' ? 'text-status' : 'text-g2'}`}
            />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
