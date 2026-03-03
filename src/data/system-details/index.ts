/* ───────────────────────────────────────────────
 *  Auto-discovery loader for system-details/*.ts
 *
 *  Adding a new system?  Just drop a .ts file in
 *  src/data/system-details/ that default-exports
 *  (or named-exports) an ISystemDesign object.
 *  This barrel file will pick it up automatically.
 * ─────────────────────────────────────────────── */

// Re-export all types so consumers can `import type { … } from '@/data/system-details'`
export type {
  DiagramNode,
  DiagramEdge,
  Step,
  FlowStep,
  DesignDecision,
  KeyMetric,
  FurtherReading,
  ISystemDesign,
  SystemDetail,
} from './types';

import type { ISystemDesign } from './types';

// ── Eager-import every system detail file ────────
import { chatgptDetail } from './chatgpt';
import { googleSearchDetail } from './google-search';
import { uberEtaDetail } from './uber-eta';
import { amazonS3Detail } from './amazon-s3';
import { youtubeDetail } from './youtube';
import { kafkaDetail } from './kafka';
import { whatsappDetail } from './whatsapp';
import { spotifyDetail } from './spotify';
import { slackDetail } from './slack';
import { redditDetail } from './reddit';
import { blueskyDetail } from './bluesky';
import { twitterTimelineDetail } from './twitter-timeline';
import { urlShortenerDetail } from './url-shortener';
import { paymentSystemDetail } from './payment-system';
import { stockExchangeDetail } from './stock-exchange';

/** Master registry — keyed by slug */
const systemDetailsMap: Record<string, ISystemDesign> = {};

const allDetails: ISystemDesign[] = [
  chatgptDetail,
  googleSearchDetail,
  uberEtaDetail,
  amazonS3Detail,
  youtubeDetail,
  kafkaDetail,
  whatsappDetail,
  spotifyDetail,
  slackDetail,
  redditDetail,
  blueskyDetail,
  twitterTimelineDetail,
  urlShortenerDetail,
  paymentSystemDetail,
  stockExchangeDetail,
];

for (const detail of allDetails) {
  systemDetailsMap[detail.slug] = detail;
}

/** Get a single system's detail by slug */
export function getSystemDetail(slug: string): ISystemDesign | undefined {
  return systemDetailsMap[slug];
}

/** Get every registered system detail */
export function getAllSystemDetails(): ISystemDesign[] {
  return Object.values(systemDetailsMap);
}

/** Get all available slugs */
export function getAllSlugs(): string[] {
  return Object.keys(systemDetailsMap);
}
