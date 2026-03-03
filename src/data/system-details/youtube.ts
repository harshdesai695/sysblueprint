import type { ISystemDesign } from './types';

export const youtubeDetail: ISystemDesign = {
  slug: 'youtube',
  summary:
    'YouTube handles 500+ hours of video uploaded every minute. Each upload is transcoded into dozens of format/resolution/codec combinations, stored across a global CDN, and served adaptively using DASH/HLS. A recommendation engine powered by deep neural networks drives 70% of watch time, while a content moderation pipeline screens uploads for policy violations.',
  analogy:
    'Imagine a TV station that receives 500 hours of footage every minute. Each clip must be translated into dozens of languages and screen sizes, copied to broadcast towers worldwide, and a personal TV guide must be created for each of 2 billion viewers — all while checking every frame for inappropriate content.',
  nodes: [
    { id: 'creator', label: 'Creator Upload', position: { x: 0, y: 200 }, description: 'Content creators upload video files via web or mobile. Large files use resumable uploads that can be paused and continued. Metadata (title, description, tags) is submitted alongside the video.', type: 'client', techStack: ['Resumable Upload', 'HTTP/2'] },
    { id: 'upload-service', label: 'Upload Service', position: { x: 200, y: 100 }, description: 'Receives raw video files, validates format and size, extracts metadata, and stores the original file in a raw video store. Triggers the transcoding pipeline.', type: 'service', techStack: ['Go', 'GCS', 'Pub/Sub'] },
    { id: 'transcoder', label: 'Transcoding Pipeline', position: { x: 400, y: 100 }, description: 'Converts the uploaded video into multiple resolutions (144p to 4K), codecs (H.264, VP9, AV1), and container formats. AV1 provides 30% better compression than VP9 but is more expensive to encode. Uses Borg-managed worker pools.', type: 'compute', techStack: ['FFmpeg', 'VP9', 'AV1', 'H.264', 'Borg'] },
    { id: 'blob-store', label: 'Blob Storage', position: { x: 650, y: 100 }, description: 'Stores all transcoded video segments. Videos are split into small segments (2-10 seconds each) for adaptive bitrate streaming. Stored in Google\'s Colossus distributed filesystem.', type: 'storage', techStack: ['Colossus', 'GCS'] },
    { id: 'cdn', label: 'Global CDN', position: { x: 850, y: 200 }, description: 'Google\'s private CDN with edge nodes in 100+ countries. Popular videos are cached at edges close to viewers. Less popular (long-tail) content is served from regional caches or origin servers.', type: 'infrastructure', techStack: ['Google Edge Network', 'Cache Tiers'] },
    { id: 'viewer', label: 'Viewer App', position: { x: 850, y: 400 }, description: 'Browser or mobile app that plays video using adaptive bitrate streaming. The player continuously monitors bandwidth and switches between quality levels mid-stream for uninterrupted playback.', type: 'client', techStack: ['DASH', 'HLS', 'ABR Player'] },
    { id: 'metadata-db', label: 'Video Metadata DB', position: { x: 400, y: 300 }, description: 'Stores video metadata: title, description, view counts, likes, comments, channel info, and content classification. Vitess (sharded MySQL) handles the enormous write throughput.', type: 'storage', techStack: ['Vitess', 'Spanner', 'Bigtable'] },
    { id: 'recommendation', label: 'Recommendation Engine', position: { x: 600, y: 400 }, description: 'Deep neural network (two-tower model) that generates personalized video suggestions. Candidate generation retrieves thousands of videos, then a ranking model scores them by predicted watch time, engagement, and satisfaction.', type: 'compute', techStack: ['TensorFlow', 'Two-Tower Model', 'Deep Ranking'] },
    { id: 'moderation', label: 'Content Moderation', position: { x: 200, y: 350 }, description: 'ML classifiers scan uploaded videos for policy violations: violence, nudity, copyright (Content ID), and misinformation. Flagged content goes to human review. Content ID matches audio/video fingerprints against a rights-holder database.', type: 'processing', techStack: ['Content ID', 'ML Classifiers', 'Human Review'] },
    { id: 'search-index', label: 'Search Index', position: { x: 400, y: 500 }, description: 'Inverted index of video metadata, captions, and auto-generated transcripts. Enables search by title, description, spoken words, and visual content detected by computer vision.', type: 'storage', techStack: ['Inverted Index', 'Speech-to-Text', 'Vision API'] },
  ],
  edges: [
    { id: 'e1', source: 'creator', target: 'upload-service', label: 'Upload Video', edgeType: 'protocol' },
    { id: 'e2', source: 'upload-service', target: 'transcoder', label: 'Trigger Encode', edgeType: 'async', animated: true },
    { id: 'e3', source: 'upload-service', target: 'moderation', label: 'Scan Content', edgeType: 'async', animated: true },
    { id: 'e4', source: 'transcoder', target: 'blob-store', label: 'Store Segments', edgeType: 'data' },
    { id: 'e5', source: 'blob-store', target: 'cdn', label: 'Distribute', edgeType: 'async', animated: true },
    { id: 'e6', source: 'cdn', target: 'viewer', label: 'Stream Video', edgeType: 'protocol' },
    { id: 'e7', source: 'upload-service', target: 'metadata-db', label: 'Save Metadata', edgeType: 'data' },
    { id: 'e8', source: 'recommendation', target: 'viewer', label: 'Suggested Videos', edgeType: 'data' },
    { id: 'e9', source: 'metadata-db', target: 'recommendation', label: 'Video Features', edgeType: 'data' },
    { id: 'e10', source: 'metadata-db', target: 'search-index', label: 'Index Updates', edgeType: 'async', animated: true },
    { id: 'e11', source: 'moderation', target: 'metadata-db', label: 'Review Status', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Video Upload',
      description:
        'A creator uploads a video file using resumable upload protocol. The upload service validates the file, extracts basic metadata, and stores the raw video in blob storage. A unique video ID is generated and metadata is written to the database.\n\nResumable uploads allow large files (up to 256GB) to be uploaded in chunks, with the ability to resume if the connection drops. This is critical for creators uploading from mobile networks.',
      highlightNodes: ['creator', 'upload-service'],
    },
    {
      number: 2,
      title: 'Transcoding Pipeline',
      description:
        'The raw video triggers a transcoding job. The video is split into segments and each segment is encoded into multiple format/resolution combinations in parallel across a Borg-managed worker pool.\n\nModern codecs like VP9 and AV1 provide significantly better compression than H.264 (30-50% smaller files at the same quality), reducing CDN bandwidth costs. However, AV1 encoding is 10-100x slower, so YouTube uses it selectively for popular videos where the bandwidth savings justify the encoding cost.',
      highlightNodes: ['transcoder', 'blob-store'],
    },
    {
      number: 3,
      title: 'Content Moderation',
      description:
        'Concurrently with transcoding, ML classifiers analyze the video for policy violations. Content ID matches video and audio fingerprints against a database of copyrighted material provided by rights holders.\n\nThe moderation pipeline processes visual frames, audio tracks, speech-to-text transcripts, and metadata. A confidence threshold determines whether content is auto-removed, restricted, demonetized, or escalated to human review.',
      highlightNodes: ['moderation', 'metadata-db'],
    },
    {
      number: 4,
      title: 'CDN Distribution',
      description:
        'Transcoded video segments are distributed to Google\'s edge network. Hot content (trending/popular videos) is proactively pushed to edge caches worldwide. Long-tail content is fetched on-demand and cached with shorter TTLs.\n\nThe CDN uses tiered caching: edge cache → regional cache → origin storage. This reduces origin load and ensures most viewers are served from a nearby edge node.',
      highlightNodes: ['blob-store', 'cdn'],
    },
    {
      number: 5,
      title: 'Adaptive Bitrate Streaming',
      description:
        'When a viewer plays a video, the player requests a manifest file (DASH MPD or HLS playlist) listing all available quality levels. The player starts with a conservative quality and uses bandwidth estimation to switch up or down.\n\nVideo is fetched in small segments (2-10 seconds). If bandwidth drops mid-segment, the next segment is requested at a lower quality. This produces smooth playback even on fluctuating mobile connections.',
      highlightNodes: ['cdn', 'viewer'],
    },
    {
      number: 6,
      title: 'Recommendation Engine',
      description:
        'The recommendation engine uses a two-stage deep learning approach. The candidate generation model retrieves thousands of potentially relevant videos from the corpus using user history embeddings. The ranking model then scores each candidate by predicted watch time, engagement probability, and user satisfaction.\n\nRecommendations drive approximately 70% of total watch time on YouTube, making the recommendation engine one of the most impactful systems in the architecture.',
      highlightNodes: ['recommendation', 'metadata-db', 'viewer'],
    },
  ],
  designDecisions: [
    {
      question: 'Why transcode into so many formats instead of just one?',
      answer:
        'Viewers watch on devices ranging from feature phones on 2G networks to 8K TVs on fiber connections. A single format would either waste bandwidth (sending 4K to a phone) or provide poor quality (sending 360p to a TV). Multiple formats enable adaptive bitrate streaming, where the player selects the optimal quality based on device capability and network conditions.',
    },
    {
      question: 'Why use segmented streaming (DASH/HLS) instead of progressive download?',
      answer:
        'Progressive download downloads the entire video file sequentially. If the viewer skips ahead, they must wait for the download to catch up. Segmented streaming (DASH/HLS) splits the video into small chunks that can be fetched independently, enabling instant seeking, quality switching mid-stream, and efficient CDN caching of individual segments.',
    },
    {
      question: 'Why does the recommendation engine use a two-stage model?',
      answer:
        'YouTube\'s video corpus contains billions of videos. Running a complex ranking model on every video for every user would be computationally infeasible. The candidate generation stage uses cheaper embeddings to narrow down to thousands of candidates, then the expensive ranking model with hundreds of features scores only this small set — balancing quality with computational cost.',
    },
  ],
  plainSummary:
    'YouTube is like a massive TV station that anyone can broadcast on. When you upload a video, it gets converted into dozens of formats and sizes, stored across data centers worldwide, and delivered to viewers through the nearest server — all so your video plays smoothly no matter where you are or what device you\'re using.',

  flowSteps: [
    { emoji: '🎬', title: 'Creator uploads a video', description: 'A video file is uploaded through the app, website, or API.' },
    { emoji: '🔄', title: 'Video is transcoded', description: 'The raw video is converted into multiple resolutions (144p to 4K) and formats for different devices.' },
    { emoji: '✂️', title: 'Video is chunked', description: 'Each version is split into small segments so streaming can start immediately and adapt to your connection speed.' },
    { emoji: '🌍', title: 'Copies spread worldwide', description: 'Video segments are cached at edge servers around the globe — closer to viewers for faster loading.' },
    { emoji: '📺', title: 'You press play', description: 'When you watch, the video player requests segments from the nearest server and adjusts quality based on your bandwidth.' },
    { emoji: '🤖', title: 'AI recommends more', description: 'A recommendation engine analyzes your watch history and suggests what to watch next.' },
  ],

  keyMetrics: [
    { label: 'Hours Uploaded', value: '500/min', icon: '🎬', description: 'Hours of video uploaded per minute' },
    { label: 'Daily Views', value: '5B+', icon: '👀', description: 'Videos watched per day worldwide' },
    { label: 'CDN Capacity', value: '1 PB/s', icon: '🌍', description: 'Global content delivery bandwidth' },
    { label: 'Storage', value: 'Exabytes', icon: '💾', description: 'Total video storage across Google infra' },
  ],

  furtherReading: [
    { title: 'How YouTube Works — ByteByteGo', url: 'https://lnkd.in/e7q9F4Sg', type: 'blog' },
    { title: 'Deep Neural Networks for YouTube Recommendations', url: 'https://research.google/pubs/pub45530/', type: 'paper' },
    { title: 'YouTube Architecture (High Scalability)', url: 'http://highscalability.com/youtube-architecture', type: 'blog' },
    { title: 'AV1 Codec Overview — Alliance for Open Media', url: 'https://aomedia.org/av1/', type: 'docs' },
  ],
};
