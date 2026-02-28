'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SystemMeta } from '@/data/systems';
import { DifficultyBadge } from './DifficultyBadge';
import { TagBadge } from './TagBadge';
import { ArrowRight } from 'lucide-react';

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
          className="group relative rounded-xl p-6 h-full transition-all duration-300 hover:-translate-y-1"
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
            className="text-sm mb-4 leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {system.tagline}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {system.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
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
