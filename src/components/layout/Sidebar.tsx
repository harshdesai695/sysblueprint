'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { systems } from '@/data/systems';
import { useAppStore } from '@/lib/store';
import { X, CheckCircle } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { exploredSystems, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 border-r overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--muted)' }}>
              ALL SYSTEMS
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md"
              style={{ color: 'var(--muted)' }}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <h2
            className="hidden lg:block font-semibold text-xs tracking-wider mb-4 uppercase"
            style={{ color: 'var(--muted)' }}
          >
            All Systems
          </h2>

          <div className="space-y-1">
            {systems.map((system) => {
              const isActive = pathname === `/systems/${system.slug}`;
              const isExplored = exploredSystems.includes(system.slug);

              return (
                <Link
                  key={system.slug}
                  href={`/systems/${system.slug}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span className="text-lg flex-shrink-0">{system.icon}</span>
                  <span className="truncate flex-1">{system.name.replace('How ', '').replace(' Works', '')}</span>
                  {isExplored && (
                    <CheckCircle
                      size={14}
                      className="flex-shrink-0"
                      style={{ color: 'var(--accent)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Progress */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>
              PROGRESS
            </p>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--border)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: 'var(--accent)',
                    width: `${(exploredSystems.length / 15) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                {exploredSystems.length}/15
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
