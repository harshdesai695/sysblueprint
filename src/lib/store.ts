'use client';

import { create } from 'zustand';

// ── Types ────────────────────────────────────────

export type ViewMode = 'technical' | 'plain';

interface AppState {
  // ── Navigation / sidebar ──
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // ── Explored systems (persisted) ──
  exploredSystems: string[];
  markExplored: (slug: string) => void;

  // ── View-mode toggle ──
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // ── Active system (current detail page) ──
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;

  // ── Animation preferences (persisted) ──
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

// ── Helpers ──────────────────────────────────────

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// ── Store ────────────────────────────────────────

export const useAppStore = create<AppState>((set) => ({
  // sidebar
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // explored
  exploredSystems: readLocal<string[]>('explored-systems', []),
  markExplored: (slug) =>
    set((s) => {
      if (s.exploredSystems.includes(slug)) return s;
      const updated = [...s.exploredSystems, slug];
      writeLocal('explored-systems', updated);
      return { exploredSystems: updated };
    }),

  // view mode
  viewMode: readLocal<ViewMode>('view-mode', 'technical'),
  setViewMode: (mode) => {
    writeLocal('view-mode', mode);
    set({ viewMode: mode });
  },
  toggleViewMode: () =>
    set((s) => {
      const next: ViewMode = s.viewMode === 'technical' ? 'plain' : 'technical';
      writeLocal('view-mode', next);
      return { viewMode: next };
    }),

  // active slug
  activeSlug: null,
  setActiveSlug: (slug) => set({ activeSlug: slug }),

  // animations
  animationsEnabled: readLocal<boolean>('animations-enabled', true),
  setAnimationsEnabled: (enabled) => {
    writeLocal('animations-enabled', enabled);
    set({ animationsEnabled: enabled });
  },
}));
