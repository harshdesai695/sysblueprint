'use client';

import { motion } from 'framer-motion';
import { DifficultyBadge } from './DifficultyBadge';
import { TagBadge } from './TagBadge';
import { ViewModeToggle } from './ViewModeToggle';
import { Lightbulb, BarChart3 } from 'lucide-react';
import type { SystemMeta } from '@/data/systems';
import type { ISystemDesign } from '@/data/system-details/types';
import { useAppStore } from '@/lib/store';

interface SystemOverviewBannerProps {
  meta: SystemMeta;
  detail: ISystemDesign;
}

/**
 * Hero banner shown at the top of every system detail page.
 * Includes icon, name, difficulty, summary/analogy, tags,
 * stats, and the viewMode toggle.
 */
export function SystemOverviewBanner({ meta, detail }: SystemOverviewBannerProps) {
  const viewMode = useAppStore((s) => s.viewMode);

  const summary = viewMode === 'plain' && detail.plainSummary
    ? detail.plainSummary
    : detail.summary;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-12"
    >
      {/* Header row */}
      <div className="flex items-start gap-4 mb-6">
        <span className="text-5xl">{meta.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: 'var(--text)' }}
            >
              {meta.name}
            </h1>
            <DifficultyBadge difficulty={meta.difficulty} />
          </div>

          <p className="text-lg mb-3" style={{ color: 'var(--muted)' }}>
            {summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {meta.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          {meta.stats && (
            <p
              className="text-sm font-mono px-3 py-2 rounded-lg inline-flex items-center gap-1.5"
              style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
              }}
            >
              <BarChart3 size={14} />
              {meta.stats}
            </p>
          )}
        </div>

        {/* View mode toggle in top-right */}
        <div className="hidden sm:block flex-shrink-0">
          <ViewModeToggle />
        </div>
      </div>

      {/* Mobile view mode toggle */}
      <div className="sm:hidden mb-4">
        <ViewModeToggle />
      </div>

      {/* Analogy card */}
      <div
        className="rounded-xl p-5 flex items-start gap-3"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <Lightbulb
          size={20}
          className="flex-shrink-0 mt-0.5"
          style={{ color: 'var(--accent)' }}
        />
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: 'var(--accent)' }}
          >
            Simple Analogy
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {detail.analogy}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
