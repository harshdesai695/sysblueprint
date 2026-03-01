export interface DiagramNode {
  id: string;
  label: string;
  position: { x: number; y: number };
  description: string;
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

export interface Step {
  number: number;
  title: string;
  description: string;
  highlightNodes: string[];
}

export interface DesignDecision {
  question: string;
  answer: string;
}

export interface TradeOff {
  scalability: number;
  availability: number;
  consistency: number;
  latency: number;
  durability: number;
  simplicity: number;
}

export interface FurtherReading {
  title: string;
  url: string;
  type: 'blog' | 'paper' | 'video' | 'docs';
}

export interface SystemDetail {
  slug: string;
  summary: string;
  analogy: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: Step[];
  designDecisions: DesignDecision[];
  tradeoffs: TradeOff;
  furtherReading: FurtherReading[];
}
