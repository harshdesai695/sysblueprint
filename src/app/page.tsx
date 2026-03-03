'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { systems, categories } from '@/data/systems';
import { SystemCard } from '@/components/ui/SystemCard';
import { Search, SlidersHorizontal } from 'lucide-react';

type SortOption = 'complexity' | 'alphabetical' | 'default';

const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredSystems = useMemo(() => {
    let result = systems;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.tagline.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((s) => s.category.includes(selectedCategory));
    }

    if (sortBy === 'complexity') {
      result = [...result].sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      );
    } else if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-geist-sans)' }}
            >
              Understand how
              <br />
              <span style={{ color: 'var(--accent)' }}>SysBlueprints</span> are built
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
              style={{ color: 'var(--muted)' }}
            >
              Interactive visual guides to the architecture of 15 systems that power the internet.
              Diagrams, step-by-step flows, and key metrics — in technical or plain language.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div
              className="relative flex items-center rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <Search
                size={18}
                className="absolute left-4"
                style={{ color: 'var(--muted)' }}
              />
              <input
                type="text"
                placeholder="Search systems, tags, or concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-transparent focus:outline-none"
                style={{ color: 'var(--text)' }}
                aria-label="Search systems"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--surface)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--muted)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} style={{ color: 'var(--muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm rounded-lg px-3 py-2 bg-transparent focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
              }}
              aria-label="Sort systems"
            >
              <option value="default">Default</option>
              <option value="complexity">Complexity</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredSystems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSystems.map((system, i) => (
              <SystemCard key={system.slug} system={system} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: 'var(--muted)' }}>
              No systems found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </section>
    </main>
  );
}