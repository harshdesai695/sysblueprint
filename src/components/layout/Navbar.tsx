'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {pathname !== '/' && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg lg:hidden transition-colors"
                style={{ color: 'var(--text)' }}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🧠</span>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ fontFamily: 'var(--font-geist-sans)', color: 'var(--text)' }}
              >
                SysBlueprint
                <span style={{ color: 'var(--accent)' }}>.dev</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ProgressIndicator />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function ProgressIndicator() {
  const { exploredSystems } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const count = exploredSystems.length;

  return (
    <div
      className="hidden sm:flex items-center gap-2 text-sm px-3 py-1.5 rounded-full"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: count > 0 ? 'var(--accent)' : 'var(--border)' }}
      />
      <span>
        <strong style={{ color: 'var(--text)' }}>{count}</strong> / 15 explored
      </span>
    </div>
  );
}