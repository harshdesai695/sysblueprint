'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DiagramNode, DiagramEdge } from '@/data/system-details';
import { ComponentPanel, ConnectionInfo } from './ComponentPanel';

interface ArchDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  highlightNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
}

const edgeTypeStyles: Record<string, React.CSSProperties> = {
  default: { stroke: 'var(--muted)', strokeWidth: 1.5 },
  protocol: { stroke: 'var(--accent)', strokeWidth: 2.5 },
  async: { stroke: 'var(--muted)', strokeWidth: 1.5, strokeDasharray: '6 3' },
  data: { stroke: 'var(--accent)', strokeWidth: 2 },
  control: { stroke: 'var(--muted)', strokeWidth: 1, strokeDasharray: '3 3' },
};

function CustomNode({ data, selected }: NodeProps) {
  const isHighlighted = data.highlighted;

  return (
    <div
      className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-w-[120px] text-center"
      style={{
        backgroundColor: isHighlighted ? 'var(--accent)' : 'var(--surface)',
        color: isHighlighted ? '#ffffff' : 'var(--text)',
        border: `2px solid ${isHighlighted ? 'var(--accent)' : selected ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: isHighlighted
          ? '0 0 20px rgba(0, 102, 255, 0.3)'
          : selected
          ? '0 4px 12px rgba(0,0,0,0.1)'
          : '0 2px 4px rgba(0,0,0,0.05)',
        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
      }}
      role="button"
      aria-label={`${data.label} - click for details`}
      tabIndex={0}
    >
      <Handle type="target" position={Position.Left} className="!bg-[var(--accent)] !w-2 !h-2 !border-0" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} className="!bg-[var(--accent)] !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export function ArchDiagram({ nodes: diagramNodes, edges: diagramEdges, highlightNodes = [], onNodeClick }: ArchDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);

  const initialNodes: Node[] = diagramNodes.map((n) => ({
    id: n.id,
    type: 'custom',
    position: n.position,
    data: {
      label: n.label,
      description: n.description,
      highlighted: highlightNodes.includes(n.id),
    },
  }));

  const initialEdges: Edge[] = diagramEdges.map((e) => {
    const styleKey = e.edgeType || 'default';
    const baseStyle = edgeTypeStyles[styleKey] || edgeTypeStyles.default;

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.animated || styleKey === 'async' || false,
      style: baseStyle,
      labelStyle: {
        fill: 'var(--muted)',
        fontSize: 11,
        fontFamily: 'var(--font-geist-mono)',
      },
      labelBgStyle: {
        fill: 'var(--bg)',
        fillOpacity: 0.8,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: styleKey === 'protocol' || styleKey === 'data' ? 'var(--accent)' : 'var(--muted)',
        width: 15,
        height: 15,
      },
    };
  });

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const updatedNodes = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      highlighted: highlightNodes.includes(n.id),
    },
  }));

  const connections: ConnectionInfo[] = useMemo(() => {
    if (!selectedNode) return [];
    const incoming = diagramEdges
      .filter((e) => e.target === selectedNode.id)
      .map((e) => ({
        direction: 'incoming' as const,
        label: e.label || '',
        nodeLabel: diagramNodes.find((n) => n.id === e.source)?.label || e.source,
      }));
    const outgoing = diagramEdges
      .filter((e) => e.source === selectedNode.id)
      .map((e) => ({
        direction: 'outgoing' as const,
        label: e.label || '',
        nodeLabel: diagramNodes.find((n) => n.id === e.target)?.label || e.target,
      }));
    return [...incoming, ...outgoing];
  }, [selectedNode, diagramEdges, diagramNodes]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const original = diagramNodes.find((n) => n.id === node.id);
      if (original) {
        setSelectedNode(original);
        onNodeClick?.(node.id);
      }
    },
    [diagramNodes, onNodeClick]
  );

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border)" gap={20} size={1} />
        <Controls
          className="!bg-[var(--surface)] !border-[var(--border)] !rounded-lg !shadow-sm"
          style={{ button: { backgroundColor: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' } } as React.CSSProperties}
        />
        <MiniMap
          nodeColor="var(--accent)"
          maskColor="rgba(0,0,0,0.1)"
          className="!bg-[var(--surface)] !border-[var(--border)] !rounded-lg"
        />
      </ReactFlow>

      {selectedNode && (
        <ComponentPanel
          node={selectedNode}
          connections={connections}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
