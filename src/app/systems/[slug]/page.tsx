'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { systems, getSystemBySlug } from '@/data/systems';
import { getSystemDetail } from '@/data/system-details/index';
import type { Step } from '@/data/system-details/index';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ArchDiagram } from '@/components/diagrams/ArchDiagram';
import { StepWalkthrough } from '@/components/ui/StepWalkthrough';
import { SystemOverviewBanner } from '@/components/ui/SystemOverviewBanner';
import { MetricGrid } from '@/components/ui/MetricCard';
import { FlowDiagram } from '@/components/ui/FlowDiagram';
import { SectionToggle } from '@/components/ui/SectionToggle';
import { TagBadge } from '@/components/ui/TagBadge';
import {
  BookOpen,
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
  const { markExplored, viewMode } = useAppStore();
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

  const readingTypeIcons: Record<string, typeof BookOpen> = {
    blog: BookOpen,
    paper: FileText,
    video: Video,
    docs: BookMarked,
  };

  const isPlain = viewMode === 'plain';

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
          {/* ── Overview Banner ── */}
          <SystemOverviewBanner meta={meta} detail={detail} />

          {/* ── Key Metrics ── */}
          {detail.keyMetrics && detail.keyMetrics.length > 0 && (
            <SectionToggle title="Key Metrics" emoji="📊">
              <MetricGrid metrics={detail.keyMetrics} />
            </SectionToggle>
          )}

          {/* ── Architecture / Flow ── */}
          {isPlain && detail.flowSteps && detail.flowSteps.length > 0 ? (
            <SectionToggle title="How It Works — Simplified" emoji="🗺️">
              <FlowDiagram steps={detail.flowSteps} />
            </SectionToggle>
          ) : (
            <SectionToggle title="Architecture Diagram" emoji="🏗️">
              <ArchDiagram
                nodes={detail.nodes}
                edges={detail.edges}
                highlightNodes={highlightNodes}
              />
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>
                Click on any node to see its description. Use scroll to zoom, drag to pan.
              </p>
            </SectionToggle>
          )}

          {/* ── Step-by-Step Walkthrough ── */}
          <SectionToggle title="How It Works — Step by Step" emoji="📖">
            <StepWalkthrough steps={detail.steps} onStepChange={handleStepChange} />
          </SectionToggle>

          {/* ── Design Decisions ── */}
          <SectionToggle title="Key Design Decisions" emoji="🧩">
            <div className="space-y-4">
              {detail.designDecisions.map((decision, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
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
                    {isPlain && decision.plainAnswer ? decision.plainAnswer : decision.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionToggle>

          {/* ── Further Reading ── */}
          <SectionToggle title="Further Reading" emoji="📚">
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
          </SectionToggle>

          {/* ── Navigation ── */}
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
                    <span style={{ color: 'var(--text)' }}>
                      {prevSystem.icon} {prevSystem.name.replace('How ', '').replace(' Works', '')}
                    </span>
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
                    <span style={{ color: 'var(--text)' }}>
                      {nextSystem.icon} {nextSystem.name.replace('How ', '').replace(' Works', '')}
                    </span>
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
