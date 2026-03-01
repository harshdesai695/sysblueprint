import { SystemDetail } from './types';

export const stockExchangeDetail: SystemDetail = {
  slug: 'stock-exchange',
  summary:
    'A stock exchange matches buy and sell orders in an order book with ultra-low latency (<1 microsecond for in-memory matching). The matching engine maintains price-time priority: orders at the best price execute first, with ties broken by arrival time. The system handles millions of orders per second with deterministic processing, multicast market data dissemination, and strict regulatory requirements.',
  analogy:
    'Imagine an auction house with thousands of simultaneous auctions. For each item (stock), there are buyers shouting bid prices and sellers shouting ask prices. The auctioneer (matching engine) instantly pairs the highest bidder with the lowest seller whenever their prices cross. Everything is recorded in a ledger, and the current best prices are broadcast to everyone in the room.',
  nodes: [
    { id: 'trader', label: 'Trader / Client', position: { x: 0, y: 200 }, description: 'Trading terminal or algorithmic trading system that submits orders. Connects via FIX protocol (Financial Information eXchange) or proprietary binary protocol for lowest latency.', type: 'client', techStack: ['FIX Protocol', 'Binary API', 'Co-location'] },
    { id: 'gateway', label: 'Order Gateway', position: { x: 200, y: 200 }, description: 'Validates incoming orders: checks account permissions, position limits, price reasonableness (circuit breakers), and message rate limits. Pre-trade risk checks happen here to prevent fat-finger errors.', type: 'gateway', techStack: ['FPGA', 'FIX Engine', 'Risk Checks'] },
    { id: 'sequencer', label: 'Sequencer', position: { x: 400, y: 100 }, description: 'Assigns a globally unique, monotonically increasing sequence number to each order. This establishes the official arrival order and ensures deterministic replay. Critical for time-priority matching and regulatory audit trails.', type: 'service', techStack: ['FPGA', 'Hardware Timestamping'] },
    { id: 'matching-engine', label: 'Matching Engine', position: { x: 600, y: 200 }, description: 'The core of the exchange: maintains an in-memory order book per symbol and matches incoming orders against resting orders using price-time priority. Processes orders in single-digit microseconds. Typically runs on a single thread per symbol to avoid locking.', type: 'compute', techStack: ['C/C++', 'Lock-free', 'Kernel Bypass'] },
    { id: 'order-book', label: 'Order Book', position: { x: 600, y: 50 }, description: 'In-memory data structure holding all resting (unmatched) orders organized by price level. Buy side sorted descending (best bid on top), sell side sorted ascending (best ask on top). The difference between best bid and best ask is the spread.', type: 'storage', techStack: ['Red-Black Tree', 'Price-Time Queue'] },
    { id: 'market-data', label: 'Market Data Feed', position: { x: 800, y: 100 }, description: 'Disseminates real-time market data to all participants: trade executions, order book updates (top-of-book and depth), and statistics. Uses UDP multicast for lowest latency delivery to all subscribers simultaneously.', type: 'service', techStack: ['UDP Multicast', 'ITCH Protocol', 'Kernel Bypass'] },
    { id: 'trade-store', label: 'Trade Store', position: { x: 800, y: 300 }, description: 'Persists all executed trades for regulatory reporting, clearing, and settlement. Append-only write-ahead log ensures durability. Trades must be reported to regulators within microseconds (consolidated tape).', type: 'storage', techStack: ['Append-Only Log', 'WAL', 'Regulatory Reporting'] },
    { id: 'clearing-house', label: 'Clearing House', position: { x: 800, y: 500 }, description: 'Central counterparty (CCP) that interposes itself between buyer and seller, guaranteeing trade settlement. Manages margin requirements, netting (offsetting buy and sell positions), and default management.', type: 'service', techStack: ['Netting', 'Margin', 'CCP'] },
    { id: 'risk-engine', label: 'Risk Engine', position: { x: 400, y: 400 }, description: 'Real-time position and risk monitoring. Tracks each participant\'s net position and margin utilization. Can halt trading for a participant who exceeds risk limits. Circuit breakers halt the entire market during extreme price movements.', type: 'compute', techStack: ['Real-time Position Tracking', 'Circuit Breakers'] },
  ],
  edges: [
    { id: 'e1', source: 'trader', target: 'gateway', label: 'Submit Order (FIX)', edgeType: 'protocol' },
    { id: 'e2', source: 'gateway', target: 'sequencer', label: 'Validated Order', edgeType: 'protocol' },
    { id: 'e3', source: 'sequencer', target: 'matching-engine', label: 'Sequenced Order', edgeType: 'protocol' },
    { id: 'e4', source: 'matching-engine', target: 'order-book', label: 'Update Book', edgeType: 'data' },
    { id: 'e5', source: 'matching-engine', target: 'market-data', label: 'Trade/Quote', edgeType: 'data' },
    { id: 'e6', source: 'matching-engine', target: 'trade-store', label: 'Record Trade', edgeType: 'data' },
    { id: 'e7', source: 'market-data', target: 'trader', label: 'Market Data (Multicast)', edgeType: 'protocol', animated: true },
    { id: 'e8', source: 'trade-store', target: 'clearing-house', label: 'Clear & Settle', edgeType: 'async', animated: true },
    { id: 'e9', source: 'gateway', target: 'risk-engine', label: 'Pre-trade Risk', edgeType: 'data' },
    { id: 'e10', source: 'matching-engine', target: 'risk-engine', label: 'Position Updates', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Order Submission',
      description:
        'A trader submits an order via FIX protocol specifying: symbol, side (buy/sell), quantity, order type (limit, market, stop), and for limit orders, a price. Algorithmic trading firms use co-located servers (physically in the exchange\'s data center) and FPGA-accelerated network stacks to minimize submission latency to under 1 microsecond.\n\nThe FIX (Financial Information eXchange) protocol is the industry standard messaging format for trading, defining message types for new orders, cancellations, fills, and rejections.',
      highlightNodes: ['trader', 'gateway'],
    },
    {
      number: 2,
      title: 'Pre-trade Risk Checks',
      description:
        'The order gateway performs validation: Does the account have permission to trade this symbol? Does the order exceed position limits? Is the price within circuit breaker bands (e.g., within 10% of the last trade)? Does the participant\'s aggregate order rate exceed message rate limits?\n\nThese checks must complete in microseconds to avoid adding latency. FPGA-based gateways can perform these checks in hardware for sub-microsecond processing.',
      highlightNodes: ['gateway', 'risk-engine'],
    },
    {
      number: 3,
      title: 'Sequencing',
      description:
        'The sequencer assigns a globally unique sequence number to each order, establishing the official arrival timestamp. This is critical because time-priority matching (same price, earlier order gets filled first) requires an undisputed ordering of events.\n\nHardware timestamping with nanosecond precision and FPGA-based sequencing ensure fairness and enable deterministic replay of the entire trading day for regulatory audits.',
      highlightNodes: ['sequencer'],
    },
    {
      number: 4,
      title: 'Order Matching',
      description:
        'The matching engine processes orders single-threaded per symbol (no locks needed). For an incoming buy limit order at price P:\n\n1. Check if any resting sell orders exist at price ≤ P\n2. If yes, match against the sell order at the lowest price (price priority), then earliest arrival (time priority)\n3. Execute the trade at the resting order\'s price\n4. If the incoming order is not fully filled, either match further or rest in the book\n\nMarket orders match at the best available price immediately. The entire match process takes under 1 microsecond in modern exchanges.',
      highlightNodes: ['matching-engine', 'order-book'],
    },
    {
      number: 5,
      title: 'Market Data Dissemination',
      description:
        'Every order book change and trade execution generates a market data event broadcast to all participants via UDP multicast. The ITCH protocol is a binary, unidirectional protocol optimized for minimum parsing overhead.\n\nUDP multicast delivers data to all subscribers simultaneously with a single network transmission, unlike TCP which requires separate connections per subscriber. This ensures all participants receive data at the same time (fairness).',
      highlightNodes: ['market-data', 'trader'],
    },
    {
      number: 6,
      title: 'Trade Recording and Reporting',
      description:
        'Executed trades are written to an append-only log with regulatory fields: execution time (nanosecond precision), symbol, price, quantity, buyer and seller identifiers. Trades are reported to the consolidated tape (a public record of all trades) within microseconds.\n\nThe trade store is designed for sequential writes and serves as the authoritative record for regulatory audits, dispute resolution, and market surveillance.',
      highlightNodes: ['trade-store'],
    },
    {
      number: 7,
      title: 'Clearing and Settlement',
      description:
        'The clearing house acts as the central counterparty (CCP) for every trade. Through novation, it becomes the buyer to every seller and the seller to every buyer, eliminating counterparty risk. Netting reduces settlement obligations — if firm A bought 100 shares and sold 80 shares, it only needs to settle the net 20 shares.\n\nSettlement occurs on T+1 (one business day after trade), where actual shares and cash change hands through central depositories.',
      highlightNodes: ['clearing-house', 'trade-store'],
    },
  ],
  designDecisions: [
    {
      question: 'Why process orders single-threaded per symbol?',
      answer:
        'Multi-threaded matching would require locks or lock-free data structures for the order book, adding latency and complexity. Since orders for each symbol are independent, assigning one thread per symbol (or per partition of symbols) provides deterministic, lock-free processing. A single core can match millions of orders per second in a tight loop, which exceeds the throughput needs of even the busiest symbols.',
    },
    {
      question: 'Why use UDP multicast for market data instead of TCP?',
      answer:
        'TCP requires a separate connection and packet stream per subscriber, creating O(N) work at the sender for N subscribers. UDP multicast sends one packet that the network switch replicates to all subscribers — O(1) work at the source. For latency-sensitive market data reaching thousands of subscribers, multicast provides both lower latency and fairness (all receive simultaneously). The tradeoff is handling packet loss at the application level.',
    },
    {
      question: 'Why use FPGA acceleration instead of pure software?',
      answer:
        'FPGAs process network packets in hardware, bypassing the entire operating system kernel (no interrupts, no context switches, no protocol stack). This achieves deterministic sub-microsecond latency — critical for fairness when nanoseconds matter. Software on a general-purpose CPU introduces variable jitter from OS scheduling, garbage collection, and cache misses that FPGAs avoid.',
    },
    {
      question: 'Why does the clearing house use novation?',
      answer:
        'Without a CCP, each trader bears counterparty risk — if the trader on the other side of the trade defaults, you might not receive your shares or cash. Novation puts the CCP in the middle: you trade with the clearing house, not directly with the counterparty. The CCP manages this risk through margin requirements, default funds, and netting. This enables anonymous trading and reduces systemic risk.',
    },
  ],
  tradeoffs: {
    scalability: 7,
    availability: 10,
    consistency: 10,
    latency: 10,
    durability: 9,
    simplicity: 2,
  },
  furtherReading: [
    { title: 'How Stock Exchange Works — ByteByteGo', url: 'https://lnkd.in/eNf2QxVZ', type: 'blog' },
    { title: 'LMAX Exchange Architecture (Disruptor Pattern)', url: 'https://martinfowler.com/articles/lmax.html', type: 'blog' },
    { title: 'FIX Protocol Specification', url: 'https://www.fixtrading.org/standards/', type: 'docs' },
    { title: 'How the NYSE Works (Market Microstructure)', url: 'https://www.youtube.com/watch?v=WdVocHwzBTg', type: 'video' },
  ],
};
