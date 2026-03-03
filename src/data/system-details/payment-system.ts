import type { ISystemDesign } from './types';

export const paymentSystemDetail: ISystemDesign = {
  slug: 'payment-system',
  summary:
    'A payment system processes financial transactions through a multi-party flow: payment gateway, payment processor, card network, and issuing bank. The system must handle exactly-once processing via idempotency keys, double-entry bookkeeping for auditability, and PCI-DSS compliance for card data security. Stripe and similar processors handle hundreds of billions in annual transaction volume.',
  analogy:
    'Imagine buying something at a store with a credit card. The card terminal (payment gateway) calls the store\'s bank (acquirer), which calls the card company\'s highway system (card network like Visa), which calls your bank (issuer) to check your balance and approve the charge. The money then flows backward through the same chain. Each party keeps meticulous records in case of disputes.',
  nodes: [
    { id: 'merchant', label: 'Merchant App', position: { x: 0, y: 200 }, description: 'E-commerce or POS application that initiates payment. Collects payment details (card number, amount, currency) and sends them to the payment gateway. Uses tokenization to avoid handling raw card data.', type: 'client', techStack: ['React', 'Stripe.js', 'PCI SAQ-A'] },
    { id: 'gateway', label: 'Payment Gateway', position: { x: 200, y: 200 }, description: 'Receives payment requests, tokenizes card data (replacing PAN with a token), performs fraud detection, and routes to the appropriate payment processor. Assigns an idempotency key to ensure exactly-once processing.', type: 'gateway', techStack: ['API Gateway', 'Tokenization', 'Idempotency'] },
    { id: 'fraud-engine', label: 'Fraud Detection', position: { x: 200, y: 50 }, description: 'ML models that score each transaction for fraud risk in real-time. Features include: transaction amount, merchant category, geographic location, device fingerprint, velocity checks, and behavioral patterns.', type: 'compute', techStack: ['ML Models', 'Rule Engine', 'Risk Scoring'] },
    { id: 'processor', label: 'Payment Processor', position: { x: 450, y: 200 }, description: 'Formats the transaction according to card network specifications (ISO 8583 message format) and submits it to the appropriate card network. Handles retry logic with exponential backoff for network failures.', type: 'service', techStack: ['ISO 8583', 'mTLS', 'HSM'] },
    { id: 'card-network', label: 'Card Network', position: { x: 650, y: 200 }, description: 'Visa, Mastercard, or other networks that route authorization requests from the acquirer to the issuing bank. The network also handles settlement (moving actual money) in daily batch cycles.', type: 'infrastructure', techStack: ['VisaNet', 'Banknet', 'ISO 8583'] },
    { id: 'issuing-bank', label: 'Issuing Bank', position: { x: 850, y: 200 }, description: 'The cardholder\'s bank that authorized the card. Checks the account balance/credit limit, applies fraud rules, and approves or declines the transaction. Returns an authorization code on approval.', type: 'service', techStack: ['Core Banking', 'Auth System'] },
    { id: 'ledger', label: 'Double-Entry Ledger', position: { x: 450, y: 400 }, description: 'Records every financial event as a double-entry (debit one account, credit another). The sum of all debits always equals the sum of all credits. This is the source of truth for reconciliation and auditing.', type: 'storage', techStack: ['PostgreSQL', 'Append-Only', 'ACID'] },
    { id: 'settlement', label: 'Settlement Service', position: { x: 650, y: 400 }, description: 'Handles the actual movement of money between banks. Runs in daily batch cycles (T+1 or T+2). Reconciles authorized transactions with actual fund transfers. Handles chargebacks and refunds.', type: 'service', techStack: ['ACH', 'SWIFT', 'Batch Processing'] },
    { id: 'webhook-service', label: 'Webhook / Events', position: { x: 0, y: 400 }, description: 'Notifies the merchant of payment events (success, failure, refund, chargeback) via webhooks or event streams. Implements reliable delivery with retries and idempotent processing on the merchant side.', type: 'service', techStack: ['Webhooks', 'Event Queue', 'Retry Logic'] },
  ],
  edges: [
    { id: 'e1', source: 'merchant', target: 'gateway', label: 'Payment Request', edgeType: 'protocol' },
    { id: 'e2', source: 'gateway', target: 'fraud-engine', label: 'Risk Check', edgeType: 'data' },
    { id: 'e3', source: 'gateway', target: 'processor', label: 'Process Payment', edgeType: 'protocol' },
    { id: 'e4', source: 'processor', target: 'card-network', label: 'Authorization (ISO 8583)', edgeType: 'protocol' },
    { id: 'e5', source: 'card-network', target: 'issuing-bank', label: 'Auth Request', edgeType: 'protocol' },
    { id: 'e6', source: 'issuing-bank', target: 'card-network', label: 'Approve/Decline', edgeType: 'protocol' },
    { id: 'e7', source: 'card-network', target: 'processor', label: 'Auth Response', edgeType: 'protocol' },
    { id: 'e8', source: 'processor', target: 'ledger', label: 'Record Transaction', edgeType: 'data' },
    { id: 'e9', source: 'ledger', target: 'settlement', label: 'Settlement Batch', edgeType: 'async', animated: true },
    { id: 'e10', source: 'gateway', target: 'webhook-service', label: 'Payment Event', edgeType: 'async', animated: true },
    { id: 'e11', source: 'webhook-service', target: 'merchant', label: 'Webhook Callback', edgeType: 'async', animated: true },
  ],
  steps: [
    {
      number: 1,
      title: 'Payment Initiation',
      description:
        'The merchant app collects payment details and submits a payment request with an idempotency key (a UUID chosen by the merchant). If the same request is submitted twice (due to network retry), the idempotency key ensures only one charge is created.\n\nPCI-DSS compliance requires that raw card numbers (PAN) are handled only by certified systems. Stripe.js and similar SDKs collect card data directly, preventing the merchant from ever seeing it.',
      highlightNodes: ['merchant', 'gateway'],
    },
    {
      number: 2,
      title: 'Fraud Detection',
      description:
        'The fraud engine scores the transaction in real-time (<100ms). ML models analyze hundreds of features: is the purchase amount unusual for this card? Is the device fingerprint recognized? Is the geographic location consistent with the cardholder\'s history? Are there velocity anomalies (many transactions in a short period)?\n\nHigh-risk transactions are either blocked, flagged for 3D Secure (additional authentication), or allowed with elevated monitoring.',
      highlightNodes: ['fraud-engine', 'gateway'],
    },
    {
      number: 3,
      title: 'Authorization Request',
      description:
        'The payment processor formats the transaction into an ISO 8583 message — the banking industry standard for card transaction messaging. The message includes: card number (encrypted), amount, currency, merchant category code, and terminal ID.\n\nThe message is sent to the card network (Visa/Mastercard) over a dedicated, encrypted connection (mTLS). The card network routes it to the cardholder\'s issuing bank.',
      highlightNodes: ['processor', 'card-network', 'issuing-bank'],
    },
    {
      number: 4,
      title: 'Bank Authorization',
      description:
        'The issuing bank checks: Does the card exist? Is it active? Is the balance/credit sufficient? Does this transaction match any fraud patterns? For 3D Secure-enrolled cards, the bank may trigger additional authentication (SMS OTP or biometric).\n\nThe bank returns an authorization code (approval) or a decline reason. The authorization places a hold on the funds but doesn\'t move money yet.',
      highlightNodes: ['issuing-bank', 'card-network'],
    },
    {
      number: 5,
      title: 'Ledger Recording',
      description:
        'Every financial event is recorded in the double-entry ledger. An authorized payment creates two entries: debit the customer\'s liability account, credit the merchant\'s receivable account. The ledger is append-only — entries are never modified, only new entries can reverse previous ones.\n\nDouble-entry bookkeeping ensures that the sum of all debits always equals the sum of all credits, making discrepancies immediately detectable.',
      highlightNodes: ['ledger', 'processor'],
    },
    {
      number: 6,
      title: 'Settlement',
      description:
        'Settlement is the actual movement of money, typically in daily batch cycles (T+1 means settlement occurs one business day after authorization). The card network aggregates all transactions between participants and calculates net amounts.\n\nActual fund transfers occur via banking rails: ACH (US), SEPA (Europe), or SWIFT (international). The settlement service reconciles settled amounts against authorized amounts and handles discrepancies.',
      highlightNodes: ['settlement', 'ledger'],
    },
    {
      number: 7,
      title: 'Merchant Notification',
      description:
        'The merchant receives payment status via webhooks — HTTP callbacks to a merchant-provided URL. Events include: payment succeeded, payment failed, refund processed, chargeback received. Webhooks are delivered with at-least-once semantics (retried on failure), so merchants must handle them idempotently.\n\nFor reliability, events are also available via polling the API, ensuring merchants can recover missed webhooks.',
      highlightNodes: ['webhook-service', 'merchant'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use idempotency keys for payment requests?',
      answer:
        'Network failures can cause the client to retry a payment request without knowing if the first attempt succeeded. Without idempotency, this could result in double-charging the customer. An idempotency key (a unique identifier per payment intent) allows the server to recognize duplicate requests and return the same result without processing twice. This is the most critical correctness requirement in payment systems.',
    },
    {
      question: 'Why use double-entry bookkeeping instead of simple transaction logs?',
      answer:
        'Double-entry bookkeeping creates two entries for every financial event (debit and credit). This provides a built-in integrity check: if debits don\'t equal credits, there\'s an error. Single-entry systems can lose track of money flow. For payment processors handling billions of dollars, the self-auditing property of double-entry is essential for regulatory compliance and trust.',
    },
    {
      question: 'Why separate authorization from settlement?',
      answer:
        'Authorization verifies the card and places a hold on funds, but doesn\'t move money. This allows for modifications (partial captures, voids) before settlement. A hotel might authorize $500 at check-in but only settle $350 at checkout. Batch settlement (T+1) also reduces banking costs compared to real-time fund transfers for each transaction.',
    },
    {
      question: 'Why tokenize card numbers instead of storing them?',
      answer:
        'PCI-DSS compliance imposes severe requirements on any system that stores raw card numbers (annual audits, network segmentation, encryption at rest). Tokenization replaces the PAN with a non-sensitive substitute. The token can be stored freely while the actual card number exists only in a PCI-certified vault. This reduces compliance scope from the entire system to just the tokenization service.',
    },
  ],
  plainSummary:
    'A payment system is like a very careful accountant who processes money transfers. When you buy something online, the system verifies your identity, checks you have enough money, contacts your bank, records every step, and makes sure money moves exactly once — even if something goes wrong halfway through.',

  flowSteps: [
    { emoji: '🛒', title: 'You click "Pay"', description: 'You enter your card details and confirm the purchase on a website or app.' },
    { emoji: '🔐', title: 'Data is encrypted', description: 'Your payment information is encrypted and sent securely to the payment processor.' },
    { emoji: '🏦', title: 'Bank is contacted', description: 'The processor asks your bank if you have enough funds and if the transaction looks legitimate.' },
    { emoji: '✅', title: 'Transaction is authorized', description: 'The bank approves (or declines) the charge and puts a hold on the amount.' },
    { emoji: '📝', title: 'Everything is recorded', description: 'Every step is written to a transaction log — creating an audit trail that can\'t be altered.' },
    { emoji: '💰', title: 'Money settles later', description: 'The actual fund transfer between banks happens in a separate settlement process, typically within 1-2 days.' },
  ],

  keyMetrics: [
    { label: 'Transactions/Sec', value: '65K+ (Visa)', icon: '⚡', description: 'Peak processing capacity' },
    { label: 'Uptime', value: '99.999%', icon: '🛡️', description: 'Five-nines availability target' },
    { label: 'Settlement', value: 'T+1 to T+2', icon: '⏰', description: 'Days to final fund settlement' },
    { label: 'Fraud Detection', value: '<100ms', icon: '🔍', description: 'Real-time fraud check latency' },
  ],

  furtherReading: [
    { title: 'How Payment System Works — ByteByteGo', url: 'https://lnkd.in/ecVw7jfi', type: 'blog' },
    { title: 'Stripe Engineering Blog — Designing Robust Payment Systems', url: 'https://stripe.com/blog/engineering', type: 'blog' },
    { title: 'PCI-DSS Requirements', url: 'https://www.pcisecuritystandards.org/', type: 'docs' },
    { title: 'ISO 8583 Financial Transaction Message Standard', url: 'https://en.wikipedia.org/wiki/ISO_8583', type: 'docs' },
  ],
};
