import { SystemDetail } from './types';

export const blueskyDetail: SystemDetail = {
  slug: 'bluesky',
  summary:
    'Bluesky is a decentralized social network built on the AT Protocol (Authenticated Transfer Protocol). Users own their data in Personal Data Servers (PDSes), identity is portable via DIDs, and content is aggregated by Relay nodes that crawl PDSes and feed data to App Views — application-specific indexers that power the user experience. This architecture separates identity, data, and applications.',
  analogy:
    'Imagine email, but for social media. Your posts live on your "email server" (PDS) that you can move between providers. A relay (like an email hub) collects posts from all servers and distributes them to apps (like email clients) that display your feed. Your identity (like an email address) works across all providers — you can switch servers without losing followers.',
  nodes: [
    { id: 'user', label: 'User / Client App', position: { x: 0, y: 200 }, description: 'A Bluesky client application (web or mobile). Users interact with the social network through the client, which communicates with their PDS for writes and the App View for reads.', type: 'client', techStack: ['React Native', 'XRPC', 'TypeScript'] },
    { id: 'pds', label: 'Personal Data Server', position: { x: 250, y: 100 }, description: 'Each user\'s data home. Stores their posts, likes, follows, and profile in a Merkle Search Tree (MST) — a content-addressed data structure that makes data portable and verifiable. Users can host their own PDS or use a provider.', type: 'service', techStack: ['TypeScript', 'SQLite', 'MST', 'XRPC'] },
    { id: 'did-resolver', label: 'DID Resolver', position: { x: 250, y: 350 }, description: 'Resolves Decentralized Identifiers (DIDs) to the user\'s current PDS location. Uses did:plc (a custom method with a central registry) or did:web (DNS-based). DIDs enable portable identity — changing PDS doesn\'t change your identity.', type: 'service', techStack: ['did:plc', 'did:web', 'PLC Directory'] },
    { id: 'relay', label: 'Relay (Firehose)', position: { x: 500, y: 200 }, description: 'Crawls all PDSes via their event streams, aggregating every create/update/delete operation into a unified firehose. The Relay validates repository signatures and provides a single stream that downstream services subscribe to.', type: 'service', techStack: ['Go', 'WebSocket', 'Event Stream'] },
    { id: 'appview', label: 'App View', position: { x: 700, y: 100 }, description: 'Application-specific indexer that consumes the Relay firehose and builds read-optimized views: home timeline, notifications, search, thread views. Different App Views can offer different experiences on the same data.', type: 'service', techStack: ['TypeScript', 'PostgreSQL', 'ScyllaDB'] },
    { id: 'feed-generator', label: 'Feed Generator', position: { x: 700, y: 350 }, description: 'Third-party algorithmic feed services. Anyone can build a custom feed algorithm that the client can subscribe to. Feed generators consume the firehose and return ranked post lists based on custom criteria.', type: 'service', techStack: ['Custom Algorithms', 'REST API'] },
    { id: 'labeler', label: 'Labeler Service', position: { x: 500, y: 400 }, description: 'Content moderation layer. Labelers attach labels to content (spam, nudity, misinformation) that clients use to filter or warn. Multiple labelers can operate simultaneously, and users choose which labelers to trust.', type: 'processing', techStack: ['ML Classifiers', 'Human Review', 'Labels'] },
    { id: 'mst-repo', label: 'User Repository (MST)', position: { x: 250, y: 500 }, description: 'Each user\'s data is stored as a signed Merkle Search Tree. Every record (post, like, follow) is a node in the tree. The MST enables efficient sync: two PDSes can compare tree roots to find differences, and cryptographic signatures ensure data integrity.', type: 'storage', techStack: ['Merkle Search Tree', 'CBOR', 'CID'] },
  ],
  edges: [
    { id: 'e1', source: 'user', target: 'pds', label: 'Write (Post/Like)', edgeType: 'protocol' },
    { id: 'e2', source: 'user', target: 'appview', label: 'Read (Feed/Search)', edgeType: 'protocol' },
    { id: 'e3', source: 'pds', target: 'relay', label: 'Event Stream', edgeType: 'async', animated: true },
    { id: 'e4', source: 'relay', target: 'appview', label: 'Firehose', edgeType: 'async', animated: true },
    { id: 'e5', source: 'relay', target: 'feed-generator', label: 'Firehose', edgeType: 'async', animated: true },
    { id: 'e6', source: 'relay', target: 'labeler', label: 'Firehose', edgeType: 'async', animated: true },
    { id: 'e7', source: 'user', target: 'did-resolver', label: 'Resolve Identity', edgeType: 'data' },
    { id: 'e8', source: 'pds', target: 'mst-repo', label: 'Store Records', edgeType: 'data' },
    { id: 'e9', source: 'labeler', target: 'appview', label: 'Content Labels', edgeType: 'data' },
    { id: 'e10', source: 'feed-generator', target: 'user', label: 'Custom Feed', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Identity and DID Resolution',
      description:
        'Each user has a Decentralized Identifier (DID) that is independent of any server. The DID resolves to a DID Document containing the user\'s current PDS location and signing key. This enables portable identity — a user can migrate to a new PDS and update their DID Document, and all references to their DID continue to work.\n\nUsers also have a human-readable handle (like @alice.bsky.social) backed by DNS verification.',
      highlightNodes: ['user', 'did-resolver'],
    },
    {
      number: 2,
      title: 'Writing Data to PDS',
      description:
        'When a user creates a post, the client sends the record to their PDS via XRPC (a cross-platform RPC protocol). The PDS stores the record in the user\'s Merkle Search Tree repository, signs it with the user\'s key, and emits an event to its event stream.\n\nThe MST structure means each update produces a new tree root hash, creating an auditable history of all changes. CBOR (Concise Binary Object Representation) is used for efficient binary serialization.',
      highlightNodes: ['user', 'pds', 'mst-repo'],
    },
    {
      number: 3,
      title: 'Relay Aggregation',
      description:
        'The Relay subscribes to event streams from all known PDSes. It validates that each event is properly signed by the user\'s key (verified via the DID Document). Valid events are merged into a unified firehose — a single ordered stream of every create, update, and delete across the entire network.\n\nThe Relay is a scalability bottleneck by design — it\'s the point where the decentralized network is aggregated for downstream consumers. Multiple Relay operators can exist for redundancy.',
      highlightNodes: ['pds', 'relay'],
    },
    {
      number: 4,
      title: 'App View Indexing',
      description:
        'The App View consumes the Relay firehose and builds application-specific indexes: timelines, follow graphs, notification lists, and full-text search. It\'s essentially a read-optimized projection of the full network state.\n\nDifferent App Views can provide different experiences — one might focus on microblogging (like Bluesky itself), while another could build a photo-sharing experience on the same underlying data.',
      highlightNodes: ['relay', 'appview'],
    },
    {
      number: 5,
      title: 'Custom Feed Algorithms',
      description:
        'Feed generators are third-party services that consume the firehose and produce custom algorithmic feeds. Users can subscribe to any feed generator from their client. Examples include: "Most Popular in Tech", "Art Feed", or "Posts from Small Accounts".\n\nThis separates the algorithm from the platform — unlike centralized networks where the company controls what you see, Bluesky users choose their own feed algorithms.',
      highlightNodes: ['feed-generator', 'relay', 'user'],
    },
    {
      number: 6,
      title: 'Decentralized Moderation',
      description:
        'Labeler services consume the firehose and attach labels to content (spam, NSFW, misinformation). Users and client apps subscribe to labelers they trust and filter content based on those labels.\n\nThis stackable moderation model means no single entity controls content moderation. Community-specific labelers can apply community-specific standards, while users have the final say on which labels they enforce.',
      highlightNodes: ['labeler', 'appview', 'user'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use DIDs for identity instead of usernames or email-based auth?',
      answer:
        'DIDs are cryptographically owned — no server can revoke your identity. If your PDS provider shuts down or bans you, your DID (and all references to your content) remain valid. You can migrate to a new PDS and update your DID Document. This prevents vendor lock-in and gives users true ownership of their social identity.',
    },
    {
      question: 'Why use a Merkle Search Tree for data storage?',
      answer:
        'The MST enables efficient data synchronization between servers. Two PDSes can compare MST roots to cheaply determine what has changed (similar to git). Content addressing (CIDs) ensures data integrity — any tampering is detectable. The signed tree structure makes the user\'s complete post history auditable and portable.',
    },
    {
      question: 'Why separate the Relay, App View, and Feed Generator into distinct services?',
      answer:
        'This separation of concerns eliminates platform lock-in. The Relay handles data aggregation, App Views handle read-path UI, and Feed Generators handle algorithmic ranking. Each layer can be operated by different entities. If you dislike the Bluesky App View\'s moderation, you can switch to another App View while keeping the same identity and social graph.',
    },
    {
      question: 'Why allow third-party feed algorithms?',
      answer:
        'Centralized platforms control what users see through opaque algorithms optimized for engagement. Bluesky\'s open feed generator protocol lets anyone build and publish feed algorithms. Users choose which feeds to subscribe to, restoring agency over their information diet. This also enables innovation — niche communities can build feeds tailored to their specific interests.',
    },
  ],
  tradeoffs: {
    scalability: 7,
    availability: 7,
    consistency: 5,
    latency: 6,
    durability: 8,
    simplicity: 3,
  },
  furtherReading: [
    { title: 'How Bluesky Works — ByteByteGo', url: 'https://lnkd.in/eEhB8V_k', type: 'blog' },
    { title: 'AT Protocol Specification', url: 'https://atproto.com/specs/atp', type: 'docs' },
    { title: 'Bluesky Architecture Overview', url: 'https://blueskyweb.xyz/blog/3-6-2022-a-self-authenticating-social-protocol', type: 'blog' },
    { title: 'AT Protocol GitHub Repository', url: 'https://github.com/bluesky-social/atproto', type: 'docs' },
  ],
};
