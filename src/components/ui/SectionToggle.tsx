'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SectionToggleProps {
  title: string;
  emoji?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Collapsible section wrapper with smooth animation.
 * Used on the detail page to let users expand/collapse
 * individual sections.
 */
export function SectionToggle({
  title,
  emoji,
  defaultOpen = true,
  children,
}: SectionToggleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-12">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full text-left group mb-6"
        aria-expanded={open}
      >
        {emoji && <span>{emoji}</span>}
        <h2 className="text-2xl font-bold flex-1" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="p-1 rounded-md"
          style={{ color: 'var(--muted)' }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
