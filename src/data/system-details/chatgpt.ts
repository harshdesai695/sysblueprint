import { SystemDetail } from './types';

export const chatgptDetail: SystemDetail = {
  slug: 'chatgpt',
  summary:
    'ChatGPT serves a large language model built on the Transformer architecture. User prompts flow through a multi-stage pipeline: tokenization, embedding lookup, multi-head self-attention across dozens of decoder layers, and autoregressive token generation. Inference is distributed across thousands of GPUs using tensor and pipeline parallelism, with KV-cache optimization to avoid recomputing attention for prior tokens.',
  analogy:
    'Imagine a vast library where a librarian (the model) has read every book. When you ask a question, the librarian doesn\'t look anything up — instead, they predict the most likely next word based on everything they\'ve ever read, one word at a time, until the answer is complete.',
  nodes: [
    { id: 'client', label: 'Client App', position: { x: 0, y: 200 }, description: 'Browser or mobile application where the user types a prompt and receives streamed responses via SSE or WebSocket.', type: 'client', techStack: ['React', 'Next.js', 'SSE'] },
    { id: 'api-gateway', label: 'API Gateway', position: { x: 200, y: 200 }, description: 'Authenticates requests, enforces rate limits, performs content moderation filtering, and routes to the inference service. Handles billing metering per token.', type: 'gateway', techStack: ['Nginx', 'Custom Auth', 'Rate Limiter'] },
    { id: 'load-balancer', label: 'Load Balancer', position: { x: 400, y: 200 }, description: 'Distributes inference requests across GPU clusters, using least-connections or model-affinity routing to maximize GPU utilization and minimize cold starts.', type: 'infrastructure', techStack: ['L4/L7 LB', 'gRPC'] },
    { id: 'tokenizer', label: 'Tokenizer', position: { x: 600, y: 100 }, description: 'Converts raw text into BPE (Byte Pair Encoding) token IDs. GPT-4 uses a ~100k token vocabulary. Tokenization determines context window consumption.', type: 'processing', techStack: ['tiktoken', 'BPE'] },
    { id: 'inference-engine', label: 'Inference Engine', position: { x: 600, y: 300 }, description: 'Runs the Transformer forward pass: embedding lookup, positional encoding, multi-head self-attention across 96+ layers, feed-forward networks, and softmax sampling. Uses KV-cache to cache key-value pairs from previous tokens.', type: 'compute', techStack: ['PyTorch', 'Triton', 'CUDA', 'vLLM'] },
    { id: 'gpu-cluster', label: 'GPU Cluster', position: { x: 850, y: 300 }, description: 'Thousands of NVIDIA A100/H100 GPUs organized into pods. Model weights are sharded via tensor parallelism (within a node) and pipeline parallelism (across nodes). NVLink and InfiniBand provide high-bandwidth interconnect.', type: 'compute', techStack: ['A100/H100', 'NVLink', 'InfiniBand', 'NCCL'] },
    { id: 'kv-cache', label: 'KV Cache', position: { x: 850, y: 100 }, description: 'Stores computed key-value attention pairs for all previously generated tokens in a conversation, avoiding redundant recomputation. Managed with PagedAttention for efficient GPU memory utilization.', type: 'cache', techStack: ['GPU HBM', 'PagedAttention'] },
    { id: 'model-store', label: 'Model Store', position: { x: 850, y: 500 }, description: 'Stores versioned model checkpoints (hundreds of GB each). Weights are loaded into GPU memory on startup. Supports A/B testing between model versions.', type: 'storage', techStack: ['S3', 'EFS', 'Model Registry'] },
    { id: 'safety-layer', label: 'Safety Layer', position: { x: 400, y: 400 }, description: 'RLHF-trained reward model and rule-based filters that evaluate outputs for harmful content, hallucination indicators, and policy violations before delivery to the user.', type: 'processing', techStack: ['Reward Model', 'RLHF', 'Content Filters'] },
    { id: 'streaming-service', label: 'Streaming Service', position: { x: 200, y: 400 }, description: 'Delivers generated tokens to the client in real-time via Server-Sent Events. Each token is sent as it is produced, enabling the characteristic word-by-word typing effect.', type: 'service', techStack: ['SSE', 'HTTP/2', 'gRPC-Web'] },
  ],
  edges: [
    { id: 'e1', source: 'client', target: 'api-gateway', label: 'Prompt', edgeType: 'protocol' },
    { id: 'e2', source: 'api-gateway', target: 'load-balancer', label: 'Authenticated Request', edgeType: 'protocol' },
    { id: 'e3', source: 'load-balancer', target: 'tokenizer', label: 'Route', edgeType: 'default' },
    { id: 'e4', source: 'tokenizer', target: 'inference-engine', label: 'Token IDs', edgeType: 'data' },
    { id: 'e5', source: 'inference-engine', target: 'gpu-cluster', label: 'Forward Pass', edgeType: 'protocol' },
    { id: 'e6', source: 'inference-engine', target: 'kv-cache', label: 'Read/Write KV', edgeType: 'data' },
    { id: 'e7', source: 'gpu-cluster', target: 'model-store', label: 'Load Weights', edgeType: 'async', animated: true },
    { id: 'e8', source: 'inference-engine', target: 'safety-layer', label: 'Generated Tokens', edgeType: 'data' },
    { id: 'e9', source: 'safety-layer', target: 'streaming-service', label: 'Filtered Output', edgeType: 'default' },
    { id: 'e10', source: 'streaming-service', target: 'client', label: 'SSE Stream', edgeType: 'protocol', animated: true },
  ],
  steps: [
    {
      number: 1,
      title: 'User Sends a Prompt',
      description:
        'The user types a message in the client application. The prompt is sent as an HTTP POST to the API gateway, along with conversation history (prior messages) to maintain context. The full conversation is included because the model itself is stateless — it has no memory between requests.',
      highlightNodes: ['client', 'api-gateway'],
    },
    {
      number: 2,
      title: 'Authentication and Rate Limiting',
      description:
        'The API gateway validates the API key or session token, checks usage quotas, and runs input through a content moderation classifier. Requests that pass are forwarded to the load balancer. Token consumption is metered here for billing purposes.\n\nThe moderation system uses a separate smaller model specifically trained to detect prompt injection attacks and policy-violating inputs.',
      highlightNodes: ['api-gateway', 'load-balancer'],
    },
    {
      number: 3,
      title: 'Tokenization',
      description:
        'The raw text prompt is converted into a sequence of integer token IDs using Byte Pair Encoding (BPE). GPT-4\'s tokenizer has a vocabulary of roughly 100,000 tokens. A single word like "unhappiness" might become `[un, happiness]` (2 tokens), while common words like "the" are a single token.\n\nThe tokenized sequence length determines how much of the model\'s context window (e.g., 128k tokens) is consumed.',
      highlightNodes: ['tokenizer'],
    },
    {
      number: 4,
      title: 'Inference — Transformer Forward Pass',
      description:
        'Token IDs are mapped to high-dimensional embedding vectors and combined with positional encodings. These pass through 96+ Transformer decoder layers, each applying multi-head self-attention (which lets every token attend to every other token) followed by feed-forward networks.\n\nThe KV-cache stores previously computed key-value attention pairs so that generating each new token only requires computing attention for the latest token against the cached history, reducing computational cost from O(n²) to O(n).',
      highlightNodes: ['inference-engine', 'gpu-cluster', 'kv-cache'],
    },
    {
      number: 5,
      title: 'GPU Cluster — Distributed Computation',
      description:
        'The model\'s parameters (hundreds of billions of weights) are too large for a single GPU. They are sharded across multiple GPUs using tensor parallelism (splitting individual matrix multiplications across GPUs within a node via NVLink) and pipeline parallelism (distributing layers across nodes connected by InfiniBand).\n\nEach GPU processes its shard of the computation and communicates intermediate activations via all-reduce operations using NCCL.',
      highlightNodes: ['gpu-cluster', 'model-store'],
    },
    {
      number: 6,
      title: 'Autoregressive Token Generation',
      description:
        'The model generates output one token at a time. After the forward pass produces a probability distribution over the vocabulary, a sampling strategy (temperature, top-p/nucleus sampling) selects the next token. This token is appended to the sequence, the KV-cache is updated, and the process repeats.\n\nSpeculative decoding techniques use a smaller draft model to predict multiple tokens ahead, then verify them in a single forward pass of the large model, improving throughput by 2-3x.',
      highlightNodes: ['inference-engine', 'kv-cache'],
    },
    {
      number: 7,
      title: 'Safety Filtering',
      description:
        'Each batch of generated tokens passes through the safety layer. An RLHF-trained reward model scores the output for helpfulness and harmlessness. Rule-based filters check for personally identifiable information leakage, code execution risks, and policy violations.\n\nIf the output is flagged, the generation may be halted and replaced with a refusal message.',
      highlightNodes: ['safety-layer'],
    },
    {
      number: 8,
      title: 'Streaming Response to Client',
      description:
        'Approved tokens are pushed to the client in real-time via Server-Sent Events (SSE). Each SSE event contains one or more tokens, producing the characteristic typing effect. The client reconstructs the full response incrementally.\n\nHTTP/2 multiplexing allows multiple SSE streams over a single TCP connection, reducing connection overhead.',
      highlightNodes: ['streaming-service', 'client'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use autoregressive generation instead of producing the entire response at once?',
      answer:
        'Transformer language models are inherently autoregressive — each token\'s probability depends on all previous tokens. Generating all tokens simultaneously would require knowing the full output in advance. The sequential approach also enables streaming, so users see partial results immediately rather than waiting for the full response.',
    },
    {
      question: 'Why implement KV-cache instead of recomputing attention from scratch?',
      answer:
        'Without KV-cache, generating a sequence of n tokens would require O(n²) total attention computations. By caching the key-value pairs from prior tokens, each new token only computes attention against the cache — reducing cost to O(n). PagedAttention further optimizes GPU memory by managing cache in non-contiguous memory pages.',
    },
    {
      question: 'Why use tensor parallelism plus pipeline parallelism?',
      answer:
        'Tensor parallelism splits a single layer\'s matrix multiplications across GPUs, bounded by NVLink bandwidth within a node (typically 8 GPUs). Pipeline parallelism distributes entire layers across nodes connected by InfiniBand. Combining both maximizes utilization: tensor parallelism exploits fast intra-node links while pipeline parallelism scales across nodes.',
    },
    {
      question: 'Why apply RLHF instead of relying solely on supervised fine-tuning?',
      answer:
        'Supervised fine-tuning teaches the model to mimic human demonstrations, but can\'t capture subjective quality preferences at scale. RLHF trains a reward model on human comparisons (which output is better), then uses PPO to optimize the language model against this reward signal. This significantly improves helpfulness, reduces harmful outputs, and aligns behavior with user expectations.',
    },
  ],
  tradeoffs: {
    scalability: 7,
    availability: 8,
    consistency: 6,
    latency: 5,
    durability: 7,
    simplicity: 3,
  },
  furtherReading: [
    { title: 'How ChatGPT Works — ByteByteGo', url: 'https://lnkd.in/emyP63Wx', type: 'blog' },
    { title: 'Attention Is All You Need (Original Transformer Paper)', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' },
    { title: 'Efficient Memory Management for LLM Serving with PagedAttention', url: 'https://arxiv.org/abs/2309.06180', type: 'paper' },
    { title: 'OpenAI GPT-4 Technical Report', url: 'https://arxiv.org/abs/2303.08774', type: 'paper' },
  ],
};
