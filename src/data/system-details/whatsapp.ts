import { SystemDetail } from './types';

export const whatsappDetail: SystemDetail = {
  slug: 'whatsapp',
  summary:
    'WhatsApp delivers 100 billion messages daily to 2+ billion users using a lean Erlang/BEAM-based architecture. Messages are end-to-end encrypted using the Signal Protocol. The system uses XMPP-derived protocol for real-time delivery, offline message queuing with Mnesia, and a remarkably small engineering team relative to its user base.',
  analogy:
    'Imagine a postal service where every letter is sealed in an unbreakable envelope that only the recipient can open (end-to-end encryption). The post office temporarily holds letters for recipients who aren\'t home (offline storage) and delivers them instantly when the recipient returns. The entire postal service is run by a small team because the mailboxes (Erlang processes) are incredibly efficient.',
  nodes: [
    { id: 'sender', label: 'Sender Device', position: { x: 0, y: 150 }, description: 'The sender\'s phone encrypts the message locally using the Signal Protocol before transmitting. Each message is encrypted with unique keys derived from the Double Ratchet algorithm, providing forward secrecy.', type: 'client', techStack: ['Signal Protocol', 'Double Ratchet', 'AES-256'] },
    { id: 'connection-server', label: 'Connection Server', position: { x: 250, y: 150 }, description: 'Maintains persistent TCP/WebSocket connections with every online client. Each BEAM VM handles millions of concurrent connections using lightweight Erlang processes (one per connection, ~2KB each).', type: 'service', techStack: ['Erlang/OTP', 'BEAM VM', 'Mnesia'] },
    { id: 'routing-service', label: 'Message Router', position: { x: 450, y: 50 }, description: 'Determines which connection server the recipient is connected to and routes the encrypted message. Uses a distributed presence system to track which server each user is connected to.', type: 'service', techStack: ['Erlang', 'Distributed ETS'] },
    { id: 'offline-store', label: 'Offline Message Queue', position: { x: 450, y: 300 }, description: 'Temporarily stores encrypted messages for recipients who are offline. Messages are queued in Mnesia (Erlang\'s built-in distributed database) and delivered when the user reconnects. Messages are deleted after delivery.', type: 'storage', techStack: ['Mnesia', 'Erlang Term Storage'] },
    { id: 'media-service', label: 'Media Service', position: { x: 250, y: 400 }, description: 'Handles encrypted image, video, and document uploads. Media is encrypted on-device, uploaded to blob storage with a random key, and only the decryption key is sent via message. WhatsApp servers never see unencrypted media.', type: 'service', techStack: ['Blob Storage', 'AES-256-CBC'] },
    { id: 'recipient', label: 'Recipient Device', position: { x: 700, y: 150 }, description: 'The recipient\'s phone decrypts the message using its local private key material. Delivery receipts (single check), read receipts (double blue check), and typing indicators flow back through the same channel.', type: 'client', techStack: ['Signal Protocol', 'Local Key Store'] },
    { id: 'key-server', label: 'Key Distribution', position: { x: 450, y: 500 }, description: 'Stores users\' public identity keys and prekeys. When Alice messages Bob for the first time, she fetches Bob\'s prekey bundle to establish an encrypted session. The server never has access to private keys.', type: 'service', techStack: ['X3DH Key Exchange', 'Curve25519'] },
    { id: 'group-service', label: 'Group Messaging', position: { x: 700, y: 350 }, description: 'Manages group metadata and implements Sender Key protocol for efficient group encryption. The sender encrypts the message once with a sender key, and each group member can decrypt. Maximum group size is 1024 members.', type: 'service', techStack: ['Sender Keys', 'Group Metadata'] },
    { id: 'registration', label: 'Registration Service', position: { x: 0, y: 400 }, description: 'Handles phone number verification via SMS/voice OTP, device registration, and key generation. Generates the user\'s identity key pair and uploads public prekeys to the key server.', type: 'service', techStack: ['SMS OTP', 'Voice OTP', 'Key Generation'] },
  ],
  edges: [
    { id: 'e1', source: 'sender', target: 'connection-server', label: 'Encrypted Message', edgeType: 'protocol' },
    { id: 'e2', source: 'connection-server', target: 'routing-service', label: 'Route to Recipient', edgeType: 'default' },
    { id: 'e3', source: 'routing-service', target: 'recipient', label: 'Deliver', edgeType: 'protocol' },
    { id: 'e4', source: 'routing-service', target: 'offline-store', label: 'Queue if Offline', edgeType: 'async', animated: true },
    { id: 'e5', source: 'offline-store', target: 'recipient', label: 'Deliver on Reconnect', edgeType: 'async', animated: true },
    { id: 'e6', source: 'sender', target: 'media-service', label: 'Upload Encrypted Media', edgeType: 'data' },
    { id: 'e7', source: 'media-service', target: 'recipient', label: 'Download & Decrypt', edgeType: 'data' },
    { id: 'e8', source: 'sender', target: 'key-server', label: 'Fetch Prekeys', edgeType: 'data' },
    { id: 'e9', source: 'sender', target: 'group-service', label: 'Group Message', edgeType: 'protocol' },
    { id: 'e10', source: 'registration', target: 'key-server', label: 'Upload Public Keys', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Session Establishment (X3DH)',
      description:
        'When Alice messages Bob for the first time, she fetches Bob\'s prekey bundle from the key server. Using the Extended Triple Diffie-Hellman (X3DH) protocol, Alice derives a shared secret from Bob\'s identity key, signed prekey, and a one-time prekey.\n\nThis shared secret initializes the Double Ratchet algorithm, which will generate unique encryption keys for every single message, providing forward secrecy — compromising one key doesn\'t reveal past or future messages.',
      highlightNodes: ['sender', 'key-server', 'recipient'],
    },
    {
      number: 2,
      title: 'Message Encryption',
      description:
        'Each message is encrypted on the sender\'s device using AES-256 in CBC mode with HMAC-SHA256 for authentication. The encryption key is derived from the Double Ratchet, which advances with every message.\n\nWhatsApp servers never possess the decryption keys — they only relay opaque encrypted payloads. This is true end-to-end encryption: neither WhatsApp nor any intermediary can read message content.',
      highlightNodes: ['sender'],
    },
    {
      number: 3,
      title: 'Message Routing',
      description:
        'The encrypted message reaches WhatsApp\'s connection server over a persistent TCP connection. The routing service looks up which connection server the recipient is currently connected to (via a distributed presence table) and forwards the message.\n\nErlang\'s actor model makes this efficient: each user connection is a lightweight process (~2KB of memory), and a single BEAM VM can handle millions of concurrent connections.',
      highlightNodes: ['connection-server', 'routing-service'],
    },
    {
      number: 4,
      title: 'Offline Message Queuing',
      description:
        'If the recipient is offline, the encrypted message is stored in Mnesia, Erlang\'s distributed database. Messages are queued per-user and held until the recipient reconnects (up to 30 days).\n\nWhen the recipient comes online, all queued messages are delivered in order and deleted from the server. The server acts as a temporary relay — it never stores messages long-term.',
      highlightNodes: ['offline-store'],
    },
    {
      number: 5,
      title: 'Message Delivery and Receipts',
      description:
        'The recipient\'s device decrypts the message using its local Double Ratchet state. Delivery status flows back: a single gray check means delivered to the server, double gray checks mean delivered to the recipient\'s device, double blue checks mean the recipient opened the chat.\n\nEach status update is itself a small encrypted message flowing through the same pipeline.',
      highlightNodes: ['recipient', 'routing-service', 'sender'],
    },
    {
      number: 6,
      title: 'Media Transfer',
      description:
        'For images, videos, and documents, the media is encrypted on-device with a random AES key, then uploaded to WhatsApp\'s blob storage. The sender transmits only the encrypted blob\'s URL and the decryption key via the regular message channel.\n\nThe recipient downloads the encrypted blob and decrypts it locally. WhatsApp\'s servers store encrypted media blobs they cannot decrypt.',
      highlightNodes: ['sender', 'media-service', 'recipient'],
    },
    {
      number: 7,
      title: 'Group Messaging',
      description:
        'Group messages use the Sender Keys protocol for efficiency. Each group member generates a sender key and distributes it to all other members (encrypted via their pairwise sessions). To send a group message, the sender encrypts once with their sender key, and the server fans out the ciphertext to all group members.\n\nThis is far more efficient than encrypting individually for each member (which would require N separate encryptions for an N-member group).',
      highlightNodes: ['group-service', 'sender', 'recipient'],
    },
  ],
  designDecisions: [
    {
      question: 'Why choose Erlang/BEAM instead of Java or Go?',
      answer:
        'Erlang was designed for telecom systems requiring massive concurrency and fault tolerance. Each connection is an independent lightweight process (~2KB vs ~1MB for OS threads), enabling millions of concurrent connections per server. The "let it crash" philosophy with supervision trees provides self-healing. WhatsApp famously handled 2 million connections per server with a team of ~50 engineers.',
    },
    {
      question: 'Why implement end-to-end encryption using the Signal Protocol?',
      answer:
        'The Signal Protocol provides forward secrecy (compromised keys don\'t expose past messages), post-compromise security (the ratchet recovers security after key compromise), and deniability. Unlike simpler encryption schemes, the Double Ratchet generates unique keys per message. This is considered the gold standard for messaging encryption, independently audited and proven secure.',
    },
    {
      question: 'Why use Sender Keys for groups instead of pairwise encryption?',
      answer:
        'Pairwise encryption would require the sender to encrypt the message N times for a group of N members. Sender Keys allow encrypting once — each member can decrypt using the sender\'s shared key. The tradeoff is that removing a member requires all remaining members to generate new sender keys, but this is acceptable since member removal is infrequent.',
    },
    {
      question: 'Why delete messages from the server after delivery?',
      answer:
        'Storing messages would create a massive target for attackers and government subpoenas. By deleting messages after delivery (and capping offline storage at 30 days), WhatsApp minimizes the data it holds. Combined with E2E encryption, even stored messages are opaque to the server, providing defense in depth.',
    },
  ],
  tradeoffs: {
    scalability: 9,
    availability: 9,
    consistency: 7,
    latency: 9,
    durability: 6,
    simplicity: 6,
  },
  furtherReading: [
    { title: 'How WhatsApp Works — ByteByteGo', url: 'https://lnkd.in/eU2fswMi', type: 'blog' },
    { title: 'WhatsApp Encryption Overview (Technical Whitepaper)', url: 'https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf', type: 'paper' },
    { title: 'The Signal Protocol — Signal Foundation', url: 'https://signal.org/docs/', type: 'docs' },
    { title: 'Rick Reed — Scaling to Millions of Simultaneous Connections', url: 'https://www.youtube.com/watch?v=c12cYAUTXXs', type: 'video' },
  ],
};
