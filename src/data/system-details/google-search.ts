import type { ISystemDesign } from './types';

export const googleSearchDetail: ISystemDesign = {
  slug: 'google-search',
  summary:
    'Google Search crawls billions of web pages, builds a massive inverted index, and ranks results using hundreds of signals — from PageRank link analysis to BERT-based semantic understanding. The serving stack splits queries across thousands of index shards, merges results, and returns ranked pages in under 500ms.',
  analogy:
    'Imagine a library with trillions of books, but instead of a card catalog, there is a master index that maps every single word to every page it appears on. When you search, thousands of librarians each check their section simultaneously and a head librarian merges and ranks the results in milliseconds.',
  nodes: [
    { id: 'user', label: 'User / Browser', position: { x: 0, y: 250 }, description: 'The user types a search query in the browser. Autocomplete suggestions are fetched in real-time as the user types, powered by a separate Suggest service.', type: 'client', techStack: ['Chrome', 'HTTP/3', 'QUIC'] },
    { id: 'web-server', label: 'Web Server (GWS)', position: { x: 200, y: 250 }, description: 'Google Web Server receives the query, parses it, applies spell correction and query expansion, then fans out to index servers. Also handles personalization and localization.', type: 'gateway', techStack: ['GWS', 'Borg'] },
    { id: 'spell-checker', label: 'Spell & Query Rewrite', position: { x: 200, y: 50 }, description: 'Corrects typos ("did you mean"), expands acronyms, identifies entities, and rewrites queries for better retrieval. Uses n-gram models and learned edit distance models.', type: 'processing', techStack: ['N-gram Models', 'BERT'] },
    { id: 'index-shards', label: 'Index Shards', position: { x: 450, y: 150 }, description: 'The inverted index is partitioned into thousands of shards, each holding a portion of the web. A shard maps terms to posting lists — sorted lists of document IDs with metadata like term frequency, position, and font size.', type: 'storage', techStack: ['SSTable', 'Bigtable', 'Custom Index'] },
    { id: 'doc-servers', label: 'Doc Servers', position: { x: 450, y: 350 }, description: 'Store the forward index: document metadata, titles, snippets, URLs, and cached page content. Fetched after initial ranking to generate the result page snippets.', type: 'storage', techStack: ['Bigtable', 'Colossus'] },
    { id: 'ranking-engine', label: 'Ranking Engine', position: { x: 650, y: 250 }, description: 'Applies multi-stage ranking: an initial cheap ranker filters thousands of candidates, then a deep neural ranker (based on BERT/MUM) re-scores the top results using semantic understanding of the query and document.', type: 'compute', techStack: ['PageRank', 'BERT', 'MUM', 'RankBrain'] },
    { id: 'crawler', label: 'Googlebot Crawler', position: { x: 700, y: 50 }, description: 'Continuously crawls the web, discovering new and updated pages. Politely respects robots.txt. Uses a priority queue that re-crawls popular/frequently-changing pages more often. Renders JavaScript pages via headless Chrome.', type: 'service', techStack: ['Headless Chrome', 'MapReduce', 'Priority Queue'] },
    { id: 'indexer', label: 'Indexer (Caffeine)', position: { x: 900, y: 50 }, description: 'Processes crawled pages: extracts text, parses HTML structure, computes PageRank from the link graph, and builds the inverted index. Caffeine enables near-real-time incremental indexing.', type: 'processing', techStack: ['MapReduce', 'Caffeine', 'Bigtable'] },
    { id: 'knowledge-graph', label: 'Knowledge Graph', position: { x: 900, y: 250 }, description: 'A structured database of billions of entities and their relationships. Powers knowledge panels, direct answers, and entity disambiguation. Built from Freebase, Wikipedia, and web extraction.', type: 'storage', techStack: ['Graph DB', 'Freebase', 'Entity Recognition'] },
    { id: 'ads-server', label: 'Ads Server', position: { x: 650, y: 450 }, description: 'Runs a real-time auction for ad placement alongside organic results. Considers bid amount, ad quality score, and relevance. The auction completes within the same query latency budget.', type: 'service', techStack: ['Real-time Auction', 'ML Ranking'] },
  ],
  edges: [
    { id: 'e1', source: 'user', target: 'web-server', label: 'Search Query', edgeType: 'protocol' },
    { id: 'e2', source: 'web-server', target: 'spell-checker', label: 'Query Parse', edgeType: 'data' },
    { id: 'e3', source: 'web-server', target: 'index-shards', label: 'Fan-out Query', edgeType: 'protocol' },
    { id: 'e4', source: 'index-shards', target: 'ranking-engine', label: 'Posting Lists', edgeType: 'data' },
    { id: 'e5', source: 'doc-servers', target: 'ranking-engine', label: 'Doc Metadata', edgeType: 'data' },
    { id: 'e6', source: 'ranking-engine', target: 'web-server', label: 'Ranked Results', edgeType: 'protocol' },
    { id: 'e7', source: 'web-server', target: 'user', label: 'SERP HTML', edgeType: 'protocol' },
    { id: 'e8', source: 'crawler', target: 'indexer', label: 'Raw Pages', edgeType: 'async', animated: true },
    { id: 'e9', source: 'indexer', target: 'index-shards', label: 'Update Index', edgeType: 'async', animated: true },
    { id: 'e10', source: 'knowledge-graph', target: 'ranking-engine', label: 'Entity Data', edgeType: 'data' },
    { id: 'e11', source: 'ads-server', target: 'web-server', label: 'Ad Results', edgeType: 'data' },
    { id: 'e12', source: 'web-server', target: 'ads-server', label: 'Query Context', edgeType: 'default' },
  ],
  steps: [
    {
      number: 1,
      title: 'Crawling the Web',
      description:
        'Googlebot continuously discovers and fetches web pages. It starts from a seed set of known URLs and follows hyperlinks to discover new pages. A URL frontier prioritizes which pages to crawl based on PageRank, freshness signals, and change frequency.\n\nFor JavaScript-heavy sites, Googlebot uses a headless Chrome renderer (Web Rendering Service) to execute JS and capture the final DOM. Crawl rate is throttled per domain to avoid overloading servers.',
      highlightNodes: ['crawler'],
    },
    {
      number: 2,
      title: 'Indexing with Caffeine',
      description:
        'Crawled pages are processed by the Caffeine indexing pipeline. The indexer extracts text content, parses HTML structure (headings, bold text, links), identifies the language, and detects duplicate/near-duplicate content via SimHash.\n\nThe link graph is analyzed to compute PageRank — a measure of page authority based on the quantity and quality of incoming links. The output is an inverted index mapping every term to a posting list of documents containing that term.',
      highlightNodes: ['indexer', 'index-shards'],
    },
    {
      number: 3,
      title: 'Query Processing',
      description:
        'When a user submits a query, the Web Server (GWS) normalizes it: lowercasing, removing stop words, applying stemming. The spell checker corrects typos using statistical language models. Query expansion adds synonyms and related terms.\n\nFor ambiguous queries, the system identifies possible intents (e.g., "apple" could mean the fruit or the company) and diversifies results accordingly.',
      highlightNodes: ['user', 'web-server', 'spell-checker'],
    },
    {
      number: 4,
      title: 'Index Lookup — Scatter/Gather',
      description:
        'The processed query is fanned out to thousands of index shards in parallel. Each shard looks up the query terms in its local inverted index, intersects posting lists, and returns the top candidate documents with relevance scores.\n\nThis scatter/gather pattern is the core of Google\'s serving architecture — no single machine holds the entire index. Results from all shards are merged at the aggregation layer.',
      highlightNodes: ['web-server', 'index-shards'],
    },
    {
      number: 5,
      title: 'Multi-Stage Ranking',
      description:
        'Candidates from the index lookup pass through multiple ranking stages. Stage 1 uses cheap features (BM25, term frequency) to filter thousands of candidates down to hundreds. Stage 2 applies neural models like BERT and MUM to deeply understand query-document semantic relevance.\n\nRankBrain handles novel queries the system hasn\'t seen before, using embeddings to find semantically similar known queries. The Knowledge Graph provides structured facts for direct answers.',
      highlightNodes: ['ranking-engine', 'knowledge-graph'],
    },
    {
      number: 6,
      title: 'Snippet Generation and SERP Assembly',
      description:
        'For the final set of ranked results, doc servers fetch page metadata: titles, URLs, and cached content. Relevant snippets are extracted by finding the passage that best matches the query, with matching terms bolded.\n\nThe SERP (Search Engine Results Page) is assembled, interleaving organic results with ads from the ads server, knowledge panels from the Knowledge Graph, and other features (images, news, videos).',
      highlightNodes: ['doc-servers', 'ads-server', 'web-server'],
    },
    {
      number: 7,
      title: 'Response Delivery',
      description:
        'The complete SERP HTML is returned to the user\'s browser over HTTP/3 (QUIC). The entire pipeline — from query to rendered results — completes in under 500ms. Subsequent interactions (clicking "next page", refining the query) benefit from cached intermediate results.',
      highlightNodes: ['web-server', 'user'],
    },
  ],
  designDecisions: [
    {
      question: 'Why shard the index instead of keeping a single giant index?',
      answer:
        'The web contains hundreds of billions of pages. No single machine can store or search the entire index. Sharding distributes the index across thousands of machines, enabling parallel lookup. Each shard searches its portion independently, and results are merged — turning a disk-bound sequential scan into a massively parallel operation.',
    },
    {
      question: 'Why use multi-stage ranking instead of applying the best model to all candidates?',
      answer:
        'Deep neural models like BERT are computationally expensive — running BERT on millions of candidates per query would take seconds. Multi-stage ranking uses cheap signals (BM25) to quickly filter down to hundreds of candidates, then applies the expensive neural ranker only to this small set. This achieves near-optimal quality at practical latency.',
    },
    {
      question: 'Why build the Knowledge Graph as a separate system?',
      answer:
        'Structured knowledge (entities, relationships, facts) can\'t be reliably extracted from web documents at query time. Pre-building a knowledge graph from curated sources enables instant direct answers ("population of France"), entity disambiguation, and rich result panels — improving user experience without relying on potentially inaccurate web page text.',
    },
    {
      question: 'Why does Googlebot use a headless Chrome renderer?',
      answer:
        'Modern web pages increasingly rely on JavaScript to render content (React, Angular SPAs). Without executing JavaScript, the crawler would see empty pages. The Web Rendering Service runs headless Chrome to execute JS and capture the final DOM, ensuring JavaScript-rendered content is properly indexed.',
    },
  ],
  plainSummary:
    'Google Search is like having a librarian who has already read every webpage on the internet. When you search, it doesn\'t go read all those pages — it looks up your words in a giant index it already built, ranks the best matches, and shows you the top results in under half a second.',

  flowSteps: [
    { emoji: '🔍', title: 'You type a search', description: 'You enter words into the search bar and press Enter.' },
    { emoji: '🗺️', title: 'Google crawls the web', description: 'Bots called "spiders" constantly visit web pages and discover new content, following links from page to page.' },
    { emoji: '📚', title: 'Pages are indexed', description: 'The content of each page is organized into a massive searchable index — like the index at the back of a textbook, but for the entire internet.' },
    { emoji: '🧮', title: 'Your query is analyzed', description: 'Google figures out what you really mean — correcting typos, understanding synonyms, and detecting your intent.' },
    { emoji: '🏆', title: 'Results are ranked', description: 'Hundreds of factors determine which pages are most relevant: page quality, freshness, your location, and many more.' },
    { emoji: '📄', title: 'You see the results', description: 'The top results appear on your screen in about 0.2 seconds, often with snippets showing the most relevant part of each page.' },
  ],

  keyMetrics: [
    { label: 'Queries/Day', value: '8.5B+', icon: '🔍', description: 'Daily search queries worldwide' },
    { label: 'Index Size', value: '100+ PB', icon: '💾', description: 'Petabytes of indexed web content' },
    { label: 'Avg Latency', value: '<200ms', icon: '⚡', description: 'Time from query to results page' },
    { label: 'Pages Indexed', value: '400B+', icon: '📄', description: 'Total indexed web pages' },
  ],

  furtherReading: [
    { title: 'How Google Search Works — ByteByteGo', url: 'https://lnkd.in/exsvNqFn', type: 'blog' },
    { title: 'The Anatomy of a Large-Scale Hypertextual Web Search Engine', url: 'https://research.google/pubs/pub334/', type: 'paper' },
    { title: 'How Search Works — Google', url: 'https://www.google.com/search/howsearchworks/', type: 'docs' },
    { title: 'Google Caffeine Indexing System', url: 'https://googleblog.blogspot.com/2010/06/our-new-search-index-caffeine.html', type: 'blog' },
  ],
};
