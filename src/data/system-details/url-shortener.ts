import type { ISystemDesign } from './types';

export const urlShortenerDetail: ISystemDesign = {
  slug: 'url-shortener',
  summary:
    'A URL shortener maps long URLs to short alphanumeric codes, redirecting users when they visit the short URL. The core challenges are generating unique short codes at scale (billions of URLs), resolving redirects with minimal latency (via caching), and tracking click analytics. Systems like Bitly process billions of redirects monthly.',
  analogy:
    'Think of a coat check at a fancy restaurant. You hand over your bulky coat (long URL), get a small numbered ticket (short code), and when you return the ticket, you get your coat back instantly. The coat check system needs unique ticket numbers and must retrieve coats as fast as possible when tickets are presented.',
  nodes: [
    { id: 'client', label: 'Client / Browser', position: { x: 0, y: 200 }, description: 'A user or application that either creates short URLs via the API or clicks a short URL in a browser, which triggers an HTTP redirect to the original long URL.', type: 'client', techStack: ['Browser', 'HTTP'] },
    { id: 'api-server', label: 'API Server', position: { x: 250, y: 100 }, description: 'Handles two core operations: URL shortening (POST with long URL → returns short code) and URL resolution (GET with short code → returns 301/302 redirect). Also handles custom aliases, expiration, and user authentication.', type: 'service', techStack: ['Node.js/Go', 'REST API'] },
    { id: 'id-generator', label: 'ID Generator', position: { x: 500, y: 50 }, description: 'Generates unique short codes using one of several strategies: Base62 encoding of an auto-increment counter, pre-generated ID ranges, or MD5/SHA256 hash of the URL truncated to 7 characters with collision handling.', type: 'service', techStack: ['Snowflake/Counter', 'Base62', 'ZooKeeper'] },
    { id: 'cache', label: 'URL Cache', position: { x: 500, y: 200 }, description: 'Caches the most frequently accessed short-code → long-URL mappings. The top 20% of URLs receive 80% of clicks (Pareto distribution), making caching highly effective. Cache hit ratios reach 90%+ for popular links.', type: 'cache', techStack: ['Redis', 'Memcached', 'LRU'] },
    { id: 'database', label: 'URL Database', position: { x: 500, y: 400 }, description: 'Persistent store mapping short codes to long URLs, creation timestamps, expiration dates, and owner information. Needs to support fast point lookups by short code and uniqueness constraints.', type: 'storage', techStack: ['MySQL', 'DynamoDB', 'Cassandra'] },
    { id: 'analytics', label: 'Analytics Service', position: { x: 750, y: 100 }, description: 'Tracks every click: timestamp, referrer, geographic location (via IP geolocation), device type, and browser. Writes are asynchronous to avoid adding latency to redirects. Powers dashboards showing click-over-time, top referrers, and geographic distribution.', type: 'processing', techStack: ['Kafka', 'ClickHouse', 'IP Geolocation'] },
    { id: 'redirect-service', label: 'Redirect Service', position: { x: 250, y: 350 }, description: 'Optimized service that handles the redirect hot path. Looks up the short code in cache (then DB on miss), logs the click event asynchronously, and returns an HTTP 301 (permanent) or 302 (temporary) redirect.', type: 'service', techStack: ['Nginx', 'Go', 'HTTP 301/302'] },
  ],
  edges: [
    { id: 'e1', source: 'client', target: 'api-server', label: 'Create Short URL', edgeType: 'protocol' },
    { id: 'e2', source: 'api-server', target: 'id-generator', label: 'Generate Code', edgeType: 'data' },
    { id: 'e3', source: 'api-server', target: 'database', label: 'Store Mapping', edgeType: 'data' },
    { id: 'e4', source: 'client', target: 'redirect-service', label: 'Click Short URL', edgeType: 'protocol' },
    { id: 'e5', source: 'redirect-service', target: 'cache', label: 'Lookup Code', edgeType: 'data' },
    { id: 'e6', source: 'cache', target: 'database', label: 'Cache Miss', edgeType: 'data' },
    { id: 'e7', source: 'redirect-service', target: 'client', label: 'HTTP 301 Redirect', edgeType: 'protocol' },
    { id: 'e8', source: 'redirect-service', target: 'analytics', label: 'Click Event', edgeType: 'async', animated: true },
    { id: 'e9', source: 'api-server', target: 'cache', label: 'Warm Cache', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'URL Shortening Request',
      description:
        'A user submits a long URL to the API. The service checks if this URL has already been shortened (deduplication) to avoid creating multiple short codes for the same URL. If a custom alias is requested, it checks for availability.',
      highlightNodes: ['client', 'api-server'],
    },
    {
      number: 2,
      title: 'Short Code Generation',
      description:
        'The ID generator produces a unique short code using one of several strategies:\n\n1. **Counter-based**: An auto-increment counter is encoded in Base62 (a-z, A-Z, 0-9), producing compact codes like `aB3xK7`. A 7-character Base62 code supports 62^7 = 3.5 trillion unique URLs.\n\n2. **Hash-based**: MD5 or SHA256 hash of the URL, truncated to 7 characters. Collisions are handled by appending a counter and re-hashing.\n\n3. **Pre-generated ranges**: A coordinator assigns non-overlapping counter ranges to each server, eliminating the need for a shared counter.',
      highlightNodes: ['id-generator'],
    },
    {
      number: 3,
      title: 'Storage',
      description:
        'The short-code → long-URL mapping is stored in the database along with metadata: creation timestamp, expiration date, owner ID, and click count. The mapping is also immediately written to the cache for fast redirect resolution.\n\nThe database needs to support high point-lookup throughput (each redirect is a lookup by short code). NoSQL stores like DynamoDB or Cassandra are well-suited, though sharded MySQL with the short code as the partition key also works.',
      highlightNodes: ['database', 'cache'],
    },
    {
      number: 4,
      title: 'Redirect Resolution',
      description:
        'When a user clicks a short URL, the redirect service looks up the short code in the cache. On a cache hit (90%+ of requests), the long URL is returned immediately as an HTTP redirect. On a cache miss, the database is queried and the result is cached.\n\nHTTP 301 (permanent redirect) allows browsers to cache the redirect, reducing server load but making analytics incomplete. HTTP 302 (temporary redirect) ensures every click hits the server for tracking.',
      highlightNodes: ['client', 'redirect-service', 'cache', 'database'],
    },
    {
      number: 5,
      title: 'Click Analytics',
      description:
        'Each redirect triggers an asynchronous analytics event containing: short code, timestamp, IP address (resolved to geographic location), User-Agent (parsed for device/browser), and HTTP Referer. Events are streamed to Kafka and aggregated in a columnar store.\n\nAnalytics are served to URL owners via dashboards showing clicks over time, geographic heatmaps, top referrers, and device breakdowns.',
      highlightNodes: ['analytics', 'redirect-service'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use Base62 encoding instead of Base64 or hexadecimal?',
      answer:
        'Base62 uses only alphanumeric characters (a-z, A-Z, 0-9), avoiding special characters like +, /, = that appear in Base64 and can cause issues in URLs. Hexadecimal uses only 16 characters, requiring longer codes. A 7-character Base62 code encodes 3.5 trillion values — compact enough for URLs while supporting massive scale.',
    },
    {
      question: 'Should redirects use HTTP 301 or 302?',
      answer:
        '301 (Moved Permanently) lets browsers cache the redirect, reducing server load but preventing click tracking for repeat visits. 302 (Found/Temporary) forces every click through the server, enabling accurate analytics but increasing server load. Most URL shorteners use 302 for analytics fidelity, with 301 as an option for high-traffic scenarios where analytics are less important.',
    },
    {
      question: 'Why generate codes server-side instead of using the URL hash directly?',
      answer:
        'URL hashes (MD5/SHA256) produce fixed-length outputs but have collision potential when truncated to 7 characters. Counter-based approaches guarantee uniqueness without collision handling. Server-side generation also enables custom aliases and predictable code lengths. The tradeoff is needing a centralized or range-partitioned counter, which adds a coordination point.',
    },
  ],
  plainSummary:
    'A URL shortener is like a receptionist who gives you a short room number instead of the full address. You give it a long web link, it creates a short code, and whenever someone uses that short code, the receptionist redirects them to the original long link — all in milliseconds.',

  flowSteps: [
    { emoji: '🔗', title: 'You paste a long URL', description: 'You submit a long web address to the URL shortener service.' },
    { emoji: '🔢', title: 'A short code is generated', description: 'The service creates a unique short code (like "abc123") using a hash or counter.' },
    { emoji: '💾', title: 'Mapping is stored', description: 'The short code → long URL mapping is saved in a database.' },
    { emoji: '📋', title: 'You get the short link', description: 'You receive a short URL like "sho.rt/abc123" to share.' },
    { emoji: '👆', title: 'Someone clicks it', description: 'When someone visits the short URL, the service looks up the original address.' },
    { emoji: '↪️', title: 'They\'re redirected', description: 'The service sends a redirect response, and the browser takes the user to the original page.' },
  ],

  keyMetrics: [
    { label: 'Redirect Latency', value: '<10ms', icon: '⚡', description: 'Time to resolve a short URL' },
    { label: 'Links Created', value: 'Billions', icon: '🔗', description: 'Total shortened URLs in service' },
    { label: 'Read:Write Ratio', value: '100:1', icon: '📊', description: 'Reads heavily dominate writes' },
    { label: 'Key Space', value: '3.5T (Base62×7)', icon: '🔢', description: 'Possible unique short codes' },
  ],

  furtherReading: [
    { title: 'How URL Shortener Works — ByteByteGo', url: 'https://lnkd.in/evFTZVQq', type: 'blog' },
    { title: 'System Design: URL Shortener', url: 'https://www.youtube.com/watch?v=fMZMm_0ZhK4', type: 'video' },
    { title: 'Bitly Engineering Blog', url: 'https://word.bitly.com/', type: 'blog' },
  ],
};
