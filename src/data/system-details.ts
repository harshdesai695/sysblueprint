export interface DiagramNode {
  id: string;
  label: string;
  description: string;
  type?: string;
  position: { x: number; y: number };
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  highlightNodes: string[];
}

export interface DesignDecision {
  question: string;
  answer: string;
  optionA?: string;
  optionB?: string;
}

export interface TradeOff {
  scalability: number;
  availability: number;
  consistency: number;
  latency: number;
  durability: number;
  simplicity: number;
}

export interface FurtherReading {
  title: string;
  url: string;
  type: 'blog' | 'paper' | 'video' | 'docs';
}

export interface SystemDetail {
  slug: string;
  summary: string;
  analogy: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: Step[];
  designDecisions: DesignDecision[];
  tradeoffs: TradeOff;
  furtherReading: FurtherReading[];
}

export const systemDetails: Record<string, SystemDetail> = {
  'chatgpt': {
    slug: 'chatgpt',
    summary: 'ChatGPT is a large language model service that processes natural language prompts through transformer-based neural networks to generate human-like text responses.',
    analogy: 'ChatGPT is like a brilliant librarian who has read every book in the world and can compose new text by predicting the most likely next word, thousands of times per second.',
    nodes: [
      { id: 'user', label: 'User', description: 'End user sending a prompt through the web interface or API.', position: { x: 50, y: 200 } },
      { id: 'api-gateway', label: 'API Gateway', description: 'Routes requests, handles rate limiting, authentication, and load distribution.', position: { x: 250, y: 200 } },
      { id: 'load-balancer', label: 'Load Balancer', description: 'Distributes inference requests across GPU clusters for optimal utilization.', position: { x: 450, y: 200 } },
      { id: 'tokenizer', label: 'Tokenizer', description: 'Converts text into tokens (sub-word units) that the model can process. Uses BPE encoding.', position: { x: 650, y: 100 } },
      { id: 'gpu-cluster', label: 'GPU Cluster', description: 'Thousands of GPUs (A100/H100) running the transformer model for inference.', position: { x: 650, y: 300 } },
      { id: 'model', label: 'LLM Model', description: 'The transformer neural network with billions of parameters that generates text token by token.', position: { x: 850, y: 200 } },
      { id: 'safety', label: 'Safety Filter', description: 'Content moderation layer using RLHF and rule-based filters to ensure safe outputs.', position: { x: 1050, y: 200 } },
      { id: 'cache', label: 'KV Cache', description: 'Caches key-value attention states to speed up autoregressive token generation.', position: { x: 850, y: 400 } },
      { id: 'response', label: 'Streaming Response', description: 'Tokens are streamed back to the user as they are generated via Server-Sent Events.', position: { x: 1250, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'api-gateway', label: 'Prompt', animated: true },
      { id: 'e2', source: 'api-gateway', target: 'load-balancer', label: 'Route' },
      { id: 'e3', source: 'load-balancer', target: 'tokenizer', label: 'Text' },
      { id: 'e4', source: 'load-balancer', target: 'gpu-cluster', label: 'Assign' },
      { id: 'e5', source: 'tokenizer', target: 'model', label: 'Tokens' },
      { id: 'e6', source: 'gpu-cluster', target: 'model', label: 'Compute' },
      { id: 'e7', source: 'model', target: 'safety', label: 'Output', animated: true },
      { id: 'e8', source: 'model', target: 'cache', label: 'KV States' },
      { id: 'e9', source: 'safety', target: 'response', label: 'Stream', animated: true },
    ],
    steps: [
      { number: 1, title: 'User Sends Prompt', description: 'The user types a message in the ChatGPT interface. The prompt is sent to OpenAI\'s API gateway.', highlightNodes: ['user', 'api-gateway'] },
      { number: 2, title: 'Request Routing', description: 'The API gateway authenticates the request, applies rate limits, and forwards it to a load balancer.', highlightNodes: ['api-gateway', 'load-balancer'] },
      { number: 3, title: 'Tokenization', description: 'The input text is broken into tokens using Byte-Pair Encoding (BPE). "Hello world" might become ["Hel", "lo", " world"].', highlightNodes: ['tokenizer'] },
      { number: 4, title: 'GPU Assignment', description: 'The load balancer assigns the request to an available GPU cluster with sufficient memory for the model.', highlightNodes: ['load-balancer', 'gpu-cluster'] },
      { number: 5, title: 'Model Inference', description: 'The transformer model processes all input tokens in parallel through attention layers, then generates output tokens one at a time.', highlightNodes: ['model', 'gpu-cluster'] },
      { number: 6, title: 'KV Caching', description: 'Key-value attention states are cached so previously computed tokens don\'t need reprocessing during autoregressive generation.', highlightNodes: ['cache', 'model'] },
      { number: 7, title: 'Safety Filtering', description: 'Output passes through content moderation trained via RLHF (Reinforcement Learning from Human Feedback).', highlightNodes: ['safety'] },
      { number: 8, title: 'Streaming Response', description: 'Tokens are streamed to the user as they\'re generated via Server-Sent Events, creating the "typing" effect.', highlightNodes: ['response'] },
    ],
    designDecisions: [
      { question: 'Why use autoregressive generation instead of generating all tokens at once?', answer: 'Each token depends on all previous tokens. The model predicts the next most likely token given the context, which requires sequential generation but produces coherent text.' },
      { question: 'Why use GPUs instead of CPUs?', answer: 'Transformer models require massive parallel matrix multiplications. GPUs have thousands of cores optimized for this, making inference 10-100x faster than CPUs.' },
      { question: 'Why stream tokens instead of waiting for the full response?', answer: 'Streaming provides perceived lower latency. Users see text appearing immediately rather than waiting potentially 30+ seconds for a complete response.' },
    ],
    tradeoffs: { scalability: 7, availability: 8, consistency: 9, latency: 6, durability: 7, simplicity: 3 },
    furtherReading: [
      { title: 'Attention Is All You Need (Original Transformer Paper)', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' },
      { title: 'How GPT Works - ByteByteGo', url: 'https://blog.bytebytego.com', type: 'blog' },
      { title: 'OpenAI Documentation', url: 'https://platform.openai.com/docs', type: 'docs' },
    ],
  },

  'google-search': {
    slug: 'google-search',
    summary: 'Google Search crawls billions of web pages, builds an inverted index, and ranks results using PageRank and hundreds of other signals to deliver relevant results in milliseconds.',
    analogy: 'Google Search is like a massive library where millions of librarians constantly catalog new books, and when you ask a question, they instantly find the most relevant pages across billions of volumes.',
    nodes: [
      { id: 'user', label: 'User', description: 'Person entering a search query in the browser.', position: { x: 50, y: 200 } },
      { id: 'web-server', label: 'Web Server', description: 'Frontend servers that handle the search request and render results.', position: { x: 250, y: 200 } },
      { id: 'query-parser', label: 'Query Parser', description: 'Parses and understands the search query, applies spell correction, and identifies intent.', position: { x: 450, y: 100 } },
      { id: 'index-server', label: 'Index Server', description: 'Serves the inverted index - maps words to the documents containing them.', position: { x: 650, y: 100 } },
      { id: 'doc-server', label: 'Doc Server', description: 'Stores document metadata, snippets, and cached versions of web pages.', position: { x: 650, y: 300 } },
      { id: 'ranking', label: 'Ranking Engine', description: 'Applies PageRank, ML models, and hundreds of signals to rank results by relevance.', position: { x: 850, y: 200 } },
      { id: 'crawler', label: 'Web Crawler', description: 'Googlebot continuously crawls the web, discovering and fetching new and updated pages.', position: { x: 450, y: 400 } },
      { id: 'indexer', label: 'Indexer', description: 'Processes crawled pages, extracts text, builds the inverted index and knowledge graph.', position: { x: 650, y: 400 } },
      { id: 'results', label: 'Search Results', description: 'Final ranked results returned to the user with snippets, links, and rich features.', position: { x: 1050, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'web-server', label: 'Query', animated: true },
      { id: 'e2', source: 'web-server', target: 'query-parser', label: 'Parse' },
      { id: 'e3', source: 'query-parser', target: 'index-server', label: 'Lookup' },
      { id: 'e4', source: 'index-server', target: 'ranking', label: 'Candidates' },
      { id: 'e5', source: 'doc-server', target: 'ranking', label: 'Metadata' },
      { id: 'e6', source: 'ranking', target: 'results', label: 'Ranked', animated: true },
      { id: 'e7', source: 'crawler', target: 'indexer', label: 'Pages' },
      { id: 'e8', source: 'indexer', target: 'index-server', label: 'Update Index' },
      { id: 'e9', source: 'indexer', target: 'doc-server', label: 'Store Docs' },
    ],
    steps: [
      { number: 1, title: 'User Enters Query', description: 'A user types a search query. Autocomplete suggestions appear as they type.', highlightNodes: ['user', 'web-server'] },
      { number: 2, title: 'Query Analysis', description: 'The query parser corrects spelling, identifies entities, and understands search intent (informational, navigational, transactional).', highlightNodes: ['query-parser'] },
      { number: 3, title: 'Index Lookup', description: 'The inverted index maps each word to a posting list of documents containing that word. Multiple posting lists are intersected.', highlightNodes: ['index-server'] },
      { number: 4, title: 'Document Retrieval', description: 'Candidate documents are fetched from doc servers with their metadata, snippets, and relevance signals.', highlightNodes: ['doc-server'] },
      { number: 5, title: 'Ranking', description: 'Hundreds of signals (PageRank, freshness, location, device, ML models) are used to rank candidates.', highlightNodes: ['ranking'] },
      { number: 6, title: 'Results Served', description: 'Top results are returned with snippets, knowledge panels, and rich features — all within 200ms.', highlightNodes: ['results'] },
    ],
    designDecisions: [
      { question: 'Why use an inverted index instead of scanning all documents?', answer: 'An inverted index maps words to documents, enabling O(1) lookups instead of scanning billions of pages. This is what makes sub-second search possible.' },
      { question: 'Why PageRank?', answer: 'PageRank treats links as votes. Pages linked by many important pages are ranked higher. This was Google\'s key innovation over keyword-only search engines.' },
    ],
    tradeoffs: { scalability: 10, availability: 10, consistency: 7, latency: 9, durability: 9, simplicity: 2 },
    furtherReading: [
      { title: 'The Anatomy of a Search Engine (Original Google Paper)', url: 'http://infolab.stanford.edu/~backrub/google.html', type: 'paper' },
      { title: 'How Google Search Works - Google', url: 'https://www.google.com/search/howsearchworks/', type: 'docs' },
    ],
  },

  'uber-eta': {
    slug: 'uber-eta',
    summary: 'Uber calculates ETAs using a combination of real-time GPS data, historical trip data, graph-based routing algorithms, and machine learning models that account for traffic, weather, and events.',
    analogy: 'Uber\'s ETA system is like having a local taxi driver who knows every shortcut, traffic pattern, and construction zone — but powered by millions of trips worth of data and updated every second.',
    nodes: [
      { id: 'rider', label: 'Rider App', description: 'Mobile app where the rider requests a ride and sees ETA predictions.', position: { x: 50, y: 200 } },
      { id: 'api', label: 'API Gateway', description: 'Entry point for all client requests, handles auth and routing.', position: { x: 250, y: 200 } },
      { id: 'routing', label: 'Routing Engine', description: 'Graph-based shortest path computation using road network data.', position: { x: 450, y: 100 } },
      { id: 'ml-model', label: 'ML Model', description: 'Gradient-boosted decision trees that predict actual travel time from features.', position: { x: 450, y: 300 } },
      { id: 'traffic', label: 'Traffic Service', description: 'Real-time traffic data from GPS pings of active Uber drivers.', position: { x: 650, y: 100 } },
      { id: 'historical', label: 'Historical Data', description: 'Billions of past trip records with actual travel times for model training.', position: { x: 650, y: 300 } },
      { id: 'map-data', label: 'Map Data', description: 'Road network graph with speed limits, turn costs, and restrictions.', position: { x: 650, y: 200 } },
      { id: 'eta-service', label: 'ETA Service', description: 'Combines routing and ML predictions to produce final ETA estimate.', position: { x: 850, y: 200 } },
      { id: 'response', label: 'ETA Response', description: 'Final predicted arrival time displayed to the rider.', position: { x: 1050, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'rider', target: 'api', label: 'Request', animated: true },
      { id: 'e2', source: 'api', target: 'routing', label: 'Route' },
      { id: 'e3', source: 'api', target: 'ml-model', label: 'Predict' },
      { id: 'e4', source: 'traffic', target: 'routing', label: 'Live Traffic' },
      { id: 'e5', source: 'map-data', target: 'routing', label: 'Road Graph' },
      { id: 'e6', source: 'historical', target: 'ml-model', label: 'Training Data' },
      { id: 'e7', source: 'routing', target: 'eta-service', label: 'Route ETA' },
      { id: 'e8', source: 'ml-model', target: 'eta-service', label: 'ML ETA' },
      { id: 'e9', source: 'eta-service', target: 'response', label: 'Final ETA', animated: true },
    ],
    steps: [
      { number: 1, title: 'Ride Request', description: 'Rider opens the app and enters a destination. The app sends pickup/dropoff coordinates to the backend.', highlightNodes: ['rider', 'api'] },
      { number: 2, title: 'Graph Routing', description: 'The routing engine computes the shortest path using a road network graph with Dijkstra/A* algorithms.', highlightNodes: ['routing', 'map-data'] },
      { number: 3, title: 'Traffic Integration', description: 'Real-time traffic data from GPS pings of all active drivers is overlaid on the route.', highlightNodes: ['traffic', 'routing'] },
      { number: 4, title: 'ML Prediction', description: 'A gradient-boosted tree model predicts actual travel time using features like time of day, weather, events, and road segments.', highlightNodes: ['ml-model', 'historical'] },
      { number: 5, title: 'ETA Fusion', description: 'The ETA service combines the graph-based route estimate and ML prediction using an ensemble approach.', highlightNodes: ['eta-service'] },
      { number: 6, title: 'Display to Rider', description: 'The final ETA is returned and shown in the rider app, continuously updating as conditions change.', highlightNodes: ['response'] },
    ],
    designDecisions: [
      { question: 'Why combine routing + ML instead of using only ML?', answer: 'The routing engine provides a physically grounded path while ML captures patterns the graph can\'t (like event traffic, weather effects). Together they\'re more accurate than either alone.' },
      { question: 'Why use gradient-boosted trees instead of deep learning?', answer: 'GBDTs are faster for inference (critical at Uber\'s scale), more interpretable, and perform well on tabular/structured features like road segments and time features.' },
    ],
    tradeoffs: { scalability: 8, availability: 9, consistency: 6, latency: 9, durability: 5, simplicity: 4 },
    furtherReading: [
      { title: 'Uber Engineering: ETA Prediction', url: 'https://www.uber.com/blog/engineering/', type: 'blog' },
    ],
  },

  'amazon-s3': {
    slug: 'amazon-s3',
    summary: 'Amazon S3 provides virtually unlimited object storage by distributing data across multiple servers and data centers, using consistent hashing and replication for 99.999999999% durability.',
    analogy: 'S3 is like a warehouse with infinite numbered lockers. You give each item a name, put it in the warehouse, and it\'s kept in multiple copies across different buildings so it\'s never lost.',
    nodes: [
      { id: 'client', label: 'Client', description: 'Application or user uploading/downloading objects via the S3 API.', position: { x: 50, y: 200 } },
      { id: 'api-endpoint', label: 'S3 API', description: 'RESTful API endpoint handling PUT, GET, DELETE operations on objects.', position: { x: 250, y: 200 } },
      { id: 'metadata', label: 'Metadata Store', description: 'Index service mapping bucket/key to physical storage locations.', position: { x: 450, y: 100 } },
      { id: 'placement', label: 'Placement Engine', description: 'Determines which storage nodes to write data to based on replication policies.', position: { x: 450, y: 300 } },
      { id: 'storage-1', label: 'Storage Node 1', description: 'Physical storage server holding object data chunks in one availability zone.', position: { x: 700, y: 100 } },
      { id: 'storage-2', label: 'Storage Node 2', description: 'Replica in a second availability zone for redundancy.', position: { x: 700, y: 200 } },
      { id: 'storage-3', label: 'Storage Node 3', description: 'Replica in a third availability zone. Data survives even if two AZs fail.', position: { x: 700, y: 300 } },
      { id: 'versioning', label: 'Versioning', description: 'Maintains version history of objects, enabling rollback and recovery.', position: { x: 900, y: 100 } },
      { id: 'lifecycle', label: 'Lifecycle Manager', description: 'Automatically transitions objects between storage classes (Standard → Glacier).', position: { x: 900, y: 300 } },
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'api-endpoint', label: 'PUT/GET', animated: true },
      { id: 'e2', source: 'api-endpoint', target: 'metadata', label: 'Lookup' },
      { id: 'e3', source: 'api-endpoint', target: 'placement', label: 'Place' },
      { id: 'e4', source: 'placement', target: 'storage-1', label: 'Write' },
      { id: 'e5', source: 'placement', target: 'storage-2', label: 'Replicate' },
      { id: 'e6', source: 'placement', target: 'storage-3', label: 'Replicate' },
      { id: 'e7', source: 'storage-1', target: 'versioning', label: 'Version' },
      { id: 'e8', source: 'storage-1', target: 'lifecycle', label: 'Transition' },
    ],
    steps: [
      { number: 1, title: 'Client Request', description: 'A client sends a PUT request to S3 with a bucket name, object key, and data payload.', highlightNodes: ['client', 'api-endpoint'] },
      { number: 2, title: 'Metadata Lookup', description: 'The metadata store resolves the bucket and key to determine if this is a new object or update.', highlightNodes: ['metadata'] },
      { number: 3, title: 'Placement Decision', description: 'The placement engine selects storage nodes across 3+ availability zones based on replication policies.', highlightNodes: ['placement'] },
      { number: 4, title: 'Data Replication', description: 'Data is written to multiple storage nodes simultaneously. The write is acknowledged only after reaching the required number of replicas.', highlightNodes: ['storage-1', 'storage-2', 'storage-3'] },
      { number: 5, title: 'Versioning', description: 'If versioning is enabled, a new version ID is created, preserving the previous version.', highlightNodes: ['versioning'] },
      { number: 6, title: 'Lifecycle Management', description: 'Over time, lifecycle rules can automatically move infrequently accessed data to cheaper storage tiers.', highlightNodes: ['lifecycle'] },
    ],
    designDecisions: [
      { question: 'Why replicate across 3 availability zones?', answer: 'With 3 AZ replication, data survives even if an entire data center goes offline. This achieves 11 nines (99.999999999%) durability.' },
      { question: 'Why eventual consistency (for some operations)?', answer: 'Strong consistency for all operations would require coordination that impacts latency. S3 now offers strong read-after-write consistency as of Dec 2020.' },
    ],
    tradeoffs: { scalability: 10, availability: 10, consistency: 8, latency: 7, durability: 10, simplicity: 8 },
    furtherReading: [
      { title: 'Amazon S3 Architecture - AWS', url: 'https://aws.amazon.com/s3/', type: 'docs' },
      { title: 'S3 Consistency Model', url: 'https://aws.amazon.com/blogs/aws/amazon-s3-update-strong-read-after-write-consistency/', type: 'blog' },
    ],
  },

  'youtube': {
    slug: 'youtube',
    summary: 'YouTube ingests, transcodes, stores, and delivers billions of hours of video through a global CDN, with ML-powered recommendations driving 70% of watch time.',
    analogy: 'YouTube is like a global TV station where anyone can upload a show. The station automatically converts it to every format, distributes copies to local relay stations worldwide, and has a DJ that knows exactly what each viewer wants to watch next.',
    nodes: [
      { id: 'creator', label: 'Creator', description: 'Content creator uploading a video through the YouTube Studio interface.', position: { x: 50, y: 200 } },
      { id: 'upload-service', label: 'Upload Service', description: 'Handles chunked video uploads with resumability support.', position: { x: 250, y: 200 } },
      { id: 'transcoder', label: 'Transcoder', description: 'Converts video to multiple resolutions (144p to 4K) and formats (VP9, H.264, AV1).', position: { x: 450, y: 100 } },
      { id: 'storage', label: 'Blob Storage', description: 'Google\'s distributed storage (Colossus) storing petabytes of video data.', position: { x: 450, y: 300 } },
      { id: 'cdn', label: 'CDN Edge', description: 'Content delivery network with edge servers close to users for low-latency streaming.', position: { x: 700, y: 100 } },
      { id: 'recommendation', label: 'Recommendation Engine', description: 'Deep learning model that predicts which videos a user is most likely to watch and enjoy.', position: { x: 700, y: 300 } },
      { id: 'viewer', label: 'Viewer', description: 'End user watching videos in the browser or mobile app.', position: { x: 950, y: 200 } },
      { id: 'metadata-db', label: 'Metadata DB', description: 'Stores video titles, descriptions, view counts, comments in Bigtable/Spanner.', position: { x: 450, y: 200 } },
      { id: 'search', label: 'Search Index', description: 'Full-text search index for finding videos by title, description, and captions.', position: { x: 700, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'creator', target: 'upload-service', label: 'Upload', animated: true },
      { id: 'e2', source: 'upload-service', target: 'transcoder', label: 'Transcode' },
      { id: 'e3', source: 'upload-service', target: 'storage', label: 'Store Raw' },
      { id: 'e4', source: 'transcoder', target: 'storage', label: 'Store Encoded' },
      { id: 'e5', source: 'storage', target: 'cdn', label: 'Distribute' },
      { id: 'e6', source: 'upload-service', target: 'metadata-db', label: 'Metadata' },
      { id: 'e7', source: 'metadata-db', target: 'search', label: 'Index' },
      { id: 'e8', source: 'recommendation', target: 'viewer', label: 'Suggest', animated: true },
      { id: 'e9', source: 'cdn', target: 'viewer', label: 'Stream', animated: true },
    ],
    steps: [
      { number: 1, title: 'Video Upload', description: 'Creator uploads a video in chunks. The upload service supports resume if the connection drops.', highlightNodes: ['creator', 'upload-service'] },
      { number: 2, title: 'Transcoding', description: 'The video is transcoded into 10+ resolution/format combinations. A 1-hour video may take several minutes to transcode.', highlightNodes: ['transcoder'] },
      { number: 3, title: 'Storage', description: 'Both raw and transcoded versions are stored in Google\'s distributed file system (Colossus) with replication.', highlightNodes: ['storage'] },
      { number: 4, title: 'CDN Distribution', description: 'Popular videos are cached at edge servers worldwide. YouTube has edge nodes in 90+ countries.', highlightNodes: ['cdn'] },
      { number: 5, title: 'Metadata & Search', description: 'Video metadata is indexed for search. Captions are auto-generated and also indexed.', highlightNodes: ['metadata-db', 'search'] },
      { number: 6, title: 'Recommendation', description: 'Deep neural networks analyze watch history, engagement signals, and video features to recommend the next video.', highlightNodes: ['recommendation'] },
      { number: 7, title: 'Viewing', description: 'Viewer\'s player uses adaptive bitrate streaming (DASH) to adjust quality based on bandwidth.', highlightNodes: ['viewer'] },
    ],
    designDecisions: [
      { question: 'Why transcode to multiple formats?', answer: 'Different devices support different codecs. Multiple resolutions enable adaptive bitrate streaming where quality adjusts to the viewer\'s bandwidth in real-time.' },
      { question: 'Why use a CDN instead of serving from central servers?', answer: 'CDN edge servers reduce latency by serving content from physically close locations. Without CDN, users far from data centers would experience buffering.' },
    ],
    tradeoffs: { scalability: 10, availability: 10, consistency: 6, latency: 8, durability: 10, simplicity: 2 },
    furtherReading: [
      { title: 'YouTube Architecture - High Scalability', url: 'http://highscalability.com/youtube-architecture', type: 'blog' },
      { title: 'Deep Neural Networks for YouTube Recommendations', url: 'https://research.google/pubs/pub45530/', type: 'paper' },
    ],
  },

  'kafka': {
    slug: 'kafka',
    summary: 'Apache Kafka is a distributed event streaming platform that organizes data into topics with partitions, using an append-only commit log for high-throughput, fault-tolerant message delivery.',
    analogy: 'Kafka is like a post office with persistent mailboxes. Messages are sorted into topics (like departments), stored in partitions (numbered slots), and multiple people can read the same message without it being deleted.',
    nodes: [
      { id: 'producer', label: 'Producer', description: 'Application that publishes messages to Kafka topics.', position: { x: 50, y: 200 } },
      { id: 'broker-1', label: 'Broker 1', description: 'Kafka server that stores and serves partition data. Holds leader partitions.', position: { x: 350, y: 100 } },
      { id: 'broker-2', label: 'Broker 2', description: 'Second broker holding replica partitions and some leader partitions.', position: { x: 350, y: 200 } },
      { id: 'broker-3', label: 'Broker 3', description: 'Third broker for fault tolerance. If one broker fails, replicas on others take over.', position: { x: 350, y: 300 } },
      { id: 'zookeeper', label: 'ZooKeeper / KRaft', description: 'Manages cluster metadata, broker coordination, and leader election (KRaft replaces ZooKeeper in newer versions).', position: { x: 350, y: 420 } },
      { id: 'topic', label: 'Topic', description: 'A named stream of messages. Each topic is divided into one or more partitions.', position: { x: 600, y: 200 } },
      { id: 'partition', label: 'Partitions', description: 'Ordered, immutable sequence of messages. Each partition is an append-only commit log.', position: { x: 800, y: 200 } },
      { id: 'consumer-group', label: 'Consumer Group', description: 'Group of consumers that work together to read from partitions. Each partition is read by exactly one consumer in the group.', position: { x: 1000, y: 200 } },
      { id: 'consumer', label: 'Consumer', description: 'Application reading messages from assigned partitions, tracking its offset.', position: { x: 1200, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'producer', target: 'broker-1', label: 'Publish', animated: true },
      { id: 'e2', source: 'producer', target: 'broker-2', label: 'Publish' },
      { id: 'e3', source: 'broker-1', target: 'topic', label: 'Store' },
      { id: 'e4', source: 'broker-2', target: 'topic', label: 'Store' },
      { id: 'e5', source: 'broker-3', target: 'topic', label: 'Replicate' },
      { id: 'e6', source: 'zookeeper', target: 'broker-1', label: 'Coordinate' },
      { id: 'e7', source: 'topic', target: 'partition', label: 'Split' },
      { id: 'e8', source: 'partition', target: 'consumer-group', label: 'Assign' },
      { id: 'e9', source: 'consumer-group', target: 'consumer', label: 'Read', animated: true },
    ],
    steps: [
      { number: 1, title: 'Producer Sends Message', description: 'A producer sends a message to a Kafka topic. The message can include a key for partition routing.', highlightNodes: ['producer'] },
      { number: 2, title: 'Partition Assignment', description: 'The message is routed to a specific partition based on the key hash (or round-robin if no key).', highlightNodes: ['broker-1', 'broker-2'] },
      { number: 3, title: 'Append to Log', description: 'The message is appended to the partition\'s commit log and assigned a sequential offset number.', highlightNodes: ['topic', 'partition'] },
      { number: 4, title: 'Replication', description: 'The leader partition replicates the message to follower replicas on other brokers for fault tolerance.', highlightNodes: ['broker-3'] },
      { number: 5, title: 'ZooKeeper Coordination', description: 'ZooKeeper (or KRaft) manages which broker is the leader for each partition and detects failures.', highlightNodes: ['zookeeper'] },
      { number: 6, title: 'Consumer Reads', description: 'Consumers in a consumer group are assigned partitions. Each consumer reads messages sequentially from its assigned partitions.', highlightNodes: ['consumer-group', 'consumer'] },
    ],
    designDecisions: [
      { question: 'Why an append-only log instead of a mutable database?', answer: 'Append-only logs are extremely fast for writes (sequential I/O) and enable easy replication. Consumers can re-read messages by resetting their offset.' },
      { question: 'Why partition data?', answer: 'Partitions enable horizontal scaling. Different partitions can live on different brokers, and multiple consumers can read in parallel.' },
    ],
    tradeoffs: { scalability: 10, availability: 9, consistency: 7, latency: 8, durability: 9, simplicity: 4 },
    furtherReading: [
      { title: 'Kafka: The Definitive Guide', url: 'https://kafka.apache.org/documentation/', type: 'docs' },
      { title: 'The Log: What every software engineer should know', url: 'https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying', type: 'blog' },
    ],
  },

  'whatsapp': {
    slug: 'whatsapp',
    summary: 'WhatsApp uses the XMPP-based protocol with end-to-end encryption (Signal Protocol), built on Erlang/FreeBSD for massive concurrency, handling 100B+ messages daily with a notably small engineering team.',
    analogy: 'WhatsApp is like a sealed postal system where every letter is locked in a box that only the sender and recipient can open — even the mail carrier can\'t read it.',
    nodes: [
      { id: 'sender', label: 'Sender', description: 'User sending a message from their phone. Encrypts message with recipient\'s public key.', position: { x: 50, y: 200 } },
      { id: 'connection', label: 'Connection Server', description: 'Persistent TCP/WebSocket connection between phone and WhatsApp backend (Erlang-based).', position: { x: 280, y: 200 } },
      { id: 'routing', label: 'Routing Layer', description: 'Determines which server the recipient is connected to and routes the message.', position: { x: 500, y: 200 } },
      { id: 'offline-store', label: 'Offline Queue', description: 'Stores encrypted messages for offline users. Messages are deleted after delivery.', position: { x: 500, y: 350 } },
      { id: 'encryption', label: 'E2E Encryption', description: 'Signal Protocol: Double Ratchet algorithm ensures forward secrecy. Server never sees plaintext.', position: { x: 280, y: 50 } },
      { id: 'media', label: 'Media Storage', description: 'Encrypted media files are stored on object storage. Decryption keys sent via message.', position: { x: 500, y: 50 } },
      { id: 'recipient-conn', label: 'Recipient Server', description: 'Connection server where the recipient\'s phone maintains a persistent connection.', position: { x: 720, y: 200 } },
      { id: 'recipient', label: 'Recipient', description: 'User receiving and decrypting the message with their private key.', position: { x: 950, y: 200 } },
      { id: 'mnesia', label: 'Mnesia DB', description: 'Erlang\'s built-in distributed database for user sessions, presence, and routing tables.', position: { x: 720, y: 350 } },
    ],
    edges: [
      { id: 'e1', source: 'sender', target: 'connection', label: 'Encrypted Msg', animated: true },
      { id: 'e2', source: 'sender', target: 'encryption', label: 'Encrypt' },
      { id: 'e3', source: 'connection', target: 'routing', label: 'Route' },
      { id: 'e4', source: 'routing', target: 'offline-store', label: 'Queue (offline)' },
      { id: 'e5', source: 'routing', target: 'recipient-conn', label: 'Forward', animated: true },
      { id: 'e6', source: 'encryption', target: 'media', label: 'Media Key' },
      { id: 'e7', source: 'recipient-conn', target: 'recipient', label: 'Deliver', animated: true },
      { id: 'e8', source: 'recipient-conn', target: 'mnesia', label: 'Session' },
      { id: 'e9', source: 'routing', target: 'mnesia', label: 'Lookup' },
    ],
    steps: [
      { number: 1, title: 'Message Encrypted', description: 'The sender\'s phone encrypts the message using the Signal Protocol (Double Ratchet) with the recipient\'s public key.', highlightNodes: ['sender', 'encryption'] },
      { number: 2, title: 'Send to Server', description: 'The encrypted message is sent over a persistent TCP connection to a WhatsApp connection server.', highlightNodes: ['sender', 'connection'] },
      { number: 3, title: 'Route Message', description: 'The routing layer looks up which server the recipient is connected to using Mnesia database.', highlightNodes: ['routing', 'mnesia'] },
      { number: 4, title: 'Offline Handling', description: 'If the recipient is offline, the encrypted message is queued. It\'s delivered when they reconnect and then deleted from servers.', highlightNodes: ['offline-store'] },
      { number: 5, title: 'Deliver to Recipient', description: 'The message is forwarded to the recipient\'s connection server and pushed to their phone.', highlightNodes: ['recipient-conn', 'recipient'] },
      { number: 6, title: 'Decrypt & Display', description: 'The recipient\'s phone decrypts the message using their private key. The server never had access to the plaintext.', highlightNodes: ['recipient'] },
    ],
    designDecisions: [
      { question: 'Why Erlang?', answer: 'Erlang was designed for telecom systems. It handles millions of lightweight concurrent processes and hot-swappable code — perfect for a messaging system at WhatsApp\'s scale with a small team.' },
      { question: 'Why end-to-end encryption?', answer: 'E2E encryption ensures that even WhatsApp servers cannot read messages. This is critical for user privacy and trust.' },
    ],
    tradeoffs: { scalability: 9, availability: 9, consistency: 7, latency: 9, durability: 7, simplicity: 5 },
    furtherReading: [
      { title: 'WhatsApp Architecture - HighScalability', url: 'http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html', type: 'blog' },
      { title: 'Signal Protocol Documentation', url: 'https://signal.org/docs/', type: 'docs' },
    ],
  },

  'spotify': {
    slug: 'spotify',
    summary: 'Spotify streams 100M+ tracks by chunking audio files, caching popular content at edge nodes, and using collaborative filtering and deep learning for personalized recommendations.',
    analogy: 'Spotify is like a massive jukebox that learns your taste. It keeps the most popular songs ready at local stations near you and has a DJ that knows what you\'ll want to hear next based on millions of other listeners.',
    nodes: [
      { id: 'user', label: 'User', description: 'Listener using the Spotify app to play music.', position: { x: 50, y: 200 } },
      { id: 'api', label: 'API Gateway', description: 'Entry point for all client requests. Routes to appropriate microservices.', position: { x: 250, y: 200 } },
      { id: 'playback', label: 'Playback Service', description: 'Manages the play queue, handles DRM, and coordinates audio streaming.', position: { x: 450, y: 100 } },
      { id: 'audio-cdn', label: 'Audio CDN', description: 'Ogg Vorbis audio chunks cached at edge nodes worldwide for low-latency playback.', position: { x: 450, y: 300 } },
      { id: 'audio-storage', label: 'Audio Storage', description: 'Central storage holding all 100M+ tracks in multiple quality levels.', position: { x: 650, y: 300 } },
      { id: 'recommendation', label: 'Recommendation', description: 'Collaborative filtering + NLP analysis of playlists and audio features for personalization.', position: { x: 650, y: 100 } },
      { id: 'user-data', label: 'User Data', description: 'Listening history, saved libraries, playlists stored in distributed databases.', position: { x: 850, y: 100 } },
      { id: 'search', label: 'Search Service', description: 'Full-text search across tracks, artists, albums, podcasts, and playlists.', position: { x: 850, y: 300 } },
      { id: 'social', label: 'Social Graph', description: 'Friend activity, collaborative playlists, and social features.', position: { x: 650, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'api', label: 'Request', animated: true },
      { id: 'e2', source: 'api', target: 'playback', label: 'Play' },
      { id: 'e3', source: 'playback', target: 'audio-cdn', label: 'Fetch Chunks', animated: true },
      { id: 'e4', source: 'audio-cdn', target: 'audio-storage', label: 'Cache Miss' },
      { id: 'e5', source: 'api', target: 'recommendation', label: 'Discover' },
      { id: 'e6', source: 'recommendation', target: 'user-data', label: 'Profile' },
      { id: 'e7', source: 'api', target: 'search', label: 'Search' },
      { id: 'e8', source: 'api', target: 'social', label: 'Social' },
      { id: 'e9', source: 'audio-cdn', target: 'user', label: 'Stream', animated: true },
    ],
    steps: [
      { number: 1, title: 'User Presses Play', description: 'The user selects a track. The app requests playback from the API.', highlightNodes: ['user', 'api'] },
      { number: 2, title: 'Playback Service', description: 'The playback service checks licenses (DRM), determines audio quality based on subscription, and creates a play token.', highlightNodes: ['playback'] },
      { number: 3, title: 'Audio Chunking', description: 'Audio files are pre-split into small chunks. The CDN serves chunks from the nearest edge server.', highlightNodes: ['audio-cdn'] },
      { number: 4, title: 'Cache or Fetch', description: 'Popular songs are cached at the edge. Less popular tracks are fetched from central storage and cached for future requests.', highlightNodes: ['audio-cdn', 'audio-storage'] },
      { number: 5, title: 'Recommendation', description: 'Collaborative filtering analyzes listening patterns across millions of users. "Users who liked X also liked Y."', highlightNodes: ['recommendation', 'user-data'] },
      { number: 6, title: 'Discovery Features', description: 'Discover Weekly, Release Radar, and Daily Mixes are generated using ML models processing audio features and listening history.', highlightNodes: ['recommendation'] },
    ],
    designDecisions: [
      { question: 'Why Ogg Vorbis over MP3?', answer: 'Ogg Vorbis provides better audio quality at lower bitrates and is royalty-free, saving significant licensing costs at Spotify\'s scale.' },
      { question: 'Why collaborative filtering?', answer: 'It discovers hidden connections between users with similar tastes without needing to analyze audio content — just behavior patterns.' },
    ],
    tradeoffs: { scalability: 9, availability: 9, consistency: 6, latency: 9, durability: 8, simplicity: 4 },
    furtherReading: [
      { title: 'Spotify Engineering Blog', url: 'https://engineering.atspotify.com/', type: 'blog' },
      { title: 'How Discover Weekly Works', url: 'https://engineering.atspotify.com/', type: 'blog' },
    ],
  },

  'slack': {
    slug: 'slack',
    summary: 'Slack delivers real-time team messaging using WebSockets for instant delivery, with messages stored in MySQL/Vitess, search powered by Elasticsearch, and a gateway layer managing millions of persistent connections.',
    analogy: 'Slack is like a smart office building where every room (channel) has instant intercom, a filing cabinet (search), and a bulletin board — and notifications reach you wherever you are in the building.',
    nodes: [
      { id: 'user', label: 'User', description: 'Team member sending messages through the Slack desktop, web, or mobile client.', position: { x: 50, y: 200 } },
      { id: 'gateway', label: 'Gateway', description: 'WebSocket gateway managing persistent connections for real-time message delivery.', position: { x: 280, y: 200 } },
      { id: 'msg-server', label: 'Message Server', description: 'Processes messages, enforces permissions, and fans out to channel members.', position: { x: 500, y: 100 } },
      { id: 'channel-service', label: 'Channel Service', description: 'Manages channel membership, permissions, and channel metadata.', position: { x: 500, y: 300 } },
      { id: 'mysql', label: 'MySQL / Vitess', description: 'Primary message store. Vitess provides horizontal sharding for MySQL.', position: { x: 720, y: 100 } },
      { id: 'search', label: 'Elasticsearch', description: 'Full-text search index for messages, files, and channels.', position: { x: 720, y: 300 } },
      { id: 'cache', label: 'Memcached', description: 'Caches frequently accessed data like channel info, user profiles, and recent messages.', position: { x: 720, y: 200 } },
      { id: 'file-storage', label: 'File Storage', description: 'Amazon S3 for file uploads (images, documents, code snippets).', position: { x: 950, y: 100 } },
      { id: 'notifications', label: 'Notifications', description: 'Push notification service for mobile and desktop alerts.', position: { x: 950, y: 300 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'gateway', label: 'WebSocket', animated: true },
      { id: 'e2', source: 'gateway', target: 'msg-server', label: 'Message' },
      { id: 'e3', source: 'msg-server', target: 'mysql', label: 'Store' },
      { id: 'e4', source: 'msg-server', target: 'search', label: 'Index' },
      { id: 'e5', source: 'msg-server', target: 'cache', label: 'Cache' },
      { id: 'e6', source: 'msg-server', target: 'channel-service', label: 'Fan Out' },
      { id: 'e7', source: 'channel-service', target: 'gateway', label: 'Deliver', animated: true },
      { id: 'e8', source: 'msg-server', target: 'file-storage', label: 'Files' },
      { id: 'e9', source: 'channel-service', target: 'notifications', label: 'Notify' },
    ],
    steps: [
      { number: 1, title: 'User Sends Message', description: 'A user types a message in a channel. It\'s sent over a persistent WebSocket connection to the gateway.', highlightNodes: ['user', 'gateway'] },
      { number: 2, title: 'Message Processing', description: 'The message server validates permissions, processes mentions, and prepares the message for storage.', highlightNodes: ['msg-server'] },
      { number: 3, title: 'Storage & Indexing', description: 'The message is stored in MySQL (sharded via Vitess) and indexed in Elasticsearch for search.', highlightNodes: ['mysql', 'search'] },
      { number: 4, title: 'Fan-Out Delivery', description: 'The channel service determines all members who should receive the message and fans it out through gateway connections.', highlightNodes: ['channel-service', 'gateway'] },
      { number: 5, title: 'Push Notifications', description: 'Users with the app closed receive push notifications on mobile/desktop.', highlightNodes: ['notifications'] },
      { number: 6, title: 'File Handling', description: 'Uploaded files are stored in S3 with inline previews generated for images and documents.', highlightNodes: ['file-storage'] },
    ],
    designDecisions: [
      { question: 'Why WebSockets instead of polling?', answer: 'WebSockets provide instant message delivery without the overhead of repeated HTTP requests. At Slack\'s scale, polling would create billions of unnecessary requests.' },
      { question: 'Why Vitess for MySQL?', answer: 'Vitess provides horizontal sharding for MySQL, letting Slack scale beyond single-server limits while keeping familiar SQL interfaces.' },
    ],
    tradeoffs: { scalability: 8, availability: 9, consistency: 8, latency: 9, durability: 8, simplicity: 5 },
    furtherReading: [
      { title: 'Slack Engineering Blog', url: 'https://slack.engineering/', type: 'blog' },
      { title: 'Scaling Slack - Infrastructure', url: 'https://slack.engineering/', type: 'blog' },
    ],
  },

  'reddit': {
    slug: 'reddit',
    summary: 'Reddit serves billions of page views through a Python/Go backend with PostgreSQL and Cassandra, using a sophisticated voting and ranking algorithm (Hot/Best/Top) with heavy caching via Memcached and CDN.',
    analogy: 'Reddit is like a massive bulletin board where anyone can post, and the community votes posts up or down. The most popular posts float to the top, but freshness matters too — like a newspaper that updates every second.',
    nodes: [
      { id: 'user', label: 'User', description: 'Redditor browsing, voting, commenting, or posting content.', position: { x: 50, y: 200 } },
      { id: 'cdn', label: 'CDN / Fastly', description: 'Edge caching for static content and popular pages.', position: { x: 250, y: 100 } },
      { id: 'app-server', label: 'App Server', description: 'Python (r2) and Go microservices handling request logic.', position: { x: 250, y: 300 } },
      { id: 'vote-service', label: 'Vote Service', description: 'Handles upvote/downvote processing and score calculation.', position: { x: 480, y: 100 } },
      { id: 'ranking', label: 'Ranking Engine', description: 'Applies Hot/Best/Top algorithms combining score, age, and controversiality.', position: { x: 480, y: 300 } },
      { id: 'postgres', label: 'PostgreSQL', description: 'Primary database for posts, comments, user accounts.', position: { x: 700, y: 100 } },
      { id: 'cassandra', label: 'Cassandra', description: 'Stores vote data, view counts, and time-series data.', position: { x: 700, y: 300 } },
      { id: 'memcached', label: 'Memcached', description: 'Massive caching layer storing pre-computed page content and hot post lists.', position: { x: 700, y: 200 } },
      { id: 'rabbitmq', label: 'RabbitMQ', description: 'Message queue for asynchronous job processing (thumbnail generation, notifications).', position: { x: 480, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'cdn', label: 'Request', animated: true },
      { id: 'e2', source: 'cdn', target: 'app-server', label: 'Cache Miss' },
      { id: 'e3', source: 'user', target: 'app-server', label: 'Post/Vote' },
      { id: 'e4', source: 'app-server', target: 'vote-service', label: 'Vote' },
      { id: 'e5', source: 'vote-service', target: 'cassandra', label: 'Store Vote' },
      { id: 'e6', source: 'app-server', target: 'ranking', label: 'Rank' },
      { id: 'e7', source: 'app-server', target: 'postgres', label: 'Query' },
      { id: 'e8', source: 'app-server', target: 'memcached', label: 'Cache' },
      { id: 'e9', source: 'app-server', target: 'rabbitmq', label: 'Jobs' },
    ],
    steps: [
      { number: 1, title: 'User Request', description: 'A user visits a subreddit. The CDN serves cached content if available; otherwise, the request hits app servers.', highlightNodes: ['user', 'cdn', 'app-server'] },
      { number: 2, title: 'Content Retrieval', description: 'The app server checks Memcached first. On cache miss, it queries PostgreSQL for posts and comments.', highlightNodes: ['memcached', 'postgres'] },
      { number: 3, title: 'Voting', description: 'When a user votes, the vote service records it in Cassandra and updates the post score.', highlightNodes: ['vote-service', 'cassandra'] },
      { number: 4, title: 'Ranking', description: 'Posts are ranked using Reddit\'s Hot algorithm: score = log10(ups - downs) + (age / 45000). Newer popular posts rank higher.', highlightNodes: ['ranking'] },
      { number: 5, title: 'Async Processing', description: 'Background jobs (thumbnail generation, notification delivery) are queued via RabbitMQ.', highlightNodes: ['rabbitmq'] },
      { number: 6, title: 'Cache Update', description: 'Updated rankings are cached in Memcached and pushed to CDN for fast subsequent loads.', highlightNodes: ['memcached', 'cdn'] },
    ],
    designDecisions: [
      { question: 'Why use Cassandra for votes instead of PostgreSQL?', answer: 'Votes are extremely high-write workloads. Cassandra handles high write throughput better than PostgreSQL and scales horizontally.' },
      { question: 'Why logarithmic scoring?', answer: 'Log scoring means the first 10 upvotes matter as much as the next 100. This prevents already-popular posts from dominating forever.' },
    ],
    tradeoffs: { scalability: 8, availability: 8, consistency: 6, latency: 8, durability: 8, simplicity: 5 },
    furtherReading: [
      { title: 'Reddit Architecture Overview', url: 'https://www.reddit.com/r/RedditEng/', type: 'blog' },
      { title: 'Reddit\'s Architecture - HighScalability', url: 'http://highscalability.com/', type: 'blog' },
    ],
  },

  'bluesky': {
    slug: 'bluesky',
    summary: 'Bluesky is a decentralized social network built on the AT Protocol, where users own their data and identity through DIDs (Decentralized Identifiers), with federation allowing independent servers to interoperate.',
    analogy: 'Bluesky is like email for social media — just as you can email anyone regardless of whether they use Gmail or Outlook, Bluesky lets you follow and interact with anyone on any server running the AT Protocol.',
    nodes: [
      { id: 'user', label: 'User', description: 'Person using a Bluesky client app to post and interact.', position: { x: 50, y: 200 } },
      { id: 'pds', label: 'PDS (Personal Data Server)', description: 'Hosts user data and identity. Users can self-host or use a provider.', position: { x: 280, y: 200 } },
      { id: 'did', label: 'DID Registry', description: 'Decentralized Identifier system that lets users maintain identity across servers.', position: { x: 280, y: 50 } },
      { id: 'relay', label: 'Relay (Firehose)', description: 'Aggregates data from all PDS instances into a unified stream for indexing.', position: { x: 530, y: 200 } },
      { id: 'appview', label: 'App View', description: 'Indexes the firehose to build views like timelines, search, and notifications.', position: { x: 750, y: 200 } },
      { id: 'feed-generator', label: 'Feed Generator', description: 'Custom algorithmic feeds that anyone can create and users can subscribe to.', position: { x: 750, y: 50 } },
      { id: 'labeler', label: 'Labeler', description: 'Independent moderation services that label content. Users choose which labelers to trust.', position: { x: 750, y: 350 } },
      { id: 'lexicon', label: 'Lexicon Schema', description: 'Schema language defining the data models and API methods of the AT Protocol.', position: { x: 530, y: 350 } },
      { id: 'client', label: 'Client App', description: 'Any app (official or third-party) that implements the AT Protocol API.', position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'pds', label: 'Post', animated: true },
      { id: 'e2', source: 'pds', target: 'did', label: 'Identity' },
      { id: 'e3', source: 'pds', target: 'relay', label: 'Sync', animated: true },
      { id: 'e4', source: 'relay', target: 'appview', label: 'Index' },
      { id: 'e5', source: 'appview', target: 'feed-generator', label: 'Feed Data' },
      { id: 'e6', source: 'appview', target: 'labeler', label: 'Moderate' },
      { id: 'e7', source: 'appview', target: 'client', label: 'API', animated: true },
      { id: 'e8', source: 'lexicon', target: 'pds', label: 'Schema' },
      { id: 'e9', source: 'lexicon', target: 'relay', label: 'Schema' },
    ],
    steps: [
      { number: 1, title: 'User Creates Post', description: 'A user creates a post on their PDS (Personal Data Server). Their identity is tied to a DID they own.', highlightNodes: ['user', 'pds', 'did'] },
      { number: 2, title: 'PDS Syncs to Relay', description: 'The PDS pushes the new record to a Relay (firehose), which aggregates data from all PDS instances.', highlightNodes: ['pds', 'relay'] },
      { number: 3, title: 'Relay Broadcasts', description: 'The Relay provides a real-time stream of all network activity that indexers can subscribe to.', highlightNodes: ['relay'] },
      { number: 4, title: 'App View Indexes', description: 'App Views index the firehose to build queryable views: timelines, search results, notification feeds.', highlightNodes: ['appview'] },
      { number: 5, title: 'Feed Generation', description: 'Custom feed generators build algorithmic feeds. Anyone can create one — users choose which feeds to subscribe to.', highlightNodes: ['feed-generator'] },
      { number: 6, title: 'Content Moderation', description: 'Independent labeler services tag content. Users and app views choose which labeling services to trust.', highlightNodes: ['labeler'] },
    ],
    designDecisions: [
      { question: 'Why decentralized identity (DIDs)?', answer: 'DIDs let users take their identity (and followers) with them if they switch servers. No single provider controls your social identity.' },
      { question: 'Why separate PDS, Relay, and App View?', answer: 'Separating data hosting (PDS), aggregation (Relay), and presentation (App View) allows specialization. Each layer can be independently operated and scaled.' },
    ],
    tradeoffs: { scalability: 7, availability: 7, consistency: 5, latency: 7, durability: 8, simplicity: 3 },
    furtherReading: [
      { title: 'AT Protocol Documentation', url: 'https://atproto.com/', type: 'docs' },
      { title: 'Bluesky Engineering Blog', url: 'https://bsky.social/', type: 'blog' },
    ],
  },

  'twitter-timeline': {
    slug: 'twitter-timeline',
    summary: 'Twitter generates timelines using a fan-out-on-write approach for most users (pre-computing timelines in Redis) and fan-out-on-read for high-follower accounts, with ML ranking for relevance.',
    analogy: 'Twitter\'s timeline is like a personal newspaper that\'s pre-assembled for you. When someone you follow tweets, a copy is placed in your newspaper — but for celebrities with millions of followers, their tweets are fetched on-demand to avoid creating millions of copies.',
    nodes: [
      { id: 'tweeter', label: 'Tweeter', description: 'User creating and posting a tweet.', position: { x: 50, y: 200 } },
      { id: 'tweet-service', label: 'Tweet Service', description: 'Processes new tweets, stores them, and triggers fan-out.', position: { x: 280, y: 200 } },
      { id: 'fanout-service', label: 'Fan-out Service', description: 'Pushes tweet IDs to the timeline caches of all followers.', position: { x: 500, y: 100 } },
      { id: 'social-graph', label: 'Social Graph', description: 'Stores follower/following relationships. Used to determine fan-out targets.', position: { x: 500, y: 300 } },
      { id: 'timeline-cache', label: 'Timeline Cache (Redis)', description: 'Per-user sorted sets in Redis containing tweet IDs for their home timeline.', position: { x: 720, y: 100 } },
      { id: 'tweet-store', label: 'Tweet Store', description: 'Manhattan (distributed KV store) holding tweet content, media links, and metadata.', position: { x: 720, y: 300 } },
      { id: 'ranking', label: 'ML Ranking', description: 'Machine learning model that ranks timeline tweets by predicted engagement and relevance.', position: { x: 720, y: 200 } },
      { id: 'mixer', label: 'Timeline Mixer', description: 'Combines fan-out timeline, high-follower tweets (fan-in), and injected content (ads, recommendations).', position: { x: 950, y: 200 } },
      { id: 'reader', label: 'Reader', description: 'User viewing their home timeline of ranked tweets.', position: { x: 1150, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'tweeter', target: 'tweet-service', label: 'Tweet', animated: true },
      { id: 'e2', source: 'tweet-service', target: 'fanout-service', label: 'Fan Out' },
      { id: 'e3', source: 'tweet-service', target: 'tweet-store', label: 'Store' },
      { id: 'e4', source: 'fanout-service', target: 'social-graph', label: 'Followers' },
      { id: 'e5', source: 'fanout-service', target: 'timeline-cache', label: 'Push', animated: true },
      { id: 'e6', source: 'timeline-cache', target: 'mixer', label: 'Timeline' },
      { id: 'e7', source: 'tweet-store', target: 'mixer', label: 'Hydrate' },
      { id: 'e8', source: 'ranking', target: 'mixer', label: 'Rank' },
      { id: 'e9', source: 'mixer', target: 'reader', label: 'Feed', animated: true },
    ],
    steps: [
      { number: 1, title: 'User Tweets', description: 'A user posts a tweet. It\'s stored in the tweet store (Manhattan KV store) with a unique snowflake ID.', highlightNodes: ['tweeter', 'tweet-service', 'tweet-store'] },
      { number: 2, title: 'Fan-Out on Write', description: 'For most users, the fan-out service pushes the tweet ID to every follower\'s timeline cache in Redis.', highlightNodes: ['fanout-service', 'social-graph', 'timeline-cache'] },
      { number: 3, title: 'High-Follower Exception', description: 'For users with millions of followers (celebrities), fan-out is skipped. Their tweets are fetched on-read instead.', highlightNodes: ['social-graph'] },
      { number: 4, title: 'Timeline Reading', description: 'When a user opens Twitter, the timeline mixer fetches tweet IDs from their cache and hydrates them with full tweet data.', highlightNodes: ['timeline-cache', 'tweet-store'] },
      { number: 5, title: 'ML Ranking', description: 'A machine learning model ranks tweets by predicted engagement: likes, retweets, replies, and time spent viewing.', highlightNodes: ['ranking'] },
      { number: 6, title: 'Mixing', description: 'The timeline mixer combines ranked tweets with ads, recommendations, and trending content into the final feed.', highlightNodes: ['mixer', 'reader'] },
    ],
    designDecisions: [
      { question: 'Why fan-out on write instead of on read?', answer: 'Pre-computing timelines makes reads extremely fast (just fetch from Redis). Since reads vastly outnumber writes, this trades write amplification for read performance.' },
      { question: 'Why hybrid fan-out for celebrities?', answer: 'A user with 50M followers would require 50M Redis writes per tweet. It\'s more efficient to merge their tweets at read time.' },
    ],
    tradeoffs: { scalability: 9, availability: 9, consistency: 6, latency: 9, durability: 7, simplicity: 3 },
    furtherReading: [
      { title: 'How Twitter Timelines Work - Twitter Engineering', url: 'https://blog.twitter.com/engineering', type: 'blog' },
      { title: 'Designing Data-Intensive Applications (Martin Kleppmann)', url: 'https://dataintensive.net/', type: 'blog' },
    ],
  },

  'url-shortener': {
    slug: 'url-shortener',
    summary: 'A URL shortener generates short, unique aliases for long URLs using base62 encoding of unique IDs, resolves them via database lookup (with heavy caching), and redirects users with 301/302 HTTP responses.',
    analogy: 'A URL shortener is like a coat check: you give them your long URL (coat), get a short ticket (short link), and when someone presents the ticket, they get redirected to the original URL (get the coat back).',
    nodes: [
      { id: 'user', label: 'User', description: 'Person wanting to shorten or access a shortened URL.', position: { x: 50, y: 200 } },
      { id: 'api', label: 'API Server', description: 'Handles shorten and resolve requests via REST API.', position: { x: 280, y: 200 } },
      { id: 'id-generator', label: 'ID Generator', description: 'Generates unique IDs using snowflake-like algorithm or counter service.', position: { x: 500, y: 100 } },
      { id: 'encoder', label: 'Base62 Encoder', description: 'Converts numeric IDs to short alphanumeric strings (a-zA-Z0-9).', position: { x: 500, y: 300 } },
      { id: 'cache', label: 'Cache (Redis)', description: 'Caches popular short URL → long URL mappings for fast resolution.', position: { x: 720, y: 100 } },
      { id: 'database', label: 'Database', description: 'Persistent store mapping short codes to original URLs with metadata (clicks, creation date).', position: { x: 720, y: 300 } },
      { id: 'analytics', label: 'Analytics', description: 'Tracks click counts, referrers, geographic data, and device types.', position: { x: 720, y: 200 } },
      { id: 'redirect', label: '301/302 Redirect', description: 'HTTP redirect response that sends the browser to the original long URL.', position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'api', label: 'Shorten/Resolve', animated: true },
      { id: 'e2', source: 'api', target: 'id-generator', label: 'Generate ID' },
      { id: 'e3', source: 'id-generator', target: 'encoder', label: 'Encode' },
      { id: 'e4', source: 'encoder', target: 'database', label: 'Store' },
      { id: 'e5', source: 'api', target: 'cache', label: 'Lookup' },
      { id: 'e6', source: 'cache', target: 'database', label: 'Cache Miss' },
      { id: 'e7', source: 'api', target: 'analytics', label: 'Track Click' },
      { id: 'e8', source: 'api', target: 'redirect', label: 'Redirect', animated: true },
    ],
    steps: [
      { number: 1, title: 'Shorten Request', description: 'A user submits a long URL to the API. The system needs to generate a unique short code.', highlightNodes: ['user', 'api'] },
      { number: 2, title: 'ID Generation', description: 'A unique ID is generated (snowflake, counter, or hash). This ensures no collisions.', highlightNodes: ['id-generator'] },
      { number: 3, title: 'Base62 Encoding', description: 'The numeric ID is encoded to base62 (a-zA-Z0-9). ID 12345 → "dnh". A 7-char code supports 3.5 trillion URLs.', highlightNodes: ['encoder'] },
      { number: 4, title: 'Store Mapping', description: 'The short code → long URL mapping is stored in the database and cached.', highlightNodes: ['database', 'cache'] },
      { number: 5, title: 'URL Resolution', description: 'When someone clicks the short URL, the API looks up the mapping (cache first, then DB) and returns a redirect.', highlightNodes: ['api', 'cache'] },
      { number: 6, title: 'Analytics Tracking', description: 'Each click is logged with metadata (IP, referrer, timestamp) for analytics dashboards.', highlightNodes: ['analytics'] },
    ],
    designDecisions: [
      { question: 'Why base62 instead of base64?', answer: 'Base62 (a-zA-Z0-9) avoids special characters like + and / that cause issues in URLs. It\'s URL-safe by design.' },
      { question: 'Why 301 vs 302 redirect?', answer: '301 (permanent) is cached by browsers, reducing server load. 302 (temporary) lets you track every click. Most use 302 for analytics.' },
    ],
    tradeoffs: { scalability: 9, availability: 9, consistency: 8, latency: 10, durability: 8, simplicity: 9 },
    furtherReading: [
      { title: 'System Design: URL Shortener - ByteByteGo', url: 'https://blog.bytebytego.com', type: 'blog' },
    ],
  },

  'payment-system': {
    slug: 'payment-system',
    summary: 'Payment systems process financial transactions through a pipeline of authorization, fraud detection, clearing, and settlement, using idempotency keys, double-entry bookkeeping, and exactly-once semantics to ensure money never gets lost.',
    analogy: 'A payment system is like a very meticulous accountant who writes every transaction in two books simultaneously (debit and credit), asks the bank for approval, checks for fraud, and never processes the same receipt twice.',
    nodes: [
      { id: 'customer', label: 'Customer', description: 'Person initiating a payment via checkout, app, or terminal.', position: { x: 50, y: 200 } },
      { id: 'payment-api', label: 'Payment API', description: 'Entry point receiving payment requests with idempotency keys to prevent double charges.', position: { x: 280, y: 200 } },
      { id: 'fraud', label: 'Fraud Detection', description: 'ML model evaluating transaction risk based on patterns, location, device, and history.', position: { x: 500, y: 80 } },
      { id: 'payment-processor', label: 'Payment Processor', description: 'Orchestrates the payment flow: authorization, capture, and settlement.', position: { x: 500, y: 200 } },
      { id: 'card-network', label: 'Card Network', description: 'Visa/Mastercard network routing authorization requests to the issuing bank.', position: { x: 720, y: 100 } },
      { id: 'issuing-bank', label: 'Issuing Bank', description: 'Customer\'s bank that approves or declines the charge based on available funds.', position: { x: 920, y: 100 } },
      { id: 'ledger', label: 'Ledger', description: 'Double-entry bookkeeping system. Every transaction has matching debit and credit entries.', position: { x: 500, y: 350 } },
      { id: 'settlement', label: 'Settlement', description: 'Batch process that transfers actual funds between banks, typically T+1 or T+2 days.', position: { x: 720, y: 350 } },
      { id: 'merchant', label: 'Merchant', description: 'Business receiving the payment. Funds appear after settlement.', position: { x: 920, y: 350 } },
    ],
    edges: [
      { id: 'e1', source: 'customer', target: 'payment-api', label: 'Pay $X', animated: true },
      { id: 'e2', source: 'payment-api', target: 'fraud', label: 'Risk Check' },
      { id: 'e3', source: 'payment-api', target: 'payment-processor', label: 'Process' },
      { id: 'e4', source: 'payment-processor', target: 'card-network', label: 'Authorize' },
      { id: 'e5', source: 'card-network', target: 'issuing-bank', label: 'Approve?', animated: true },
      { id: 'e6', source: 'payment-processor', target: 'ledger', label: 'Record' },
      { id: 'e7', source: 'ledger', target: 'settlement', label: 'Settle' },
      { id: 'e8', source: 'settlement', target: 'merchant', label: 'Funds', animated: true },
      { id: 'e9', source: 'issuing-bank', target: 'payment-processor', label: 'Auth Response' },
    ],
    steps: [
      { number: 1, title: 'Payment Initiated', description: 'Customer submits payment. The API receives it with an idempotency key to prevent duplicate charges.', highlightNodes: ['customer', 'payment-api'] },
      { number: 2, title: 'Fraud Check', description: 'ML models evaluate the transaction for fraud signals: unusual location, amount, velocity, device fingerprint.', highlightNodes: ['fraud'] },
      { number: 3, title: 'Authorization', description: 'The payment processor sends an authorization request through the card network to the customer\'s bank.', highlightNodes: ['payment-processor', 'card-network', 'issuing-bank'] },
      { number: 4, title: 'Ledger Entry', description: 'On approval, a double-entry is made: debit the customer, credit the merchant. Every dollar is accounted for.', highlightNodes: ['ledger'] },
      { number: 5, title: 'Settlement', description: 'At end of day, all transactions are batched and actual money moves between banks (ACH/wire). This takes 1-2 business days.', highlightNodes: ['settlement'] },
      { number: 6, title: 'Merchant Receives Funds', description: 'After settlement, funds (minus processing fees) are deposited into the merchant\'s bank account.', highlightNodes: ['merchant'] },
    ],
    designDecisions: [
      { question: 'Why idempotency keys?', answer: 'Network failures can cause payment requests to be sent twice. Idempotency keys ensure the same payment is never processed twice, preventing double charges.' },
      { question: 'Why double-entry bookkeeping?', answer: 'Every transaction records both a debit and credit. If they don\'t balance, something is wrong. This centuries-old technique catches errors immediately.' },
    ],
    tradeoffs: { scalability: 7, availability: 9, consistency: 10, latency: 7, durability: 10, simplicity: 3 },
    furtherReading: [
      { title: 'Stripe Engineering Blog', url: 'https://stripe.com/blog/engineering', type: 'blog' },
      { title: 'Designing Payment Systems', url: 'https://blog.bytebytego.com', type: 'blog' },
    ],
  },

  'stock-exchange': {
    slug: 'stock-exchange',
    summary: 'A stock exchange matches buy and sell orders using an order book with price-time priority, operating with sub-microsecond latency through memory-mapped data structures, kernel bypass networking, and FPGA-based matching engines.',
    analogy: 'A stock exchange is like a high-speed auction house where millions of buyers and sellers shout their prices simultaneously, and an incredibly fast auctioneer matches them in nanoseconds based on who offered the best price first.',
    nodes: [
      { id: 'trader', label: 'Trader', description: 'Market participant submitting buy/sell orders through a broker.', position: { x: 50, y: 200 } },
      { id: 'gateway', label: 'Gateway', description: 'Entry point receiving orders via FIX protocol. Validates and throttles.', position: { x: 280, y: 200 } },
      { id: 'sequencer', label: 'Sequencer', description: 'Assigns a deterministic sequence number to every order for fairness and replay.', position: { x: 500, y: 100 } },
      { id: 'matching-engine', label: 'Matching Engine', description: 'Core engine that matches buy/sell orders using price-time priority. Sub-microsecond latency.', position: { x: 500, y: 200 } },
      { id: 'order-book', label: 'Order Book', description: 'In-memory data structure with sorted bid/ask queues for each security.', position: { x: 500, y: 340 } },
      { id: 'market-data', label: 'Market Data', description: 'Real-time dissemination of trades, quotes, and order book depth to all participants.', position: { x: 750, y: 100 } },
      { id: 'clearing', label: 'Clearing House', description: 'Acts as counterparty to both sides, managing risk and guaranteeing settlement.', position: { x: 750, y: 200 } },
      { id: 'settlement', label: 'Settlement (T+1)', description: 'Actual transfer of securities and funds between parties, typically T+1.', position: { x: 750, y: 340 } },
      { id: 'surveillance', label: 'Surveillance', description: 'Monitors for market manipulation, insider trading, and other violations.', position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'trader', target: 'gateway', label: 'Order (FIX)', animated: true },
      { id: 'e2', source: 'gateway', target: 'sequencer', label: 'Sequence' },
      { id: 'e3', source: 'sequencer', target: 'matching-engine', label: 'Ordered' },
      { id: 'e4', source: 'matching-engine', target: 'order-book', label: 'Match' },
      { id: 'e5', source: 'matching-engine', target: 'market-data', label: 'Trade Report', animated: true },
      { id: 'e6', source: 'matching-engine', target: 'clearing', label: 'Clear' },
      { id: 'e7', source: 'clearing', target: 'settlement', label: 'Settle' },
      { id: 'e8', source: 'market-data', target: 'trader', label: 'Feed', animated: true },
      { id: 'e9', source: 'clearing', target: 'surveillance', label: 'Monitor' },
    ],
    steps: [
      { number: 1, title: 'Order Submission', description: 'A trader submits a buy or sell order (symbol, quantity, price, type) through FIX protocol.', highlightNodes: ['trader', 'gateway'] },
      { number: 2, title: 'Sequencing', description: 'The order is assigned a sequence number ensuring deterministic processing order — critical for fairness.', highlightNodes: ['sequencer'] },
      { number: 3, title: 'Order Matching', description: 'The matching engine checks the order book. If a buy price ≥ sell price, a trade executes at the seller\'s price.', highlightNodes: ['matching-engine', 'order-book'] },
      { number: 4, title: 'Market Data', description: 'Trade confirmations and updated quotes are disseminated to all market participants in real-time.', highlightNodes: ['market-data'] },
      { number: 5, title: 'Clearing', description: 'The clearing house becomes the counterparty to both buyer and seller, managing counterparty risk.', highlightNodes: ['clearing'] },
      { number: 6, title: 'Settlement', description: 'Securities and funds are exchanged between accounts. Most markets now settle T+1 (next business day).', highlightNodes: ['settlement'] },
    ],
    designDecisions: [
      { question: 'Why price-time priority?', answer: 'Best price first, then first-come-first-served at the same price. This incentivizes competitive pricing and rewards speed fairly.' },
      { question: 'Why kernel bypass networking?', answer: 'Standard kernel networking adds microseconds of latency. Kernel bypass (DPDK/RDMA) achieves sub-microsecond latency required for modern exchange matching.' },
    ],
    tradeoffs: { scalability: 6, availability: 10, consistency: 10, latency: 10, durability: 9, simplicity: 2 },
    furtherReading: [
      { title: 'How Stock Exchanges Work - ByteByteGo', url: 'https://blog.bytebytego.com', type: 'blog' },
      { title: 'LMAX Exchange Architecture', url: 'https://martinfowler.com/articles/lmax.html', type: 'blog' },
    ],
  },
};

export function getSystemDetail(slug: string): SystemDetail | undefined {
  return systemDetails[slug];
}
