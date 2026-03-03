'use client';

import { motion } from 'framer-motion';
import type { KeyMetric } from '@/data/system-details/types';

interface MetricCardProps {
  metric: KeyMetric;
  index: number;
}

export function MetricCard({ metric, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        {metric.icon && <span className="text-lg">{metric.icon}</span>}
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--muted)' }}
        >
          {metric.label}
        </span>
      </div>
      <p className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
        {metric.value}
      </p>
      {metric.description && (
        <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--muted)' }}>
          {metric.description}
        </p>
      )}
    </motion.div>
  );
}

interface MetricGridProps {
  metrics: KeyMetric[];
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <MetricCard key={m.label} metric={m} index={i} />
      ))}
    </div>
  );
}
