"use server";

import { ShortlinkData } from "@/types";
import { Redis } from "@upstash/redis";
import { LinksTable } from "./links-table";

const redis = Redis.fromEnv();

export async function LinksSection() {
  try {
    const keys = await redis.keys("*");

    if (keys.length === 0) {
      return <p>No links found</p>;
    }

    const p = redis.multi();
    keys.forEach((key) => {
      p.hgetall(key);
      p.ttl(key);
    });
    const results = await p.exec();

    // results is an array of hash objects corresponding to each key
    let shortlinks: ShortlinkData[] = [];
    for (let i = 0; i < keys.length; i++) {
      const hash = results[i * 2] as Record<string, string>;
      const ttl = results[i * 2 + 1] as number;
      shortlinks.push({
        key: keys[i],
        ...hash,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${keys[i]}`,
        ttl,
      });
    }

    shortlinks = shortlinks.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // newest first
    });

    return <LinksTable links={shortlinks} />;
  } catch (error) {
    console.error(error);
    return <p>An error occurred</p>;
  }
}
