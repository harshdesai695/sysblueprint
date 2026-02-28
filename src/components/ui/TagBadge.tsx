export function TagBadge({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono"
      style={{
        backgroundColor: 'var(--accent-light)',
        color: 'var(--accent)',
        border: '1px solid var(--border)',
      }}
    >
      {tag}
    </span>
  );
}
