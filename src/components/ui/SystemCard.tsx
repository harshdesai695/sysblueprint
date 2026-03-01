'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SystemMeta } from '@/data/systems';
import { DifficultyBadge } from './DifficultyBadge';
import { TagBadge } from './TagBadge';
import { ArrowRight, BarChart3 } from 'lucide-react';

interface SystemCardProps {
  system: SystemMeta;
  index: number;
}

export function SystemCard({ system, index }: SystemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/systems/${system.slug}`}>
        <div
          className="group relative rounded-xl p-6 h-full transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-light))' }}
          />

          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{system.icon}</span>
            <DifficultyBadge difficulty={system.difficulty} />
          </div>

          <h3
            className="font-bold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors"
            style={{ color: 'var(--text)' }}
          >
            {system.name}
          </h3>

          <p
            className="text-sm mb-3 leading-relaxed line-clamp-2"
            style={{ color: 'var(--muted)' }}
          >
            {system.tagline}
          </p>

          {system.stats && (
            <p
              className="text-xs font-mono mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--accent)' }}
            >
              <BarChart3 size={12} />
              {system.stats}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-2">
            {system.category.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--bg)',
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {system.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {system.tags.length > 3 && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono"
                style={{ color: 'var(--muted)' }}
              >
                +{system.tags.length - 3}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
            style={{ color: 'var(--accent)' }}
          >
            Explore <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
