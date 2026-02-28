export function DifficultyBadge({ difficulty }: { difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }) {
  const colors = {
    Beginner: { bg: '#dcfce7', text: '#166534', darkBg: '#14532d', darkText: '#86efac' },
    Intermediate: { bg: '#fef3c7', text: '#92400e', darkBg: '#78350f', darkText: '#fcd34d' },
    Advanced: { bg: '#fce4ec', text: '#b71c1c', darkBg: '#7f1d1d', darkText: '#fca5a5' },
  };

  const c = colors[difficulty];

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {difficulty}
    </span>
  );
}
