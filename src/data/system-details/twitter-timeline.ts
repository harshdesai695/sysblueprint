import type { ISystemDesign } from './types';

export const twitterTimelineDetail: ISystemDesign = {
  slug: 'twitter-timeline',
  summary:
    'Twitter\'s timeline system combines fan-out-on-write for regular users with fan-out-on-read for high-follower accounts. When a user tweets, the tweet is pushed into the timeline caches of all followers (up to a threshold). Celebrity tweets are mixed in at read time. The ranking model uses a deep neural network to score tweet relevance based on engagement predictions.',
  analogy:
    'Imagine a newspaper delivery service. For regular columnists, their articles are pre-inserted into each subscriber\'s personalized newspaper at print time (fan-out-on-write). For celebrity columnists with millions of subscribers, their articles are mixed in when each subscriber picks up their paper (fan-out-on-read) — because printing millions of papers for each celebrity article would overwhelm the presses.',
  nodes: [
    { id: 'tweeter', label: 'Tweet Author', position: { x: 0, y: 200 }, description: 'A user composing and posting a tweet with text, media, polls, or quoted tweets. Tweets are limited to 280 characters (or longer for premium users).', type: 'client', techStack: ['iOS', 'Android', 'React'] },
    { id: 'tweet-service', label: 'Tweet Service', position: { x: 200, y: 100 }, description: 'Receives new tweets, assigns unique Snowflake IDs (time-sortable 64-bit IDs), persists to the tweet store, and triggers fan-out. Handles tweet metadata: hashtags, mentions, URLs, and media references.', type: 'service', techStack: ['Java', 'Snowflake ID', 'Manhattan'] },
    { id: 'fanout-service', label: 'Fan-out Service', position: { x: 400, y: 100 }, description: 'For users with < ~5000 followers, pushes the tweet ID into each follower\'s timeline cache (fan-out-on-write). For high-follower accounts, skips fan-out and leaves the tweet to be mixed in at read time.', type: 'service', techStack: ['Java', 'Redis', 'Thrift'] },
    { id: 'timeline-cache', label: 'Timeline Cache', position: { x: 600, y: 100 }, description: 'Redis cluster storing each user\'s home timeline as a sorted set of tweet IDs (sorted by Snowflake ID = time). Each user\'s cache holds ~800 tweet IDs. This is the core data structure powering feed reads.', type: 'cache', techStack: ['Redis', 'Sorted Sets', 'Cluster'] },
    { id: 'timeline-mixer', label: 'Timeline Mixer', position: { x: 600, y: 300 }, description: 'At read time, merges the user\'s pre-computed timeline cache with real-time tweets from high-follower accounts they follow. Also injects ads, recommendations ("Suggested for you"), and trending content.', type: 'service', techStack: ['Scala', 'Finagle'] },
    { id: 'ranking-model', label: 'Ranking Model', position: { x: 800, y: 200 }, description: 'Deep neural network that scores each candidate tweet for the user. Features include: author relationship, tweet engagement predictions (like, retweet, reply probability), content relevance, recency, and diversity penalties.', type: 'compute', techStack: ['TensorFlow', 'Feature Store', 'ML Pipeline'] },
    { id: 'tweet-store', label: 'Tweet Store', position: { x: 400, y: 350 }, description: 'Persistent storage for all tweets. Uses Manhattan (Twitter\'s distributed key-value store) with tweet ID as key. Stores tweet text, author, timestamp, engagement counts, and media references.', type: 'storage', techStack: ['Manhattan', 'HDFS'] },
    { id: 'social-graph', label: 'Social Graph', position: { x: 200, y: 350 }, description: 'Stores follow/follower relationships. FlockDB (a distributed graph database) handles the massive fan-out of follower lookups during write-time fan-out. Optimized for adjacency list queries.', type: 'storage', techStack: ['FlockDB', 'MySQL'] },
    { id: 'reader', label: 'Timeline Reader', position: { x: 800, y: 400 }, description: 'The user opening their home timeline. The client fetches ranked tweets with cursor-based pagination (using Snowflake IDs as cursors). New tweets can appear via streaming or pull-to-refresh.', type: 'client', techStack: ['iOS', 'Android', 'Streaming API'] },
  ],
  edges: [
    { id: 'e1', source: 'tweeter', target: 'tweet-service', label: 'Post Tweet', edgeType: 'protocol' },
    { id: 'e2', source: 'tweet-service', target: 'tweet-store', label: 'Persist', edgeType: 'data' },
    { id: 'e3', source: 'tweet-service', target: 'fanout-service', label: 'Trigger Fan-out', edgeType: 'async', animated: true },
    { id: 'e4', source: 'fanout-service', target: 'social-graph', label: 'Get Followers', edgeType: 'data' },
    { id: 'e5', source: 'fanout-service', target: 'timeline-cache', label: 'Push Tweet ID', edgeType: 'data' },
    { id: 'e6', source: 'timeline-cache', target: 'timeline-mixer', label: 'Cached Timeline', edgeType: 'data' },
    { id: 'e7', source: 'tweet-store', target: 'timeline-mixer', label: 'Celebrity Tweets', edgeType: 'data' },
    { id: 'e8', source: 'timeline-mixer', target: 'ranking-model', label: 'Score Candidates', edgeType: 'data' },
    { id: 'e9', source: 'ranking-model', target: 'reader', label: 'Ranked Feed', edgeType: 'protocol' },
    { id: 'e10', source: 'social-graph', target: 'timeline-mixer', label: 'Follow Graph', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Tweet Creation and Snowflake ID',
      description:
        'The author posts a tweet. The Tweet Service assigns a Snowflake ID — a 64-bit ID composed of: 41 bits for millisecond timestamp, 10 bits for machine ID, and 12 bits for sequence number. This guarantees globally unique, time-sortable IDs without coordination between servers.\n\nThe tweet is persisted to Manhattan (Twitter\'s distributed KV store) and the write is acknowledged to the user.',
      highlightNodes: ['tweeter', 'tweet-service', 'tweet-store'],
    },
    {
      number: 2,
      title: 'Fan-out on Write (Regular Users)',
      description:
        'For users with fewer than ~5000 followers, the fan-out service reads the follower list from the social graph and pushes the tweet ID into each follower\'s timeline cache (a Redis sorted set). This pre-computes timelines so reads are a simple cache lookup.\n\nThis is extremely fast for reading but expensive for writing — a user with 5000 followers triggers 5000 cache insertions. The fan-out service processes these asynchronously.',
      highlightNodes: ['fanout-service', 'social-graph', 'timeline-cache'],
    },
    {
      number: 3,
      title: 'Handling High-Follower Accounts',
      description:
        'Accounts with millions of followers (celebrities, politicians) skip fan-out-on-write — pushing a tweet to 50 million timeline caches would take minutes and overwhelm the system. Instead, their tweets are left in the tweet store and merged in at read time.\n\nThis hybrid approach is critical: a pure fan-out-on-write system would collapse under celebrity tweet storms, while a pure fan-out-on-read system would make every timeline read expensive.',
      highlightNodes: ['tweet-service', 'tweet-store'],
    },
    {
      number: 4,
      title: 'Timeline Assembly (Mixer)',
      description:
        'When a user opens their timeline, the Timeline Mixer fetches their pre-computed timeline cache (regular users\' tweets) and merges in recent tweets from high-follower accounts they follow (fetched on-demand from the tweet store). Ads and recommendations are also injected.\n\nThe mixer produces a candidate set of ~1500 tweets that are passed to the ranking model.',
      highlightNodes: ['timeline-cache', 'timeline-mixer', 'tweet-store'],
    },
    {
      number: 5,
      title: 'ML Ranking',
      description:
        'The ranking model scores each candidate tweet using hundreds of features: author-viewer relationship strength, predicted engagement (will they like/retweet/reply?), content freshness, media presence, tweet thread context, and diversity (avoiding too many tweets from one author).\n\nThe "For You" tab uses full ranking while the "Following" tab uses chronological order with minimal filtering. The ranking model is continuously retrained on engagement data.',
      highlightNodes: ['ranking-model'],
    },
    {
      number: 6,
      title: 'Feed Delivery',
      description:
        'The ranked tweet list is returned to the client with cursor-based pagination. The client renders tweets and prefetches the next page. New tweets appearing after the feed was loaded are either streamed via persistent connections or discovered on pull-to-refresh.\n\nSnowflake IDs serve as efficient cursors — the client sends "give me tweets older than this Snowflake ID" for pagination.',
      highlightNodes: ['reader', 'ranking-model'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use a hybrid fan-out approach instead of pure fan-out-on-write or fan-out-on-read?',
      answer:
        'Pure fan-out-on-write is optimal for reads (simple cache lookup) but disastrous for high-follower accounts — fanning out to 50M caches per tweet would take minutes. Pure fan-out-on-read makes every timeline request expensive. The hybrid approach applies fan-out-on-write for the 99% of users with modest follower counts and fan-out-on-read for the 1% with millions of followers.',
    },
    {
      question: 'Why use Snowflake IDs instead of UUIDs or auto-increment?',
      answer:
        'Snowflake IDs are time-sortable (chronological ordering without a secondary index), globally unique without coordination (each machine generates its own), compact (64 bits vs 128 for UUID), and can be used as efficient cursor keys for pagination. Auto-increment requires a central sequence generator that would be a bottleneck at Twitter\'s scale.',
    },
    {
      question: 'Why store timelines in Redis instead of a persistent database?',
      answer:
        'Timeline reads are the most frequent operation at Twitter (every app open). Redis sorted sets provide O(log n) insertion and O(log n + k) range queries with sub-millisecond latency. The timeline cache is ephemeral — if lost, it can be reconstructed from the tweet store and social graph. This makes Redis ideal: fast reads, acceptable data loss semantics.',
    },
  ],
  plainSummary:
    'Twitter\'s timeline is like a newspaper that\'s custom-printed for you every second. When you open Twitter, it gathers tweets from everyone you follow, sprinkles in algorithm-picked content, ranks everything by relevance, and delivers a personalized feed — all in about 200 milliseconds.',

  flowSteps: [
    { emoji: '📝', title: 'Someone tweets', description: 'A user posts a tweet, which goes to Twitter\'s servers.' },
    { emoji: '📬', title: 'Tweet is fanned out', description: 'The tweet is pushed into the timelines of all followers — pre-computed and ready to read.' },
    { emoji: '📱', title: 'You open Twitter', description: 'When you open the app, it requests your home timeline.' },
    { emoji: '🏆', title: 'Tweets are ranked', description: 'An ML model scores each tweet by predicted engagement — likes, retweets, replies, time spent.' },
    { emoji: '🎯', title: 'Algorithmic content is mixed in', description: 'Tweets from people you don\'t follow but might like are added to your feed.' },
    { emoji: '📰', title: 'Your feed appears', description: 'The ranked, mixed timeline is displayed on your screen, ready to scroll.' },
  ],

  keyMetrics: [
    { label: 'Daily Users', value: '250M+', icon: '👥', description: 'Daily active users' },
    { label: 'Tweets/Day', value: '500M+', icon: '📝', description: 'Tweets posted per day' },
    { label: 'Feed Latency', value: '<200ms', icon: '⚡', description: 'Time to generate a timeline' },
    { label: 'Fanout', value: '~300M/min', icon: '📬', description: 'Timeline deliveries per minute' },
  ],

  furtherReading: [
    { title: 'How Twitter Timeline Works — ByteByteGo', url: 'https://lnkd.in/eniXMPfU', type: 'blog' },
    { title: 'Twitter\'s Timeline at Scale (InfoQ)', url: 'https://www.infoq.com/presentations/Twitter-Timeline-Scalability/', type: 'video' },
    { title: 'Snowflake ID Generator', url: 'https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake', type: 'blog' },
    { title: 'How Twitter Recommends Content (Algorithm Open-Source)', url: 'https://github.com/twitter/the-algorithm', type: 'docs' },
  ],
};
