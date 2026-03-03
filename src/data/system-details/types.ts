/* ───────────────────────────────────────────────
 *  Shared Types for System Design Details
 *  (ISystemDesign — the canonical interface)
 * ─────────────────────────────────────────────── */

// ── Diagram ──────────────────────────────────────

export interface DiagramNode {
  id: string;
  label: string;
  position: { x: number; y: number };
  description: string;
  /** Plain-language description shown when viewMode === 'plain' */
  plainDescription?: string;
  type?: string;
  techStack?: string[];
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  edgeType?: 'default' | 'protocol' | 'async' | 'data' | 'control';
}

// ── Steps ────────────────────────────────────────

export interface Step {
  number: number;
  title: string;
  description: string;
  /** Plain-language description shown when viewMode === 'plain' */
  plainDescription?: string;
  highlightNodes: string[];
}

// ── Flow (simplified non-technical walkthrough) ──

export interface FlowStep {
  emoji: string;
  title: string;
  description: string;
}

// ── Design Decisions ─────────────────────────────

export interface DesignDecision {
  question: string;
  answer: string;
  /** Plain-language answer shown when viewMode === 'plain' */
  plainAnswer?: string;
}

// ── Key Metrics ──────────────────────────────────

export interface KeyMetric {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

// ── Further Reading ──────────────────────────────

export interface FurtherReading {
  title: string;
  url: string;
  type: 'blog' | 'paper' | 'video' | 'docs';
}

// ── The canonical system design interface ────────

export interface ISystemDesign {
  slug: string;

  /** One-paragraph technical summary */
  summary: string;
  /** Non-technical "explain like I'm 5" summary */
  plainSummary?: string;
  /** Relatable analogy */
  analogy: string;

  /** Architecture diagram data */
  nodes: DiagramNode[];
  edges: DiagramEdge[];

  /** Technical step-by-step walkthrough */
  steps: Step[];
  /** Simplified flow for non-technical readers */
  flowSteps?: FlowStep[];

  /** Key design decisions / FAQ */
  designDecisions: DesignDecision[];

  /** Headline metrics (QPS, latency, storage, etc.) */
  keyMetrics?: KeyMetric[];

  /** Curated reference links */
  furtherReading: FurtherReading[];
}

/**
 * @deprecated Use ISystemDesign instead.
 * Kept temporarily for backward-compat during migration.
 */
export type SystemDetail = ISystemDesign;
