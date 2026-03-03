import type { ISystemDesign } from './types';

export const spotifyDetail: ISystemDesign = {
  slug: 'spotify',
  summary:
    'Spotify streams 100+ million tracks to 600+ million users by combining audio delivery via CDN with a sophisticated recommendation ecosystem. Audio files are stored in multiple quality tiers (Ogg Vorbis, AAC, FLAC), cached at edge nodes, and streamed with gapless playback. Discover Weekly and personalized playlists are powered by collaborative filtering, NLP on lyrics/reviews, and audio feature analysis.',
  analogy:
    'Imagine a massive jukebox that knows every song ever recorded. When you press play, it instantly finds the song from the nearest warehouse (CDN edge), pipes it to your headphones in the best quality your connection allows, and meanwhile a team of DJs (recommendation engine) is preparing your next personalized playlist based on what you and millions of similar listeners enjoy.',
  nodes: [
    { id: 'client-app', label: 'Spotify Client', position: { x: 0, y: 200 }, description: 'Mobile, desktop, or web player that handles audio decoding, gapless playback, offline caching, and crossfade transitions. Prefetches the next track to eliminate gaps between songs.', type: 'client', techStack: ['iOS', 'Android', 'Electron', 'Web Player'] },
    { id: 'api-gateway', label: 'API Gateway', position: { x: 200, y: 200 }, description: 'Routes requests to microservices. Handles authentication via OAuth 2.0, rate limiting, and feature flags. Spotify runs 2000+ microservices behind this gateway.', type: 'gateway', techStack: ['Envoy', 'OAuth 2.0', 'Feature Flags'] },
    { id: 'playback-service', label: 'Playback Service', position: { x: 400, y: 100 }, description: 'Resolves track IDs to audio file locations, selects the appropriate quality tier based on user subscription and network conditions, and returns CDN URLs with access tokens.', type: 'service', techStack: ['Java', 'gRPC'] },
    { id: 'audio-cdn', label: 'Audio CDN', position: { x: 600, y: 100 }, description: 'Distributed CDN storing audio files in multiple quality levels. Popular tracks are cached at edge nodes globally. Audio is delivered in small chunks for instant playback start.', type: 'infrastructure', techStack: ['Google Cloud CDN', 'Edge Cache', 'Fastly'] },
    { id: 'audio-storage', label: 'Audio Storage', position: { x: 800, y: 100 }, description: 'Origin storage for all audio files in multiple codecs and bitrates: Ogg Vorbis (96-320kbps), AAC (128-256kbps), and FLAC (lossless for Premium). Each track is stored in 5-8 different encodings.', type: 'storage', techStack: ['GCS', 'Ogg Vorbis', 'AAC', 'FLAC'] },
    { id: 'recommendation', label: 'Recommendation Engine', position: { x: 400, y: 350 }, description: 'Combines three approaches: collaborative filtering (users who liked X also liked Y), content-based analysis (audio features like tempo, energy, danceability), and NLP on lyrics, reviews, and blog posts. Powers Discover Weekly, Release Radar, and Daily Mix.', type: 'compute', techStack: ['TensorFlow', 'Collaborative Filtering', 'NLP'] },
    { id: 'user-taste', label: 'User Taste Profile', position: { x: 200, y: 450 }, description: 'Stores each user\'s listening history, skip patterns, saved tracks, and derived taste vectors. Updated in near-real-time as the user listens. Used as input features for recommendation models.', type: 'storage', techStack: ['Bigtable', 'Cloud Datastore', 'Feature Store'] },
    { id: 'search-service', label: 'Search Service', position: { x: 600, y: 300 }, description: 'Full-text search across tracks, artists, albums, playlists, and podcasts. Uses Elasticsearch with custom ranking that considers popularity, recency, and user listening history.', type: 'service', techStack: ['Elasticsearch', 'Custom Ranking'] },
    { id: 'social-graph', label: 'Social & Playlist DB', position: { x: 600, y: 500 }, description: 'Stores user-created playlists, collaborative playlists, follower graphs, and sharing activity. PostgreSQL with Cassandra for high-write workloads like play counts.', type: 'storage', techStack: ['PostgreSQL', 'Cassandra'] },
    { id: 'data-pipeline', label: 'Data Pipeline', position: { x: 800, y: 350 }, description: 'Processes billions of listening events daily for analytics, royalty calculation, recommendation model training, and personalization. Uses Google Cloud Dataflow and Pub/Sub for stream processing.', type: 'processing', techStack: ['Dataflow', 'Pub/Sub', 'BigQuery'] },
  ],
  edges: [
    { id: 'e1', source: 'client-app', target: 'api-gateway', label: 'Play Request', edgeType: 'protocol' },
    { id: 'e2', source: 'api-gateway', target: 'playback-service', label: 'Resolve Track', edgeType: 'default' },
    { id: 'e3', source: 'playback-service', target: 'audio-cdn', label: 'CDN URL', edgeType: 'protocol' },
    { id: 'e4', source: 'audio-cdn', target: 'client-app', label: 'Stream Audio', edgeType: 'protocol' },
    { id: 'e5', source: 'audio-cdn', target: 'audio-storage', label: 'Cache Miss', edgeType: 'data' },
    { id: 'e6', source: 'recommendation', target: 'client-app', label: 'Personalized Picks', edgeType: 'data' },
    { id: 'e7', source: 'user-taste', target: 'recommendation', label: 'Taste Vectors', edgeType: 'data' },
    { id: 'e8', source: 'client-app', target: 'data-pipeline', label: 'Listening Events', edgeType: 'async', animated: true },
    { id: 'e9', source: 'data-pipeline', target: 'user-taste', label: 'Update Profiles', edgeType: 'async', animated: true },
    { id: 'e10', source: 'api-gateway', target: 'search-service', label: 'Search Query', edgeType: 'default' },
    { id: 'e11', source: 'social-graph', target: 'recommendation', label: 'Social Signals', edgeType: 'data' },
  ],
  steps: [
    {
      number: 1,
      title: 'Track Playback Request',
      description:
        'The user taps play on a track. The client sends the track ID to the playback service, which resolves it to an audio file reference. The service selects the appropriate encoding based on the user\'s subscription tier (Free: 128kbps, Premium: 320kbps or FLAC) and current network quality.',
      highlightNodes: ['client-app', 'api-gateway', 'playback-service'],
    },
    {
      number: 2,
      title: 'Audio Delivery via CDN',
      description:
        'The playback service returns a signed CDN URL. The client begins streaming audio from the nearest edge node. Audio is delivered in small chunks so playback starts within milliseconds, even before the full track is downloaded.\n\nPopular tracks have extremely high cache hit rates at edge nodes (95%+). Long-tail tracks may require a cache miss to the origin storage, adding slight latency on the first request.',
      highlightNodes: ['audio-cdn', 'audio-storage', 'client-app'],
    },
    {
      number: 3,
      title: 'Gapless Playback and Prefetch',
      description:
        'While the current track plays, the client prefetches the next track in the queue. This enables gapless playback — critical for albums where tracks flow into each other (live albums, concept albums). The crossfade feature blends the audio of consecutive tracks.\n\nFor offline mode, tracks are downloaded, encrypted with a device-specific key, and stored locally. The encryption ensures offline tracks can\'t be extracted.',
      highlightNodes: ['client-app'],
    },
    {
      number: 4,
      title: 'Listening Event Collection',
      description:
        'Every play, skip, pause, and seek action is logged as a listening event and streamed to the data pipeline. Events include track ID, listen duration, skip position, device type, and context (playlist, album, radio).\n\nThese events feed multiple systems: royalty calculations for artists, user taste profile updates, recommendation model training, and analytics dashboards.',
      highlightNodes: ['client-app', 'data-pipeline'],
    },
    {
      number: 5,
      title: 'Taste Profile Construction',
      description:
        'The data pipeline continuously updates each user\'s taste profile — a set of dense vectors representing their musical preferences across dimensions like genre, tempo, mood, and era. Skip patterns are as important as plays: quickly skipping a track is a strong negative signal.\n\nTaste profiles are used as input features for all personalization: home page layout, recommended playlists, and ad targeting for free-tier users.',
      highlightNodes: ['data-pipeline', 'user-taste'],
    },
    {
      number: 6,
      title: 'Recommendation Generation',
      description:
        'Discover Weekly and similar features combine multiple recommendation signals. Collaborative filtering finds users with similar taste profiles and recommends tracks those users enjoyed. Content-based models analyze raw audio features (spectral analysis for tempo, energy, acousticness). NLP models process song lyrics, artist bios, and music blog text.\n\nThe final recommendations blend these signals, prioritizing novelty (tracks the user hasn\'t heard) and diversity (variety across genres and moods).',
      highlightNodes: ['recommendation', 'user-taste', 'social-graph'],
    },
  ],
  designDecisions: [
    {
      question: 'Why store audio in multiple codecs and bitrates?',
      answer:
        'Different devices and network conditions require different formats. Mobile on cellular benefits from lower bitrate (128kbps Ogg Vorbis), while audiophiles on WiFi want lossless FLAC. Storing pre-encoded versions avoids real-time transcoding, which would add latency and compute cost. The storage overhead (~6x per track) is justified by serving millions of concurrent streams efficiently.',
    },
    {
      question: 'Why combine collaborative filtering with content-based analysis?',
      answer:
        'Collaborative filtering excels for popular tracks with rich listening data but fails for new releases (cold start problem). Content-based audio analysis can recommend new tracks based on acoustic similarity to known preferences. NLP captures cultural context that audio analysis misses (genre associations, mood descriptions). Combining all three provides robust recommendations across the full catalog.',
    },
    {
      question: 'Why use event streaming for listening data instead of batch processing?',
      answer:
        'Real-time event streaming enables near-instant taste profile updates. If a user starts exploring jazz for the first time, their recommendations can shift within minutes rather than waiting for a nightly batch job. This responsiveness is critical for engagement — the system adapts to the user\'s current mood and context.',
    },
  ],
  plainSummary:
    'Spotify is like a jukebox that knows every song ever made and learns your taste. When you press play, it fetches the song from the nearest server, streams it in tiny pieces, and starts playing before the whole file arrives. Meanwhile, AI studies your listening habits to suggest music you\'ll love.',

  flowSteps: [
    { emoji: '🔍', title: 'You search for a song', description: 'You type a song name or browse playlists in the Spotify app.' },
    { emoji: '▶️', title: 'You press play', description: 'The app tells Spotify\'s server which track you want to hear.' },
    { emoji: '🌐', title: 'Nearest server responds', description: 'A CDN (content delivery network) server close to you starts sending the audio file.' },
    { emoji: '🎵', title: 'Music streams in chunks', description: 'The song is sent in small pieces. Playback starts after the first few chunks arrive — no waiting for the full download.' },
    { emoji: '📊', title: 'Your listen is recorded', description: 'Spotify logs what you\'re listening to for artist royalties and recommendation training.' },
    { emoji: '🤖', title: 'AI learns your taste', description: 'Machine-learning models analyze your history, combine it with millions of other users\' data, and build personalized playlists.' },
  ],

  keyMetrics: [
    { label: 'Monthly Users', value: '675M+', icon: '👥', description: 'Monthly active users worldwide' },
    { label: 'Tracks', value: '100M+', icon: '🎵', description: 'Songs available in the catalog' },
    { label: 'Audio Quality', value: '320kbps', icon: '🔊', description: 'Max Ogg Vorbis streaming rate' },
    { label: 'Daily Streams', value: '1.5B+', icon: '▶️', description: 'Songs streamed per day' },
  ],

  furtherReading: [
    { title: 'How Spotify Works — ByteByteGo', url: 'https://lnkd.in/eGbWVeNW', type: 'blog' },
    { title: 'Spotify Engineering Blog', url: 'https://engineering.atspotify.com/', type: 'blog' },
    { title: 'How Spotify Recommends Music (System Design)', url: 'https://www.youtube.com/watch?v=v4s2_KZLWII', type: 'video' },
    { title: 'Spotify Audio Features API', url: 'https://developer.spotify.com/documentation/web-api/reference/get-audio-features', type: 'docs' },
  ],
};
