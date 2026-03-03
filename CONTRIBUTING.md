# Contributing to SysBlueprint

Thank you for your interest in contributing! This guide explains how to add a new system design, improve existing ones, or contribute to the UI/codebase.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Adding a New System Design](#adding-a-new-system-design)
3. [Enriching an Existing System](#enriching-an-existing-system)
4. [Component Library](#component-library)
5. [Code Style & Conventions](#code-style--conventions)
6. [Running Locally](#running-locally)

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page (search, filter, grid)
│   └── systems/[slug]/page.tsx   # System detail page
├── components/
│   ├── diagrams/                 # Architecture diagram (ReactFlow)
│   │   ├── ArchDiagram.tsx
│   │   └── ComponentPanel.tsx
│   ├── layout/                   # Navbar, Sidebar, ThemeProvider
│   └── ui/                       # Reusable UI components
│       ├── DifficultyBadge.tsx
│       ├── FlowDiagram.tsx       # Plain-language animated flow
│       ├── MetricCard.tsx        # Key metrics grid
│       ├── SectionToggle.tsx     # Collapsible section wrapper
│       ├── StepWalkthrough.tsx   # Technical step-by-step
│       ├── SystemCard.tsx        # Home page card
│       ├── SystemOverviewBanner.tsx  # Detail page hero
│       ├── TagBadge.tsx
│       ├── ThemeToggle.tsx
│       └── ViewModeToggle.tsx    # Tech ↔ Plain toggle
├── data/
│   ├── systems.ts                # SystemMeta registry (all systems)
│   └── system-details/           # One file per system
│       ├── types.ts              # ISystemDesign interface
│       ├── index.ts              # Auto-discovery barrel
│       ├── chatgpt.ts
│       ├── youtube.ts
│       └── ...
├── lib/
│   ├── store.ts                  # Zustand state management
│   └── useMounted.ts             # SSR-safe mounted hook
```

---

## Adding a New System Design

### Step 1: Create the research file (optional but recommended)

Create `research/how-<slug>-works.md` with comprehensive research about the system.

### Step 2: Add metadata to `src/data/systems.ts`

Add an entry to the `systems` array:

```typescript
{
  slug: 'my-system',
  name: 'How My System Works',
  tagline: 'One-line description of the system',
  icon: '🔧',                                // An emoji icon
  difficulty: 'Intermediate',                 // 'Beginner' | 'Intermediate' | 'Advanced'
  category: ['Distributed Systems'],          // From existing categories
  tags: ['#distributed', '#realtime'],        // Hashtag-style tags
  referenceUrl: 'https://example.com',
  stats: '1M requests/sec',                   // Optional headline stat
}
```

Update the `systems` array length in `src/components/layout/Sidebar.tsx` if hardcoded (currently `15`).

### Step 3: Create the system detail file

Create `src/data/system-details/my-system.ts`:

```typescript
import type { ISystemDesign } from './types';

export const mySystemDetail: ISystemDesign = {
  slug: 'my-system',

  summary: 'Technical summary (2-3 sentences).',

  plainSummary: 'Non-technical summary anyone can understand.',

  analogy: 'A relatable real-world analogy.',

  nodes: [
    {
      id: 'client',
      label: 'Client',
      position: { x: 0, y: 200 },
      description: 'Technical description of this component.',
      type: 'client',
      techStack: ['React', 'Next.js'],
    },
    // ... more nodes
  ],

  edges: [
    {
      id: 'e1',
      source: 'client',
      target: 'api',
      label: 'HTTP Request',
      edgeType: 'protocol',     // 'default' | 'protocol' | 'async' | 'data' | 'control'
    },
    // ... more edges
  ],

  steps: [
    {
      number: 1,
      title: 'Step Title',
      description: 'What happens in this step (technical).',
      highlightNodes: ['client', 'api'],
    },
    // ... more steps
  ],

  flowSteps: [
    { emoji: '📱', title: 'Simple title', description: 'Plain-language explanation.' },
    // ... more flow steps
  ],

  designDecisions: [
    {
      question: 'Why was X chosen over Y?',
      answer: 'Technical answer.',
    },
    // ... more decisions
  ],

  keyMetrics: [
    { label: 'Throughput', value: '1M/s', icon: '⚡', description: 'Requests per second' },
    // ... more metrics (2-4 recommended)
  ],

  furtherReading: [
    { title: 'Reference Article', url: 'https://...', type: 'blog' },
    // type: 'blog' | 'paper' | 'video' | 'docs'
  ],
};
```

### Step 4: Register in the barrel file

Add your import and include it in the `allDetails` array in `src/data/system-details/index.ts`:

```typescript
import { mySystemDetail } from './my-system';

// In the allDetails array:
const allDetails: ISystemDesign[] = [
  // ... existing systems
  mySystemDetail,
];
```

### Step 5: Verify

Run `npm run dev` and navigate to `/systems/my-system`. Confirm:
- [ ] Overview banner renders correctly
- [ ] Architecture diagram loads with all nodes/edges
- [ ] Step walkthrough highlights correct nodes
- [ ] Flow diagram shows in plain mode
- [ ] Key metrics display properly
- [ ] All collapsible sections work
- [ ] Prev/Next navigation links are correct

---

## Enriching an Existing System

To improve an existing system:

1. **Add `plainSummary`** — A non-technical 1-2 sentence summary
2. **Add `flowSteps`** — 5-8 steps with emojis for the plain-language flow
3. **Add `keyMetrics`** — 2-4 headline numbers (QPS, latency, users, etc.)
4. **Add `plainDescription`** on steps/nodes — Plain-language alternatives
5. **Add `plainAnswer`** on design decisions — Non-technical explanations

---

## Component Library

| Component | File | Purpose |
|-----------|------|---------|
| `SystemOverviewBanner` | `ui/SystemOverviewBanner.tsx` | Hero section with icon, title, summary, analogy |
| `MetricGrid` / `MetricCard` | `ui/MetricCard.tsx` | Animated metric cards grid |
| `FlowDiagram` | `ui/FlowDiagram.tsx` | Plain-language animated flow |
| `SectionToggle` | `ui/SectionToggle.tsx` | Collapsible section with animation |
| `ViewModeToggle` | `ui/ViewModeToggle.tsx` | Technical ↔ Plain mode switch |
| `StepWalkthrough` | `ui/StepWalkthrough.tsx` | Technical step-by-step with node highlighting |
| `ArchDiagram` | `diagrams/ArchDiagram.tsx` | Interactive ReactFlow architecture diagram |
| `DifficultyBadge` | `ui/DifficultyBadge.tsx` | Colored difficulty pill |
| `TagBadge` | `ui/TagBadge.tsx` | Hashtag-style tag pill |
| `SystemCard` | `ui/SystemCard.tsx` | Home page system card |

---

## Code Style & Conventions

- **TypeScript strict mode** — No `any`, no implicit returns
- **CSS custom properties** — Use `var(--bg)`, `var(--text)`, `var(--accent)`, etc.
- **Framer Motion** — All animations use framer-motion
- **Client components** — Mark with `'use client'` at the top
- **Imports** — Use `@/` path alias (maps to `src/`)
- **Types** — Use `import type { ... }` for type-only imports

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

The app runs at `http://localhost:3000`.

---

## Questions?

Open an issue or start a discussion. We'd love to hear your ideas for new systems or UI improvements!
