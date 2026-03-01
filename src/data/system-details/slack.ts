import { SystemDetail } from './types';

export const slackDetail: SystemDetail = {
  slug: 'slack',
  summary:
    'Slack provides real-time team messaging using a WebSocket-based architecture. Messages are delivered instantly to online users and persisted for search and history. The system handles 1.5 billion+ messages per week with features like channels, threads, reactions, file sharing, and full-text search across message history. The backend is a PHP/Hack monolith with critical real-time paths in Java and Go.',
  analogy:
    'Think of Slack as a digital office building. Each channel is a conference room with a permanent whiteboard (message history). When someone writes on the whiteboard, everyone in the room sees it instantly (WebSocket push). People who were out of the room can read everything when they return. A librarian (search index) can find any message ever written on any whiteboard.',
  nodes: [
    { id: 'client', label: 'Slack Client', position: { x: 0, y: 200 }, description: 'Desktop (Electron), mobile, or web client that maintains a persistent WebSocket connection for real-time updates. Uses local SQLite cache for offline access and fast rendering of channels.', type: 'client', techStack: ['Electron', 'React', 'WebSocket', 'SQLite'] },
    { id: 'gateway', label: 'WebSocket Gateway', position: { x: 250, y: 100 }, description: 'Maintains millions of persistent WebSocket connections. When a message is sent, the gateway pushes it to all connected users who are members of the target channel. Uses consistent hashing to assign users to gateway nodes.', type: 'gateway', techStack: ['Java', 'Netty', 'WebSocket'] },
    { id: 'api-server', label: 'API Server', position: { x: 250, y: 300 }, description: 'Handles REST API calls: sending messages, creating channels, uploading files, managing permissions. PHP/Hack monolith that processes the core business logic and persists data.', type: 'service', techStack: ['PHP/Hack', 'HHVM', 'REST'] },
    { id: 'message-store', label: 'Message Store', position: { x: 500, y: 200 }, description: 'Sharded MySQL cluster storing all messages. Sharded by workspace and channel for locality — messages in the same channel are on the same shard. Vitess manages the sharding layer.', type: 'storage', techStack: ['MySQL', 'Vitess', 'Sharded'] },
    { id: 'channel-service', label: 'Channel Service', position: { x: 500, y: 400 }, description: 'Manages channel metadata: membership lists, topic, purpose, pinned items, and channel-level permissions. Determines which users should receive each message based on channel membership.', type: 'service', techStack: ['MySQL', 'Redis Cache'] },
    { id: 'search-index', label: 'Search Index', position: { x: 750, y: 100 }, description: 'Full-text search across all messages, files, and channels. Uses Elasticsearch with custom analyzers for code snippets, URLs, and emoji. Supports filtering by channel, user, date range, and file type.', type: 'storage', techStack: ['Elasticsearch', 'Custom Analyzers'] },
    { id: 'file-service', label: 'File Service', position: { x: 750, y: 300 }, description: 'Handles file uploads, virus scanning, thumbnail generation, and storage. Files are stored in S3 with metadata in MySQL. Generates previews for images, PDFs, and code snippets.', type: 'service', techStack: ['S3', 'Image Processing', 'Virus Scan'] },
    { id: 'notification-service', label: 'Notification Service', position: { x: 500, y: 50 }, description: 'Manages push notifications for mobile and desktop, email digests for inactive users, and badge counts. Respects per-channel notification preferences and Do Not Disturb schedules.', type: 'service', techStack: ['APNS', 'FCM', 'Email'] },
    { id: 'cache-layer', label: 'Cache Layer', position: { x: 750, y: 500 }, description: 'Distributed Memcached/Redis layer caching hot data: channel membership lists, user profiles, workspace settings, and recent messages. Critical for reducing database load.', type: 'cache', techStack: ['Memcached', 'Redis', 'Mcrouter'] },
  ],
  edges: [
    { id: 'e1', source: 'client', target: 'gateway', label: 'WebSocket', edgeType: 'protocol' },
    { id: 'e2', source: 'client', target: 'api-server', label: 'REST API', edgeType: 'protocol' },
    { id: 'e3', source: 'api-server', target: 'message-store', label: 'Persist Message', edgeType: 'data' },
    { id: 'e4', source: 'api-server', target: 'gateway', label: 'Broadcast Event', edgeType: 'protocol' },
    { id: 'e5', source: 'gateway', target: 'client', label: 'Push Update', edgeType: 'protocol', animated: true },
    { id: 'e6', source: 'message-store', target: 'search-index', label: 'Index Messages', edgeType: 'async', animated: true },
    { id: 'e7', source: 'api-server', target: 'channel-service', label: 'Check Members', edgeType: 'data' },
    { id: 'e8', source: 'api-server', target: 'file-service', label: 'Upload Files', edgeType: 'data' },
    { id: 'e9', source: 'api-server', target: 'notification-service', label: 'Send Notification', edgeType: 'async', animated: true },
    { id: 'e10', source: 'api-server', target: 'cache-layer', label: 'Read/Write Cache', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Client Connection',
      description:
        'When the Slack app opens, it establishes a WebSocket connection to the gateway. The client sends an authentication token, and the gateway registers the connection in its connection registry. The client also loads cached channel data from its local SQLite database for instant UI rendering.\n\nThe gateway uses consistent hashing to assign each user to a specific gateway node, ensuring reconnections go to the same node when possible.',
      highlightNodes: ['client', 'gateway'],
    },
    {
      number: 2,
      title: 'Sending a Message',
      description:
        'When a user sends a message, it goes to the API server via REST. The server validates permissions, processes Slack-specific markdown (mentions, emoji, links), persists the message to the sharded MySQL store, and then publishes a broadcast event to the WebSocket gateway.\n\nMessages are assigned a monotonically increasing sort key per channel to maintain ordering, even when multiple API servers process messages concurrently.',
      highlightNodes: ['client', 'api-server', 'message-store'],
    },
    {
      number: 3,
      title: 'Real-time Broadcast',
      description:
        'The gateway receives the broadcast event and pushes the message to all connected clients who are members of the target channel. The channel service provides the membership list, and the gateway routes the message only to relevant WebSocket connections.\n\nFor large channels (thousands of members), the fan-out is distributed across multiple gateway nodes. Typing indicators and presence updates use the same WebSocket channel.',
      highlightNodes: ['gateway', 'channel-service', 'client'],
    },
    {
      number: 4,
      title: 'Notifications',
      description:
        'Users who are offline or have the channel muted receive push notifications via APNs (iOS) or FCM (Android). The notification service respects user preferences: per-channel mute settings, Do Not Disturb schedules, and notification keywords.\n\nFor users who haven\'t been active for a while, the system sends email digests summarizing unread activity in their channels.',
      highlightNodes: ['notification-service', 'channel-service'],
    },
    {
      number: 5,
      title: 'Search Indexing',
      description:
        'Messages are asynchronously indexed into Elasticsearch. The search index supports full-text search with custom analyzers for code snippets (preserving syntax), URLs, and emoji names. Filters include channel, sender, date range, and has:file/has:link.\n\nSearch results are ranked by relevance and recency, with boosting for messages in channels the user frequently visits.',
      highlightNodes: ['message-store', 'search-index'],
    },
    {
      number: 6,
      title: 'File Handling',
      description:
        'Uploaded files go through the file service, which performs virus scanning, generates thumbnails/previews (images, PDFs, code snippets with syntax highlighting), and stores the file in S3. A file reference is embedded in the message.\n\nSlack generates rich previews for URLs (unfurling), fetching OpenGraph metadata, images, and summaries from linked websites.',
      highlightNodes: ['file-service', 'api-server'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use WebSockets instead of polling or Server-Sent Events?',
      answer:
        'WebSockets provide full-duplex communication — the server pushes messages to clients instantly without polling delay. Unlike SSE (which is server-to-client only), WebSockets allow the client to send typing indicators and presence updates on the same connection. The persistent connection reduces latency compared to repeated HTTP requests.',
    },
    {
      question: 'Why shard MySQL by workspace and channel instead of using a NoSQL database?',
      answer:
        'Slack\'s access pattern is heavily channel-centric: load messages for a channel, paginate message history, search within a workspace. Sharding by workspace+channel keeps related data co-located, enabling efficient queries without cross-shard joins. MySQL provides strong consistency and ACID transactions for critical operations like message ordering.',
    },
    {
      question: 'Why maintain a PHP monolith alongside specialized services?',
      answer:
        'The PHP/Hack monolith contains 10+ years of business logic that works reliably. Rewriting everything would be risky and slow. Instead, Slack extracted latency-critical paths (WebSocket handling, message fan-out) into Java/Go services while keeping the monolith for less latency-sensitive operations. This pragmatic approach balances velocity with performance.',
    },
  ],
  tradeoffs: {
    scalability: 8,
    availability: 9,
    consistency: 8,
    latency: 8,
    durability: 8,
    simplicity: 5,
  },
  furtherReading: [
    { title: 'How Slack Works — ByteByteGo', url: 'https://lnkd.in/eATMDjrK', type: 'blog' },
    { title: 'Slack Engineering Blog', url: 'https://slack.engineering/', type: 'blog' },
    { title: 'Scaling Slack — Infrastructure Challenges', url: 'https://www.youtube.com/watch?v=o4f5G9q_9O4', type: 'video' },
    { title: 'Slack API Documentation', url: 'https://api.slack.com/', type: 'docs' },
  ],
};
