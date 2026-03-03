import type { ISystemDesign } from './types';

export const redditDetail: ISystemDesign = {
  slug: 'reddit',
  summary:
    'Reddit serves 1.7 billion monthly visits with a content ranking system built on voting, recency, and community moderation. The architecture evolved from a Python/Pylons monolith to a microservices stack using Go and GraphQL. Massive caching in Memcached and Redis keeps hot content fast, while PostgreSQL handles persistent storage sharded by subreddit.',
  analogy:
    'Imagine a massive bulletin board building where each room (subreddit) has its own theme. Anyone can post a notice, and other visitors vote it up or down. The most popular notices float to the top of the board. Moderators in each room enforce the room\'s rules. A central lobby (front page) shows the best posts from all rooms.',
  nodes: [
    { id: 'client', label: 'Reddit Client', position: { x: 0, y: 200 }, description: 'Web (React), iOS, and Android apps. Uses GraphQL to fetch personalized feeds, post data, and comment trees. Supports infinite scroll with cursor-based pagination.', type: 'client', techStack: ['React', 'GraphQL', 'iOS', 'Android'] },
    { id: 'graphql-gateway', label: 'GraphQL Gateway', position: { x: 200, y: 200 }, description: 'Federated GraphQL gateway that aggregates data from multiple backend microservices into a single schema. Clients send one query that resolves across posts, users, votes, and community services.', type: 'gateway', techStack: ['Apollo Federation', 'GraphQL'] },
    { id: 'post-service', label: 'Post Service', position: { x: 400, y: 100 }, description: 'Manages post creation, editing, and deletion. Stores post content (text, link, image, video) and metadata. Handles post flair, NSFW tagging, and spoiler marking.', type: 'service', techStack: ['Go', 'PostgreSQL'] },
    { id: 'vote-service', label: 'Vote Service', position: { x: 400, y: 300 }, description: 'Records upvotes and downvotes with exactly-once semantics per user per post. Vote counts are maintained as denormalized counters. Votes feed into the ranking algorithm to determine post ordering.', type: 'service', techStack: ['Go', 'Redis', 'PostgreSQL'] },
    { id: 'ranking-engine', label: 'Ranking Engine', position: { x: 600, y: 200 }, description: 'Computes post scores using Reddit\'s "Hot" algorithm: score = log10(max(|ups - downs|, 1)) + (sign * t / 45000), where t is seconds since epoch. Newer posts with proportionally more upvotes rank higher. Also supports "Best", "Top", and "Controversial" sorts.', type: 'compute', techStack: ['Python', 'Hot Algorithm', 'Wilson Score'] },
    { id: 'comment-tree', label: 'Comment Tree Service', position: { x: 600, y: 400 }, description: 'Stores and serves threaded comment trees. Comments form a tree structure stored in PostgreSQL with materialized paths. Deep threads are collapsed and loaded on-demand (load more comments).', type: 'service', techStack: ['PostgreSQL', 'Materialized Path', 'Caching'] },
    { id: 'cache-layer', label: 'Cache Layer', position: { x: 800, y: 100 }, description: 'Multi-tier caching: Memcached for rendered pages and query results, Redis for real-time vote counts and session data. The cache hit rate for hot subreddits exceeds 99%, critical for handling traffic spikes during viral posts.', type: 'cache', techStack: ['Memcached', 'Redis', 'Mcrouter'] },
    { id: 'feed-service', label: 'Feed Service', position: { x: 800, y: 300 }, description: 'Generates personalized home feeds by aggregating top posts from subreddits the user follows. Uses a pull-based model — the feed is assembled on-demand from each subreddit\'s hot listing, not pre-computed.', type: 'service', techStack: ['Go', 'Sorted Sets'] },
    { id: 'moderation', label: 'AutoModerator', position: { x: 200, y: 400 }, description: 'Automated content moderation using rule-based filters (AutoMod) and ML spam detection. Subreddit moderators configure custom rules for auto-remove, auto-approve, and flair assignment.', type: 'processing', techStack: ['Python', 'ML Classifiers', 'Rule Engine'] },
    { id: 'media-service', label: 'Media Service', position: { x: 0, y: 400 }, description: 'Handles image and video uploads to Reddit\'s hosting platform. Generates thumbnails, transcodes video, and stores media in S3.', type: 'service', techStack: ['S3', 'FFmpeg', 'Image Processing'] },
  ],
  edges: [
    { id: 'e1', source: 'client', target: 'graphql-gateway', label: 'GraphQL Query', edgeType: 'protocol' },
    { id: 'e2', source: 'graphql-gateway', target: 'post-service', label: 'Fetch Posts', edgeType: 'data' },
    { id: 'e3', source: 'graphql-gateway', target: 'vote-service', label: 'Vote Data', edgeType: 'data' },
    { id: 'e4', source: 'vote-service', target: 'ranking-engine', label: 'Vote Events', edgeType: 'async', animated: true },
    { id: 'e5', source: 'ranking-engine', target: 'feed-service', label: 'Ranked Lists', edgeType: 'data' },
    { id: 'e6', source: 'graphql-gateway', target: 'comment-tree', label: 'Load Comments', edgeType: 'data' },
    { id: 'e7', source: 'feed-service', target: 'cache-layer', label: 'Cache Feed', edgeType: 'data' },
    { id: 'e8', source: 'post-service', target: 'cache-layer', label: 'Cache Post', edgeType: 'data' },
    { id: 'e9', source: 'post-service', target: 'moderation', label: 'Check Content', edgeType: 'async', animated: true },
    { id: 'e10', source: 'client', target: 'media-service', label: 'Upload Media', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Submitting a Post',
      description:
        'A user creates a post (text, link, image, or video) in a subreddit. The post service validates content, assigns a unique ID, applies subreddit-specific rules via AutoModerator, and persists the post. Media uploads are handled asynchronously — the post appears immediately while images/videos are processed in the background.',
      highlightNodes: ['client', 'post-service', 'moderation', 'media-service'],
    },
    {
      number: 2,
      title: 'Voting and Score Calculation',
      description:
        'Users upvote or downvote posts. The vote service ensures exactly-once voting per user per post (toggling or changing votes). Vote counts are stored in Redis for fast reads and persisted to PostgreSQL.\n\nThe ranking engine recalculates post scores using Reddit\'s Hot algorithm. The key insight: the algorithm inherently decays older posts because the time component increases linearly while votes increase logarithmically. A post needs exponentially more votes to maintain its position as it ages.',
      highlightNodes: ['client', 'vote-service', 'ranking-engine'],
    },
    {
      number: 3,
      title: 'Feed Generation',
      description:
        'When a user opens Reddit, the feed service assembles their personalized home page. It pulls the top-ranked posts from each subreddit the user follows, merges them by score, and applies diversity rules (no more than N posts from one subreddit).\n\nThis is a pull-based model — the feed is computed on-demand, not pre-materialized. Aggressive caching makes this fast: subreddit hot listings are cached and updated every few minutes.',
      highlightNodes: ['feed-service', 'ranking-engine', 'cache-layer'],
    },
    {
      number: 4,
      title: 'Comment Threading',
      description:
        'Comments form a tree structure. Each comment knows its parent comment ID, forming an n-ary tree. The "Best" sort algorithm uses Wilson Score confidence interval — it ranks comments by the lower bound of their upvote percentage, favoring comments with high confidence (many votes) over comments with a high ratio but few votes.\n\nDeep threads are truncated with "load more comments" links, fetched via separate API calls to avoid loading massive comment trees.',
      highlightNodes: ['comment-tree', 'client'],
    },
    {
      number: 5,
      title: 'Content Moderation',
      description:
        'AutoModerator runs rule-based checks configured by subreddit moderators: regex patterns for banned words, account age restrictions, karma thresholds, and flair requirements. ML classifiers detect spam, hate speech, and brigading patterns.\n\nHuman moderators (community volunteers) handle escalated content and can remove posts, ban users, and lock threads.',
      highlightNodes: ['moderation', 'post-service'],
    },
    {
      number: 6,
      title: 'Caching Strategy',
      description:
        'Reddit uses aggressive multi-tier caching to handle traffic spikes (a viral post can generate 100x normal traffic). Rendered page fragments, subreddit listings, and user session data are cached in Memcached. Real-time vote counts use Redis sorted sets.\n\nCache invalidation uses a combination of TTL expiration and event-driven invalidation when posts are edited or votes significantly change rankings.',
      highlightNodes: ['cache-layer'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use a time-decay ranking algorithm instead of pure vote-based sorting?',
      answer:
        'Pure vote sorting would cause "rich get richer" — old posts with many votes would permanently dominate. Reddit\'s Hot algorithm gives newer posts a chance by using logarithmic vote scaling (each doubling of votes increases score by 1) combined with linear time decay (each 12.5 hours increases the time component by 1). This means a 12-hour-old post needs 10x the votes of a new post to rank equally.',
    },
    {
      question: 'Why use a pull-based feed model instead of pre-computing feeds?',
      answer:
        'Pre-computing feeds (fan-out-on-write) would require updating millions of feeds whenever a post is submitted to a popular subreddit. With Reddit\'s read-heavy pattern (many lurkers), a pull model with heavy caching is more efficient — the hot listing for r/funny is computed once and served to millions of readers from cache.',
    },
    {
      question: 'Why use Wilson Score for comment ranking instead of simple up/down ratio?',
      answer:
        'A comment with 1 upvote and 0 downvotes has a 100% ratio but low confidence. Wilson Score computes a confidence interval and uses the lower bound — a comment with 100 upvotes and 10 downvotes (90%, high confidence) ranks higher than one with 1 upvote and 0 downvotes (100%, low confidence). This prevents new comments with a single upvote from dominating.',
    },
  ],
  plainSummary:
    'Reddit is like a massive bulletin board with thousands of topic rooms (subreddits). Anyone can post content, and the community votes it up or down. The most upvoted posts rise to the top. Behind the scenes, heavy caching and ranking algorithms keep the site fast even with millions of simultaneous visitors.',

  flowSteps: [
    { emoji: '📝', title: 'Someone posts content', description: 'A user submits a link, image, or text post to a subreddit (topic community).' },
    { emoji: '⬆️', title: 'People vote on it', description: 'Other users upvote or downvote the post — voting determines visibility.' },
    { emoji: '🏆', title: 'Hot posts rise to the top', description: 'A ranking algorithm considers votes, recency, and engagement to order posts on the page.' },
    { emoji: '💬', title: 'Comments form threads', description: 'Users discuss the post in threaded comments, which are also voted on.' },
    { emoji: '⚡', title: 'Caching keeps it fast', description: 'Popular pages and feeds are cached in memory so millions can view them without overloading databases.' },
    { emoji: '📊', title: 'Scores update in real time', description: 'Vote counts and comment numbers update live as people interact.' },
  ],

  keyMetrics: [
    { label: 'Daily Users', value: '73M+', icon: '👥', description: 'Daily active unique visitors' },
    { label: 'Subreddits', value: '100K+', icon: '📋', description: 'Active communities' },
    { label: 'Comments/Day', value: '52M+', icon: '💬', description: 'Comments posted daily' },
    { label: 'Page Views', value: '1.7B/day', icon: '📄', description: 'Daily page views globally' },
  ],

  furtherReading: [
    { title: 'How Reddit Works — ByteByteGo', url: 'https://lnkd.in/egmm_P7a', type: 'blog' },
    { title: 'Reddit Architecture (High Scalability)', url: 'http://highscalability.com/blog/2013/8/26/reddit-lessons-learned-from-mistakes-made-scaling-to-1-billi.html', type: 'blog' },
    { title: 'Reddit Engineering Blog', url: 'https://www.redditinc.com/blog/topic/technology', type: 'blog' },
    { title: 'How Reddit Ranking Algorithms Work', url: 'https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9', type: 'blog' },
  ],
};
