export type {
  DiagramNode,
  DiagramEdge,
  Step,
  DesignDecision,
  TradeOff,
  FurtherReading,
  SystemDetail,
} from './types';

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
import { SystemDetail } from './types';

const systemDetailsMap: Record<string, SystemDetail> = {
  chatgpt: chatgptDetail,
  'google-search': googleSearchDetail,
  'uber-eta': uberEtaDetail,
  'amazon-s3': amazonS3Detail,
  youtube: youtubeDetail,
  kafka: kafkaDetail,
  whatsapp: whatsappDetail,
  spotify: spotifyDetail,
  slack: slackDetail,
  reddit: redditDetail,
  bluesky: blueskyDetail,
  'twitter-timeline': twitterTimelineDetail,
  'url-shortener': urlShortenerDetail,
  'payment-system': paymentSystemDetail,
  'stock-exchange': stockExchangeDetail,
};

export function getSystemDetail(slug: string): SystemDetail | undefined {
  return systemDetailsMap[slug];
}
