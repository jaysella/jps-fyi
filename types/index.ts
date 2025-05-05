export type ShortlinkData = {
  key: string;
  url?: string;
  destinationUrl?: string;
  visits?: number;
  createdAt?: string;
  ttl: number; // TTL in seconds, -1 means no expiration
};
