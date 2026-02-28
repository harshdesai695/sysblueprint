'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light mode' },
    { value: 'dark', icon: Moon, label: 'Dark mode' },
    { value: 'system', icon: Monitor, label: 'System theme' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className="p-1.5 rounded-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: theme === value ? 'var(--accent)' : 'transparent',
            color: theme === value ? '#ffffff' : 'var(--muted)',
          }}
          aria-label={label}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
