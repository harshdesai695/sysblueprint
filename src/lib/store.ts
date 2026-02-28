'use client';

import { create } from 'zustand';

interface AppState {
  exploredSystems: string[];
  sidebarOpen: boolean;
  markExplored: (slug: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  exploredSystems: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('explored-systems') || '[]')
    : [],
  sidebarOpen: false,
  markExplored: (slug: string) =>
    set((state) => {
      if (state.exploredSystems.includes(slug)) return state;
      const updated = [...state.exploredSystems, slug];
      if (typeof window !== 'undefined') {
        localStorage.setItem('explored-systems', JSON.stringify(updated));
      }
      return { exploredSystems: updated };
    }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));
