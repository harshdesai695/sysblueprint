'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DiagramNode } from '@/data/system-details';

interface ComponentPanelProps {
  node: DiagramNode;
  onClose: () => void;
}

export function ComponentPanel({ node, onClose }: ComponentPanelProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute top-4 right-4 w-80 rounded-xl shadow-xl z-10 overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
          {node.label}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md transition-colors"
          style={{ color: 'var(--muted)' }}
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          {node.description}
        </p>
      </div>
    </motion.div>
  );
}
