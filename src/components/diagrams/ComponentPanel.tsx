'use client';

import { motion } from 'framer-motion';
import { X, Cpu, ArrowRightLeft } from 'lucide-react';
import type { DiagramNode } from '@/data/system-details/index';

export interface ConnectionInfo {
  direction: 'incoming' | 'outgoing';
  label: string;
  nodeLabel: string;
}

interface ComponentPanelProps {
  node: DiagramNode;
  connections?: ConnectionInfo[];
  onClose: () => void;
}

export function ComponentPanel({ node, connections = [], onClose }: ComponentPanelProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] rounded-xl shadow-xl z-10 overflow-y-auto"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="sticky top-0 flex items-center justify-between p-4 border-b"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          {node.type && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
              }}
            >
              {node.type}
            </span>
          )}
          <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
            {node.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md transition-colors"
          style={{ color: 'var(--muted)' }}
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          {node.description}
        </p>

        {node.techStack && node.techStack.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Cpu size={12} style={{ color: 'var(--accent)' }} />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--accent)' }}
              >
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {node.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {connections.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowRightLeft size={12} style={{ color: 'var(--accent)' }} />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--accent)' }}
              >
                Connections
              </span>
            </div>
            <div className="space-y-1">
              {connections.map((conn, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs px-2 py-1.5 rounded"
                  style={{ backgroundColor: 'var(--bg)' }}
                >
                  <span style={{ color: 'var(--muted)' }}>
                    {conn.direction === 'incoming' ? '←' : '→'}
                  </span>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>
                    {conn.nodeLabel}
                  </span>
                  {conn.label && (
                    <span className="font-mono ml-auto" style={{ color: 'var(--muted)' }}>
                      {conn.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
