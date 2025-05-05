"use server";

import { ShortlinkData } from "@/types";
import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

const redis = Redis.fromEnv();

/**
 * Creates a new shortlink and returns the result.
 *
 * @param destination the URL to shorten
 * @param customSlug the desired slug
 * @param expiration the expire time, in seconds (default = 3600). Pass `-1` to prevent expiration.
 * @returns {Promise<{ success: true; data: string }>} an object containing
 *          a success flag and the newly created shortlink data.
 */
export async function createLink(
  destinationUrl: string,
  customSlug?: string,
  expiration: number = 3600 // one hour
) {
  try {
    const slug = customSlug || Math.random().toString(36).substring(2, 8);

    const exists = await redis.exists(slug);
    if (!exists) {
      const p = redis.multi();
      p.hset(slug, {
        destinationUrl,
        createdAt: new Date().toISOString(),
        visits: 0,
      });

      if (expiration !== -1) {
        p.expire(slug, expiration);
      }

      await p.exec();

      const newShortlink: ShortlinkData = {
        key: slug,
        destinationUrl,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        createdAt: Date().toString(),
        ttl: expiration,
      };

      revalidatePath("/links");

      return { success: true, data: newShortlink };
    }

    console.error("Error creating link: key already exists");
    return {
      success: false,
      error: "Failed to create link (key already exists)",
    };
  } catch (error) {
    console.error("Error creating link:", error);
    return { success: false, error: "Failed to create link" };
  }
}
