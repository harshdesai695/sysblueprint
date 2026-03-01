import { SystemDetail } from './types';

export const amazonS3Detail: SystemDetail = {
  slug: 'amazon-s3',
  summary:
    'Amazon S3 provides object storage with eleven 9s (99.999999999%) durability by replicating data across multiple Availability Zones. Objects are stored in a flat namespace within buckets, with the key serving as the full path. The system uses consistent hashing for data placement, erasure coding for storage efficiency, and a metadata service backed by a distributed key-value store.',
  analogy:
    'Think of S3 as an infinite warehouse with numbered shelves. You give each item a unique label (key), place it on a shelf (bucket), and S3 makes several copies stored in different buildings (Availability Zones). When you want the item back, you just provide the label. The warehouse automatically expands — you never run out of shelves.',
  nodes: [
    { id: 'client', label: 'Client / SDK', position: { x: 0, y: 200 }, description: 'Application using the AWS SDK or REST API to interact with S3. Supports multipart upload for large objects, presigned URLs for temporary access, and transfer acceleration.', type: 'client', techStack: ['AWS SDK', 'REST API', 'HTTP/2'] },
    { id: 'api-frontend', label: 'S3 API Frontend', position: { x: 200, y: 200 }, description: 'RESTful HTTP endpoint that authenticates requests using SigV4, validates bucket policies and IAM permissions, parses the operation (GET, PUT, DELETE), and routes to the appropriate backend.', type: 'gateway', techStack: ['REST', 'SigV4', 'IAM'] },
    { id: 'metadata-store', label: 'Metadata Store', position: { x: 450, y: 100 }, description: 'Distributed key-value store that maps object keys to their physical storage locations, checksums, versions, and metadata. Supports strong read-after-write consistency via a coordination protocol.', type: 'storage', techStack: ['Distributed KV', 'Paxos', 'DynamoDB'] },
    { id: 'placement-service', label: 'Placement Service', position: { x: 450, y: 300 }, description: 'Determines which storage nodes and Availability Zones should hold an object\'s data chunks. Uses consistent hashing with virtual nodes to ensure even distribution and minimal data movement during scaling.', type: 'service', techStack: ['Consistent Hashing', 'Virtual Nodes'] },
    { id: 'storage-nodes', label: 'Storage Nodes', position: { x: 700, y: 200 }, description: 'Physical servers with attached disks that store object data. Each storage node manages a set of data partitions and runs continual integrity checking (bit rot detection) using checksums.', type: 'storage', techStack: ['Linux', 'XFS', 'Custom Storage Engine'] },
    { id: 'replication', label: 'Replication Engine', position: { x: 700, y: 400 }, description: 'Ensures objects are replicated across at least 3 Availability Zones. Uses erasure coding (splitting data into fragments with parity) for storage efficiency — 1.5x overhead vs 3x for simple replication.', type: 'processing', techStack: ['Erasure Coding', 'Reed-Solomon', 'Cross-AZ'] },
    { id: 'index-tier', label: 'Index Tier', position: { x: 200, y: 400 }, description: 'Manages bucket-level operations: listing objects, handling pagination, and maintaining the logical namespace. Uses a partition-based B-tree index for efficient prefix-based listing.', type: 'storage', techStack: ['B-tree Index', 'Partitioned'] },
    { id: 'lifecycle-service', label: 'Lifecycle Manager', position: { x: 450, y: 500 }, description: 'Automatically transitions objects between storage classes (Standard → Infrequent Access → Glacier) based on configured rules. Also handles expiration and incomplete multipart upload cleanup.', type: 'service', techStack: ['Batch Processing', 'S3 Storage Classes'] },
    { id: 'cdn-edge', label: 'CloudFront Edge', position: { x: 0, y: 400 }, description: 'CDN edge locations that cache frequently accessed objects close to users, reducing latency and S3 load. Transfer Acceleration uses CloudFront edges as ingestion points for faster uploads.', type: 'infrastructure', techStack: ['CloudFront', 'Edge POP'] },
  ],
  edges: [
    { id: 'e1', source: 'client', target: 'api-frontend', label: 'PUT/GET Object', edgeType: 'protocol' },
    { id: 'e2', source: 'api-frontend', target: 'metadata-store', label: 'Lookup Key', edgeType: 'data' },
    { id: 'e3', source: 'api-frontend', target: 'placement-service', label: 'Compute Placement', edgeType: 'default' },
    { id: 'e4', source: 'placement-service', target: 'storage-nodes', label: 'Write Data', edgeType: 'protocol' },
    { id: 'e5', source: 'storage-nodes', target: 'replication', label: 'Replicate', edgeType: 'async', animated: true },
    { id: 'e6', source: 'replication', target: 'storage-nodes', label: 'Cross-AZ Copy', edgeType: 'async', animated: true },
    { id: 'e7', source: 'metadata-store', target: 'storage-nodes', label: 'Location Map', edgeType: 'data' },
    { id: 'e8', source: 'api-frontend', target: 'index-tier', label: 'List/Prefix', edgeType: 'data' },
    { id: 'e9', source: 'lifecycle-service', target: 'storage-nodes', label: 'Tier Transition', edgeType: 'control' },
    { id: 'e10', source: 'client', target: 'cdn-edge', label: 'Cached GET', edgeType: 'protocol' },
  ],
  steps: [
    {
      number: 1,
      title: 'PUT Request — Object Upload',
      description:
        'The client sends a PUT request with the bucket name, object key, and data payload. For objects larger than 100MB, multipart upload splits the object into parts uploaded in parallel, then assembled server-side.\n\nThe API frontend authenticates the request using SigV4 (signing the request with the user\'s secret access key), checks IAM policies and bucket policies, then proceeds with storage.',
      highlightNodes: ['client', 'api-frontend'],
    },
    {
      number: 2,
      title: 'Metadata Registration',
      description:
        'The metadata store records the object\'s key, size, content type, checksum, storage class, and versioning information. Since 2020, S3 guarantees strong read-after-write consistency — a GET immediately after a PUT will always return the latest data.\n\nThis consistency is achieved through a coordination protocol that ensures the metadata store acknowledges writes before returning success to the client.',
      highlightNodes: ['api-frontend', 'metadata-store'],
    },
    {
      number: 3,
      title: 'Data Placement',
      description:
        'The placement service determines which storage nodes across multiple Availability Zones should store the object. Consistent hashing with virtual nodes maps the object key to a set of storage partitions, ensuring even distribution.\n\nVirtual nodes allow heterogeneous hardware — a storage node with more capacity gets more virtual nodes assigned, proportionally handling more data.',
      highlightNodes: ['placement-service'],
    },
    {
      number: 4,
      title: 'Data Writing and Erasure Coding',
      description:
        'Object data is written to storage nodes. For durability, the data is split into fragments using Reed-Solomon erasure coding. For example, an object might be split into 8 data fragments and 3 parity fragments — the original object can be reconstructed from any 8 of the 11 fragments.\n\nThis achieves 11 nines of durability with only ~1.4x storage overhead, compared to 3x overhead for triple replication.',
      highlightNodes: ['storage-nodes', 'replication'],
    },
    {
      number: 5,
      title: 'Cross-AZ Replication',
      description:
        'Fragments are distributed across at least 3 Availability Zones within a region. Each AZ is a separate physical data center with independent power, cooling, and networking. The PUT request returns success only after the data is durably stored in multiple AZs.\n\nContinuous background processes verify data integrity using checksums and automatically repair any corrupted or lost fragments (self-healing).',
      highlightNodes: ['replication', 'storage-nodes'],
    },
    {
      number: 6,
      title: 'GET Request — Object Retrieval',
      description:
        'A GET request is routed through the API frontend, which looks up the object\'s physical locations in the metadata store. The data is fetched from the nearest/fastest available storage node. If CloudFront is configured, the object may be served from a CDN edge cache.\n\nFor large objects, S3 supports range requests — fetching only a byte range of the object, useful for video seeking or resumable downloads.',
      highlightNodes: ['client', 'api-frontend', 'metadata-store', 'storage-nodes'],
    },
    {
      number: 7,
      title: 'Lifecycle and Storage Tiering',
      description:
        'Lifecycle policies automatically move objects between storage classes based on age or access patterns. S3 Intelligent-Tiering monitors access frequency and moves objects between hot and cold tiers automatically.\n\nTransitions follow the order: Standard → Infrequent Access → Glacier Instant Retrieval → Glacier Flexible Retrieval → Glacier Deep Archive, with decreasing cost but increasing retrieval latency.',
      highlightNodes: ['lifecycle-service'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use erasure coding instead of simple replication?',
      answer:
        'Simple 3-way replication stores 3 full copies, consuming 3x storage. Reed-Solomon erasure coding achieves the same (or better) durability with only ~1.4x overhead by storing data fragments plus parity fragments. The tradeoff is increased CPU cost for encoding/decoding, but for a storage-heavy system like S3, the storage savings at exabyte scale far outweigh the compute cost.',
    },
    {
      question: 'Why did S3 switch from eventual to strong consistency?',
      answer:
        'Eventual consistency caused subtle bugs: a PUT followed immediately by a GET might return stale data or 404. Developers had to add workarounds (delays, retries). AWS re-architected the metadata path using a coordination protocol to guarantee strong read-after-write consistency at no extra cost or latency penalty, making S3 much simpler to reason about.',
    },
    {
      question: 'Why use a flat namespace with key prefixes instead of real directories?',
      answer:
        'S3 uses a flat key-value model — the "path" `/photos/2024/vacation/img.jpg` is just a string key, not a directory hierarchy. This simplifies the backend immensely: no need for directory metadata, rename operations, or hierarchical locking. Listing by prefix simulates directory browsing at the API level without the complexity of a filesystem.',
    },
  ],
  tradeoffs: {
    scalability: 10,
    availability: 10,
    consistency: 8,
    latency: 7,
    durability: 10,
    simplicity: 7,
  },
  furtherReading: [
    { title: 'How Amazon S3 Works — ByteByteGo', url: 'https://lnkd.in/e2p7qXri', type: 'blog' },
    { title: 'Amazon S3 Developer Guide', url: 'https://docs.aws.amazon.com/s3/index.html', type: 'docs' },
    { title: 'Diving Deep on S3 Consistency (AWS re:Invent)', url: 'https://www.youtube.com/watch?v=MEgRKisSMzg', type: 'video' },
    { title: 'Erasure Coding in Distributed Storage Systems', url: 'https://www.usenix.org/system/files/login/articles/10_plank-online.pdf', type: 'paper' },
  ],
};
