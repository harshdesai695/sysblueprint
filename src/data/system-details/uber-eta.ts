import { SystemDetail } from './types';

export const uberEtaDetail: SystemDetail = {
  slug: 'uber-eta',
  summary:
    'Uber\'s ETA computation combines real-time GPS traces from millions of drivers, historical travel time data, and road network graph algorithms. The system uses a partitioned road graph, machine learning models trained on billions of completed trips, and real-time traffic signals to produce arrival estimates accurate within minutes.',
  analogy:
    'Imagine predicting how long it takes to walk through a crowded mall. You\'d consider the distance, which corridors are congested right now, how fast you usually walk, and whether there\'s an event causing unusual crowds. Uber does this at city scale, updating predictions every few seconds using live GPS data from every driver.',
  nodes: [
    { id: 'rider-app', label: 'Rider App', position: { x: 0, y: 200 }, description: 'The rider\'s mobile app sends pickup/dropoff locations and requests an ETA. Displays estimated arrival time and updates it in real-time during the trip.', type: 'client', techStack: ['iOS', 'Android', 'gRPC'] },
    { id: 'api-gateway', label: 'API Gateway', position: { x: 200, y: 200 }, description: 'Routes ETA requests to the appropriate microservice based on ride type (UberX, Pool, Eats). Handles authentication and rate limiting.', type: 'gateway', techStack: ['Envoy', 'gRPC'] },
    { id: 'eta-service', label: 'ETA Service', position: { x: 400, y: 200 }, description: 'Core service that orchestrates ETA computation. Fetches the road graph, applies real-time traffic data, runs the routing algorithm, and applies ML corrections. Returns both pickup ETA and trip ETA.', type: 'service', techStack: ['Go', 'Java', 'gRPC'] },
    { id: 'routing-engine', label: 'Routing Engine', position: { x: 600, y: 100 }, description: 'Computes shortest/fastest paths on the road network graph using a modified Contraction Hierarchies algorithm. The graph is partitioned by geographic cells (H3 hexagons) for parallel computation.', type: 'compute', techStack: ['Contraction Hierarchies', 'H3', 'C++'] },
    { id: 'traffic-service', label: 'Real-time Traffic', position: { x: 600, y: 300 }, description: 'Ingests GPS traces from active drivers to compute real-time road segment speeds. Updates edge weights in the road graph every few seconds. Detects incidents, road closures, and unusual congestion.', type: 'service', techStack: ['Kafka', 'Flink', 'GPS Traces'] },
    { id: 'ml-model', label: 'ML Correction Model', position: { x: 800, y: 200 }, description: 'Gradient-boosted tree and deep learning models that adjust raw routing ETAs based on features: time of day, day of week, weather, local events, historical accuracy for the specific route segment. Trained on billions of completed trips.', type: 'compute', techStack: ['XGBoost', 'TensorFlow', 'Feature Store'] },
    { id: 'road-graph', label: 'Road Graph Store', position: { x: 400, y: 400 }, description: 'Stores the road network as a directed weighted graph. Nodes are intersections, edges are road segments with properties: speed limit, number of lanes, turn restrictions, and real-time travel time.', type: 'storage', techStack: ['Custom Graph DB', 'H3 Spatial Index'] },
    { id: 'gps-pipeline', label: 'GPS Data Pipeline', position: { x: 200, y: 400 }, description: 'Collects GPS pings from millions of active drivers at 4-second intervals. Performs map matching (snapping GPS points to road segments) and feeds speed data into the traffic service.', type: 'processing', techStack: ['Kafka', 'Spark', 'Map Matching'] },
    { id: 'historical-store', label: 'Historical Data', position: { x: 800, y: 400 }, description: 'Stores historical travel times for every road segment by time-of-day, day-of-week, and season. Used as a fallback when real-time data is sparse and as training data for ML models.', type: 'storage', techStack: ['Hive', 'HDFS', 'Parquet'] },
  ],
  edges: [
    { id: 'e1', source: 'rider-app', target: 'api-gateway', label: 'ETA Request', edgeType: 'protocol' },
    { id: 'e2', source: 'api-gateway', target: 'eta-service', label: 'Route', edgeType: 'default' },
    { id: 'e3', source: 'eta-service', target: 'routing-engine', label: 'Compute Path', edgeType: 'protocol' },
    { id: 'e4', source: 'eta-service', target: 'traffic-service', label: 'Get Traffic', edgeType: 'data' },
    { id: 'e5', source: 'routing-engine', target: 'road-graph', label: 'Read Graph', edgeType: 'data' },
    { id: 'e6', source: 'traffic-service', target: 'road-graph', label: 'Update Weights', edgeType: 'async', animated: true },
    { id: 'e7', source: 'eta-service', target: 'ml-model', label: 'Raw ETA', edgeType: 'data' },
    { id: 'e8', source: 'ml-model', target: 'eta-service', label: 'Corrected ETA', edgeType: 'data' },
    { id: 'e9', source: 'gps-pipeline', target: 'traffic-service', label: 'Speed Data', edgeType: 'async', animated: true },
    { id: 'e10', source: 'ml-model', target: 'historical-store', label: 'Training Data', edgeType: 'async', animated: true },
    { id: 'e11', source: 'eta-service', target: 'rider-app', label: 'ETA Response', edgeType: 'protocol' },
  ],
  steps: [
    {
      number: 1,
      title: 'Rider Requests an ETA',
      description:
        'When a rider opens the app or enters a destination, an ETA request is sent containing pickup coordinates, dropoff coordinates, and ride type. The request reaches the ETA service via the API gateway.',
      highlightNodes: ['rider-app', 'api-gateway', 'eta-service'],
    },
    {
      number: 2,
      title: 'Road Graph Lookup',
      description:
        'The ETA service identifies which H3 hexagonal cells the route passes through and loads the relevant road graph partitions. The road graph represents intersections as nodes and road segments as weighted edges, where weights are current expected travel times.\n\nH3 spatial indexing divides the Earth\'s surface into hierarchical hexagonal cells, enabling efficient geographic partitioning and neighbor lookups.',
      highlightNodes: ['eta-service', 'road-graph'],
    },
    {
      number: 3,
      title: 'Real-time Traffic Integration',
      description:
        'The traffic service continuously processes GPS pings from active drivers. Map matching algorithms snap noisy GPS coordinates to specific road segments. Aggregated speeds are computed per segment and update the road graph edge weights every few seconds.\n\nFor road segments with no active drivers, the system falls back to historical averages for the current time of day and day of week.',
      highlightNodes: ['gps-pipeline', 'traffic-service', 'road-graph'],
    },
    {
      number: 4,
      title: 'Shortest Path Computation',
      description:
        'The routing engine computes the fastest path using Contraction Hierarchies — a technique that pre-processes the road graph by identifying shortcut edges that bypass intermediate nodes. This reduces query time from seconds to milliseconds.\n\nThe algorithm produces a sequence of road segments with individual travel time estimates, which are summed to produce the raw routing ETA.',
      highlightNodes: ['routing-engine', 'road-graph'],
    },
    {
      number: 5,
      title: 'ML-Based ETA Correction',
      description:
        'The raw routing ETA is adjusted by machine learning models trained on billions of historical trips. Features include: time of day, day of week, weather conditions, local events, pickup/dropoff location type (airport vs residential), historical model accuracy for this route.\n\nGradient-boosted decision trees handle tabular features while deep learning models capture spatial-temporal patterns. The models learn systematic biases — for example, that ETAs near airports tend to be underestimated due to terminal navigation time.',
      highlightNodes: ['ml-model', 'historical-store'],
    },
    {
      number: 6,
      title: 'ETA Delivery and Updates',
      description:
        'The corrected ETA is returned to the rider app. Once a trip begins, the ETA is continuously recomputed as the driver progresses, incorporating the driver\'s actual speed and any route deviations. The app displays an updating countdown.',
      highlightNodes: ['eta-service', 'rider-app'],
    },
  ],
  designDecisions: [
    {
      question: 'Why use Contraction Hierarchies instead of Dijkstra\'s algorithm?',
      answer:
        'Dijkstra\'s algorithm explores nodes in all directions, which is slow on large road networks (millions of nodes). Contraction Hierarchies pre-process the graph to add shortcut edges that represent optimal sub-paths. At query time, a bidirectional search in the hierarchy finds the shortest path in milliseconds instead of seconds — critical when computing millions of ETAs per minute.',
    },
    {
      question: 'Why apply ML correction on top of graph-based routing?',
      answer:
        'Road graph algorithms assume edge weights (travel times) are accurate, but real-world travel time depends on factors not captured in the graph: traffic light timing, construction zones, building lobby navigation at pickup, passenger loading time. ML models learn these systematic corrections from historical trip data, reducing ETA error by 15-25%.',
    },
    {
      question: 'Why use H3 hexagonal cells for spatial partitioning?',
      answer:
        'H3 hexagons provide uniform area and consistent neighbor relationships (each hexagon has exactly 6 neighbors), unlike rectangular geohash cells which have edge/corner adjacency issues. This makes spatial joins, proximity lookups, and graph partitioning more uniform and efficient. H3 also supports hierarchical resolution levels from continent down to city block.',
    },
  ],
  tradeoffs: {
    scalability: 9,
    availability: 9,
    consistency: 5,
    latency: 9,
    durability: 6,
    simplicity: 4,
  },
  furtherReading: [
    { title: 'How Uber Computes ETA — ByteByteGo', url: 'https://lnkd.in/eVKV2ePC', type: 'blog' },
    { title: 'Uber Engineering: ETA with Graph Neural Networks', url: 'https://www.uber.com/blog/deepeta-how-uber-predicts-arrival-times/', type: 'blog' },
    { title: 'H3: Uber\'s Hexagonal Hierarchical Spatial Index', url: 'https://www.uber.com/blog/h3/', type: 'blog' },
    { title: 'Contraction Hierarchies — Algorithm Engineering', url: 'https://algo2.iti.kit.edu/schultes/hwy/contract.pdf', type: 'paper' },
  ],
};
