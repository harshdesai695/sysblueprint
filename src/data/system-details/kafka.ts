import type { ISystemDesign } from './types';

export const kafkaDetail: ISystemDesign = {
  slug: 'kafka',
  summary:
    'Apache Kafka is a distributed event streaming platform built around an append-only commit log. Producers write records to topic partitions, which are replicated across brokers for fault tolerance. Consumers read from partitions using offset-based tracking, enabling replay and exactly-once semantics. Kafka handles trillions of messages per day at LinkedIn.',
  analogy:
    'Think of Kafka as a massive conveyor belt system in a factory. Producers place items (messages) onto labeled belts (topic partitions). Multiple workers (consumers) can read from any belt at their own pace, and items stay on the belt for days so any worker can rewind and re-read. The belts are duplicated across buildings (replicas) so the factory never stops.',
  nodes: [
    { id: 'producer', label: 'Producers', position: { x: 0, y: 200 }, description: 'Applications that publish records to Kafka topics. Each record has a key, value, headers, and timestamp. The producer client handles batching, compression (lz4, zstd, snappy), and partitioning.', type: 'client', techStack: ['Java Client', 'librdkafka', 'Batching'] },
    { id: 'broker-1', label: 'Broker 1 (Leader)', position: { x: 350, y: 100 }, description: 'A Kafka broker is a server that receives records from producers, stores them on disk in the commit log, and serves them to consumers. The leader replica handles all reads and writes for its assigned partitions.', type: 'service', techStack: ['JVM', 'Zero-Copy', 'Page Cache'] },
    { id: 'broker-2', label: 'Broker 2 (Follower)', position: { x: 350, y: 300 }, description: 'Follower replicas continuously fetch records from the leader to stay in sync. If the leader fails, an in-sync replica (ISR) is elected as the new leader. Followers do not serve consumer reads in classic Kafka.', type: 'service', techStack: ['JVM', 'ISR Protocol'] },
    { id: 'broker-3', label: 'Broker 3 (Follower)', position: { x: 350, y: 500 }, description: 'Additional follower replica for higher durability. The replication factor (typically 3) determines how many brokers hold a copy of each partition. Data is only acknowledged after the configured number of replicas confirm.', type: 'service', techStack: ['JVM', 'ISR Protocol'] },
    { id: 'partition-log', label: 'Partition Log', position: { x: 600, y: 100 }, description: 'Each partition is an ordered, immutable append-only log of records stored on disk. Records are assigned sequential offsets. Segments are rotated by size or time, and old segments are deleted or compacted based on retention policy.', type: 'storage', techStack: ['Append-Only Log', 'Segments', 'Offset Index'] },
    { id: 'controller', label: 'Controller (KRaft)', position: { x: 600, y: 350 }, description: 'Manages cluster metadata: topic/partition assignments, leader election, broker membership. KRaft mode (replacing ZooKeeper) uses Raft consensus among a quorum of controller nodes for metadata replication.', type: 'service', techStack: ['KRaft', 'Raft Consensus', 'Metadata Log'] },
    { id: 'consumer-group', label: 'Consumer Group', position: { x: 850, y: 200 }, description: 'A group of consumer instances that cooperatively consume from a topic. Each partition is assigned to exactly one consumer in the group (via the Group Coordinator). Rebalancing occurs when consumers join or leave.', type: 'client', techStack: ['Offset Commit', 'Rebalance Protocol'] },
    { id: 'schema-registry', label: 'Schema Registry', position: { x: 0, y: 400 }, description: 'Stores and validates Avro, Protobuf, or JSON schemas for topic data. Ensures producers and consumers agree on data format. Supports schema evolution with compatibility checks.', type: 'service', techStack: ['Avro', 'Protobuf', 'Compatibility Checks'] },
    { id: 'connect', label: 'Kafka Connect', position: { x: 850, y: 450 }, description: 'Framework for streaming data between Kafka and external systems (databases, search indexes, data lakes). Source connectors import data into Kafka, sink connectors export data from Kafka.', type: 'service', techStack: ['CDC', 'Debezium', 'JDBC Connector'] },
  ],
  edges: [
    { id: 'e1', source: 'producer', target: 'broker-1', label: 'Produce Records', edgeType: 'protocol' },
    { id: 'e2', source: 'broker-1', target: 'partition-log', label: 'Append to Log', edgeType: 'data' },
    { id: 'e3', source: 'broker-1', target: 'broker-2', label: 'Replicate', edgeType: 'async', animated: true },
    { id: 'e4', source: 'broker-1', target: 'broker-3', label: 'Replicate', edgeType: 'async', animated: true },
    { id: 'e5', source: 'partition-log', target: 'consumer-group', label: 'Fetch Records', edgeType: 'protocol' },
    { id: 'e6', source: 'controller', target: 'broker-1', label: 'Leader Election', edgeType: 'control' },
    { id: 'e7', source: 'controller', target: 'broker-2', label: 'Metadata', edgeType: 'control' },
    { id: 'e8', source: 'producer', target: 'schema-registry', label: 'Validate Schema', edgeType: 'data' },
    { id: 'e9', source: 'consumer-group', target: 'connect', label: 'Sink Data', edgeType: 'async', animated: true },
    { id: 'e10', source: 'controller', target: 'broker-3', label: 'Metadata', edgeType: 'control' },
  ],
  steps: [
    {
      number: 1,
      title: 'Producer Sends Records',
      description:
        'A producer application creates records and sends them to a Kafka topic. The producer client partitions records by key hash (ensuring same-key records go to the same partition for ordering) or uses round-robin for even distribution.\n\nRecords are batched by partition and compressed (lz4 or zstd) before sending. The `acks` configuration controls durability: `acks=all` waits for all in-sync replicas to acknowledge, providing the strongest guarantee.',
      highlightNodes: ['producer', 'broker-1'],
    },
    {
      number: 2,
      title: 'Append to Commit Log',
      description:
        'The broker leader appends incoming records to the partition\'s commit log — an append-only, immutable sequence of records on disk. Each record gets a sequential offset number (0, 1, 2, ...).\n\nKafka achieves high throughput by writing sequentially (no random disk seeks) and leveraging the OS page cache. Records are written to a memory-mapped file and flushed to disk asynchronously, achieving millions of writes per second per broker.',
      highlightNodes: ['broker-1', 'partition-log'],
    },
    {
      number: 3,
      title: 'Replication to Followers',
      description:
        'Follower replicas fetch records from the leader using a pull-based protocol. Each follower maintains its own copy of the partition log. The In-Sync Replica (ISR) set tracks which followers are caught up.\n\nIf a follower falls too far behind (exceeding `replica.lag.time.max.ms`), it is removed from the ISR. Only ISR members are eligible for leader election, preventing data loss.',
      highlightNodes: ['broker-1', 'broker-2', 'broker-3'],
    },
    {
      number: 4,
      title: 'Leader Election with KRaft',
      description:
        'The controller quorum (running KRaft, Kafka\'s Raft implementation) manages cluster metadata and orchestrates leader election. When a broker fails, the controller selects a new leader from the ISR for each affected partition.\n\nKRaft replaced ZooKeeper to eliminate the operational complexity of running a separate coordination service. The metadata log itself is stored as a Kafka topic, reusing the same replication protocol.',
      highlightNodes: ['controller', 'broker-1', 'broker-2'],
    },
    {
      number: 5,
      title: 'Consumer Group Reads',
      description:
        'Consumers in a consumer group subscribe to topics. The Group Coordinator assigns partitions to consumers — each partition is consumed by exactly one consumer in the group. If a consumer fails, its partitions are reassigned (rebalancing).\n\nConsumers track their position via committed offsets. They can replay data by resetting offsets to any position, enabling reprocessing of historical data. This is a key difference from traditional message queues where consumed messages are deleted.',
      highlightNodes: ['consumer-group', 'partition-log'],
    },
    {
      number: 6,
      title: 'Schema Validation',
      description:
        'The Schema Registry stores versioned schemas for topic data. Producers serialize records using the schema and embed the schema ID. Consumers deserialize using the same schema.\n\nSchema evolution rules (backward, forward, full compatibility) ensure producers can add fields without breaking consumers. This decouples producer and consumer deployment cycles.',
      highlightNodes: ['schema-registry', 'producer'],
    },
    {
      number: 7,
      title: 'Kafka Connect Integration',
      description:
        'Kafka Connect provides pre-built connectors for streaming data between Kafka and external systems. Source connectors (e.g., Debezium for CDC) capture database changes into Kafka topics. Sink connectors push Kafka data to search indexes, data lakes, or databases.\n\nConnectors run as distributed tasks across a Connect cluster, with automatic offset tracking and fault tolerance.',
      highlightNodes: ['connect', 'consumer-group'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use an append-only log instead of a mutable data structure?',
      answer:
        'Append-only writes are sequential, which matches disk I/O patterns perfectly — sequential writes on modern disks achieve 600MB/s+ throughput. The immutable log also simplifies replication (followers just replicate the same sequence), enables consumer replay (read from any offset), and eliminates concurrency issues (no locking needed for reads).',
    },
    {
      question: 'Why replace ZooKeeper with KRaft?',
      answer:
        'ZooKeeper was a separate distributed system that added operational complexity, scaling bottlenecks, and a different failure domain. KRaft embeds consensus directly in Kafka brokers using the Raft protocol, reducing the number of processes to manage, improving metadata throughput, and enabling Kafka to scale to millions of partitions (ZooKeeper struggled beyond ~200k).',
    },
    {
      question: 'Why use pull-based consumption instead of push-based?',
      answer:
        'Pull-based consumption lets each consumer control its own consumption rate. Fast consumers read at full speed while slow consumers aren\'t overwhelmed. Consumers can also batch fetches for efficiency, retry at will, and maintain their own backpressure. Push-based systems must track each consumer\'s capacity and risk overwhelming slow consumers.',
    },
    {
      question: 'Why does Kafka retain messages instead of deleting after consumption?',
      answer:
        'Retaining messages for a configurable period (hours to forever) enables powerful patterns: consumer replay for reprocessing, new consumers reading historical data, debugging production issues by replaying events, and multiple consumer groups independently consuming the same data. This transforms Kafka from a queue into a distributed commit log.',
    },
  ],
  plainSummary:
    'Kafka is like a super-fast post office for data. Instead of delivering letters to mailboxes, it takes streams of data (messages) from many senders (producers) and delivers them to many receivers (consumers) — all in real time, never losing a message, and handling millions of deliveries per second.',

  flowSteps: [
    { emoji: '📤', title: 'A producer sends data', description: 'An application sends a message (like a log entry or event) to Kafka.' },
    { emoji: '📋', title: 'Message goes to a topic', description: 'Messages are organized by topic — like sorting mail into different mailboxes by category.' },
    { emoji: '🗂️', title: 'Topic is split into partitions', description: 'Each topic is divided into partitions so multiple servers can share the load.' },
    { emoji: '💾', title: 'Data is written to disk', description: 'Messages are appended to an ordered log file on disk — fast and reliable.' },
    { emoji: '🔄', title: 'Copies are made', description: 'Each partition is replicated to other servers, so data survives even if a machine fails.' },
    { emoji: '📥', title: 'Consumers read the data', description: 'Applications subscribe to topics and pull messages at their own pace, tracking their position.' },
  ],

  keyMetrics: [
    { label: 'Throughput', value: '2M msgs/s', icon: '⚡', description: 'Per-cluster message throughput' },
    { label: 'Latency', value: '<10ms', icon: '⏱️', description: 'End-to-end produce-to-consume latency' },
    { label: 'Daily Events', value: '7T+ (LinkedIn)', icon: '📊', description: 'Messages processed per day at LinkedIn' },
    { label: 'Retention', value: 'Days–∞', icon: '💾', description: 'Configurable message retention period' },
  ],

  furtherReading: [
    { title: 'How Kafka Works — ByteByteGo', url: 'https://lnkd.in/eTtVAjTg', type: 'blog' },
    { title: 'Kafka: a Distributed Messaging System for Log Processing', url: 'https://www.microsoft.com/en-us/research/publication/kafka-a-distributed-messaging-system-for-log-processing/', type: 'paper' },
    { title: 'Apache Kafka Documentation', url: 'https://kafka.apache.org/documentation/', type: 'docs' },
    { title: 'KIP-500: Replace ZooKeeper with a Self-Managed Metadata Quorum', url: 'https://cwiki.apache.org/confluence/display/KAFKA/KIP-500', type: 'docs' },
  ],
};
