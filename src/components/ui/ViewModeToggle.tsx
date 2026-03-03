'use client';

import { useAppStore } from '@/lib/store';
import { useMounted } from '@/lib/useMounted';
import { BookOpen, Code2 } from 'lucide-react';

/**
 * Toggle between technical and plain-language view.
 * Reads/writes through Zustand → persisted in localStorage.
 */
export function ViewModeToggle() {
  const { viewMode, setViewMode } = useAppStore();
  const mounted = useMounted();

  if (!mounted) return <div className="h-9 w-[200px]" />;

  const modes = [
    { value: 'technical' as const, icon: Code2, label: 'Technical' },
    { value: 'plain' as const, icon: BookOpen, label: 'Simple' },
  ];

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg p-1"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setViewMode(value)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor: viewMode === value ? 'var(--accent)' : 'transparent',
            color: viewMode === value ? '#ffffff' : 'var(--muted)',
          }}
          aria-label={`Switch to ${label} view`}
          title={`Switch to ${label} view`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
