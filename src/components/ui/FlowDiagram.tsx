'use client';

import { motion } from 'framer-motion';
import type { FlowStep } from '@/data/system-details/types';

interface FlowDiagramProps {
  steps: FlowStep[];
}

/**
 * A simplified, non-technical animated flow diagram.
 * Shown when viewMode === 'plain' as an alternative
 * to the full architecture diagram.
 */
export function FlowDiagram({ steps }: FlowDiagramProps) {
  return (
    <div className="relative space-y-0">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.1 }}
          className="relative flex items-start gap-4 pb-8 last:pb-0"
        >
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className="absolute left-[23px] top-[48px] w-0.5 h-[calc(100%-48px)]"
              style={{ backgroundColor: 'var(--border)' }}
            />
          )}

          {/* Circle with emoji */}
          <div
            className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{
              backgroundColor: 'var(--accent-light)',
              border: '2px solid var(--accent)',
            }}
          >
            {step.emoji}
          </div>

          {/* Content */}
          <div
            className="flex-1 rounded-xl p-4"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>
              {step.title}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
