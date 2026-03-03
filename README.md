# 🧠 SysBlueprint.dev

An interactive Next.js platform that teaches how real-world systems are architected — through interactive diagrams, step-by-step animated walkthroughs, key metrics, and toggleable plain-language explanations anyone can understand.

### 🌐 [Live Demo → sysblueprints.netlify.app](https://sysblueprints.netlify.app/)

---

## ✨ Features

- **15 Real-World System Designs** — ChatGPT, Google Search, YouTube, Kafka, WhatsApp, and more
- **Interactive Architecture Diagrams** — Explore nodes, connections, and tech stacks with ReactFlow
- **Step-by-Step Walkthroughs** — Animated flows that highlight components as you progress
- **Technical ↔ Plain Language Toggle** — Switch between engineer-level detail and simple explanations
- **Simplified Flow Diagrams** — Emoji-driven visual flows for non-technical readers
- **Key Metrics Dashboard** — Headline numbers (QPS, latency, users) for every system
- **Collapsible Sections** — Expand/collapse any section with smooth animations
- **Dark / Light / System Theme** — Full theming with CSS custom properties
- **Progress Tracking** — Track which systems you've explored (persisted in localStorage)
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🗂️ Systems Covered

| System | Difficulty | Category |
|--------|-----------|----------|
| ChatGPT | Advanced | AI / ML |
| Google Search | Advanced | Search / Distributed |
| Uber ETA | Intermediate | Real-Time / ML |
| Amazon S3 | Intermediate | Storage / Cloud |
| YouTube | Advanced | Streaming / CDN |
| Apache Kafka | Advanced | Messaging / Streaming |
| WhatsApp | Intermediate | Messaging / E2E Encryption |
| Spotify | Intermediate | Streaming / Recommendations |
| Slack | Intermediate | Real-Time / Collaboration |
| Reddit | Intermediate | Social / Caching |
| Bluesky | Advanced | Decentralized / Social |
| Twitter Timeline | Advanced | Social / Feed Ranking |
| URL Shortener | Beginner | Web / Databases |
| Payment System | Advanced | FinTech / Transactions |
| Stock Exchange | Advanced | FinTech / Low-Latency |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Build & Production

```bash
# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | App Router, SSR, static generation |
| [React 19](https://react.dev/) | UI framework |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety (strict mode) |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [ReactFlow](https://reactflow.dev/) | Interactive architecture diagrams |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Recharts](https://recharts.org/) | Charts & graphs |
| [Zustand](https://zustand.docs.pmnd.rs/) | State management with localStorage persistence |
| [Lucide React](https://lucide.dev/) | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light/system theme |

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home — search, filter, system grid
│   └── systems/[slug]/         # Dynamic system detail pages
├── components/
│   ├── diagrams/               # ArchDiagram, ComponentPanel
│   ├── layout/                 # Navbar, Sidebar, ThemeProvider
│   └── ui/                     # Reusable components (MetricCard,
│                               #   FlowDiagram, SectionToggle, etc.)
├── data/
│   ├── systems.ts              # System metadata registry
│   └── system-details/         # One file per system (ISystemDesign)
│       ├── types.ts            # Shared TypeScript interfaces
│       └── index.ts            # Auto-discovery barrel
├── lib/
│   ├── store.ts                # Zustand store
│   └── useMounted.ts           # SSR-safe mounted hook
```

---

## 🤝 Contributing

We welcome contributions! Whether you want to **add a new system design**, improve existing content, or enhance the UI — check out the full guide:

### 👉 [CONTRIBUTING.md](CONTRIBUTING.md)

It covers:

- **Step-by-step instructions** for adding a new system design
- Enriching existing systems with plain-language content & metrics
- Component library reference
- Code style & conventions

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
