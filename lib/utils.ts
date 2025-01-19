import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeSince(date: Date | number) {
  const seconds = Math.floor((new Date().getTime() - (date instanceof Date ? date.getTime() : date)) / 1000);

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

export function timeSinceFromTimestamp(timestamp: number | string) {
  return timeSince(new Date(timestamp).getTime());
}
