'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { systems, getSystemBySlug } from '@/data/systems';
import { getSystemDetail, Step } from '@/data/system-details';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ArchDiagram } from '@/components/diagrams/ArchDiagram';
import { StepWalkthrough } from '@/components/ui/StepWalkthrough';
import { TradeoffRadar } from '@/components/ui/TradeoffRadar';
import { TagBadge } from '@/components/ui/TagBadge';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import {
  BookOpen,
  Lightbulb,
  ExternalLink,
  FileText,
  Video,
  BookMarked,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function SystemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const meta = getSystemBySlug(slug);
  const detail = getSystemDetail(slug);
  const { markExplored } = useAppStore();
  const [highlightNodes, setHighlightNodes] = useState<string[]>([]);

  useEffect(() => {
    if (slug) {
      markExplored(slug);
    }
  }, [slug, markExplored]);

  const handleStepChange = useCallback((step: Step) => {
    setHighlightNodes(step.highlightNodes);
  }, []);

  if (!meta || !detail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p style={{ color: 'var(--muted)' }}>System not found</p>
      </div>
    );
  }

  // Find prev/next systems
  const currentIndex = systems.findIndex((s) => s.slug === slug);
  const prevSystem = currentIndex > 0 ? systems[currentIndex - 1] : null;
  const nextSystem = currentIndex < systems.length - 1 ? systems[currentIndex + 1] : null;

  const readingTypeIcons = {
    blog: BookOpen,
    paper: FileText,
    video: Video,
    docs: BookMarked,
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />

      <main className="flex-1 lg:ml-72">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* Overview Section */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{meta.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: 'var(--text)' }}
                  >
                    {meta.name}
                  </h1>
                  <DifficultyBadge difficulty={meta.difficulty} />
                </div>
                <p className="text-lg mb-3" style={{ color: 'var(--muted)' }}>
                  {detail.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {meta.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
                {meta.stats && (
                  <p
                    className="text-sm font-mono px-3 py-2 rounded-lg inline-block"
                    style={{
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                    }}
                  >
                    📊 {meta.stats}
                  </p>
                )}
              </div>
            </div>

            {/* Analogy */}
            <div
              className="rounded-xl p-5 flex items-start gap-3"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <Lightbulb size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                  Simple Analogy
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {detail.analogy}
                </p>
              </div>
            </div>
          </section>

          {/* Architecture Diagram */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span>🏗️</span> Architecture Diagram
            </h2>
            <ArchDiagram
              nodes={detail.nodes}
              edges={detail.edges}
              highlightNodes={highlightNodes}
            />
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>
              Click on any node to see its description. Use scroll to zoom, drag to pan.
            </p>
          </section>

          {/* Step-by-Step Walkthrough */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span>📖</span> How It Works — Step by Step
            </h2>
            <StepWalkthrough steps={detail.steps} onStepChange={handleStepChange} />
          </section>

          {/* Design Decisions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span>🧩</span> Key Design Decisions
            </h2>
            <div className="space-y-4">
              {detail.designDecisions.map((decision, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>
                    💡 {decision.question}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {decision.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Trade-offs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span>⚖️</span> Trade-offs
            </h2>
            <TradeoffRadar tradeoffs={detail.tradeoffs} systemName={meta.name} />
          </section>

          {/* Further Reading */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span>📚</span> Further Reading
            </h2>
            <div className="grid gap-3">
              {detail.furtherReading.map((item, i) => {
                const Icon = readingTypeIcons[item.type] || BookOpen;
                return (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                    <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {item.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full uppercase"
                      style={{
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent)',
                      }}
                    >
                      {item.type}
                    </span>
                    <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
                  </a>
                );
              })}
            </div>
          </section>

          {/* Navigation */}
          <section className="border-t pt-8 pb-12" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              {prevSystem ? (
                <Link
                  href={`/systems/${prevSystem.slug}`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--muted)' }}
                >
                  <ArrowLeft size={16} />
                  <span>
                    <span className="block text-xs" style={{ color: 'var(--muted)' }}>Previous</span>
                    <span style={{ color: 'var(--text)' }}>{prevSystem.icon} {prevSystem.name.replace('How ', '').replace(' Works', '')}</span>
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextSystem ? (
                <Link
                  href={`/systems/${nextSystem.slug}`}
                  className="flex items-center gap-2 text-sm font-medium text-right transition-colors"
                  style={{ color: 'var(--muted)' }}
                >
                  <span>
                    <span className="block text-xs" style={{ color: 'var(--muted)' }}>Next</span>
                    <span style={{ color: 'var(--text)' }}>{nextSystem.icon} {nextSystem.name.replace('How ', '').replace(' Works', '')}</span>
                  </span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
