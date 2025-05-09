import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text?: string): Promise<void> {
  if (text) return navigator.clipboard.writeText(text);
  throw new Error("No value to copy");
}

export function timeSince(date: Date | number) {
  const seconds = Math.floor(
    (new Date().getTime() - (date instanceof Date ? date.getTime() : date)) /
      1000
  );

  function numberEnding(number: number) {
    return number > 1 ? "s" : "";
  }

  let interval = Math.floor(seconds / 31536000);
  if (interval > 0) {
    return interval + " year" + numberEnding(interval) + " ago";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 0) {
    return interval + " month" + numberEnding(interval) + " ago";
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 0) {
    return interval + " day" + numberEnding(interval) + " ago";
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 0) {
    return interval + " hour" + numberEnding(interval) + " ago";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 0) {
    return interval + " minute" + numberEnding(interval) + " ago";
  }

  return "just now";
}

export function timeSinceFromTimestamp(timestamp?: number | string) {
  return timestamp ? timeSince(new Date(timestamp).getTime()) : "Unknown";
}

/**
 * Converts a TTL expiration in seconds to a human-friendly string.
 * Returns "No expiration" if TTL is -1 or less.
 * Returns "Expired" if TTL is 0.
 * Otherwise returns a string like "5m 30s", "2h 15m", or "3d 4h".
 *
 * @param ttlSeconds time until expiration, in seconds
 * @returns human-friendly TTL string
 */
export function formatTTL(ttlSeconds: number): string {
  if (ttlSeconds <= -1) return 'Never';
  if (ttlSeconds === 0) return 'Expired';

  const days = Math.floor(ttlSeconds / 86400);
  const hours = Math.floor((ttlSeconds % 86400) / 3600);
  const minutes = Math.floor((ttlSeconds % 3600) / 60);
  const seconds = ttlSeconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ');
}
