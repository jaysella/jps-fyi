"use server";

import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

const redis = Redis.fromEnv();

export async function updateShortlink(
  oldKey: string,
  args?: { newKey?: string; newDestinationUrl?: string; newTTL?: number }
) {
  try {
    const key = args?.newKey ?? oldKey;

    const p = redis.multi();

    if (args?.newKey && oldKey !== args?.newKey) {
      const renamed = p.renamenx(oldKey, args?.newKey.trim().toLowerCase());
      if (!renamed) {
        throw new Error(
          `Rename failed: either "${oldKey}" does not exist or "${args?.newKey}" already exists`
        );
      }
    }

    if (args?.newDestinationUrl) {
      p.hset(key, {
        destinationUrl: args?.newDestinationUrl.trim(),
      } as Record<string, string>);
    }

    if (typeof args?.newTTL !== "undefined") {
      if (args.newTTL === -1) {
        p.persist(key);
      } else {
        p.expire(key, args.newTTL);
      }
    }

    // Execute transaction with all edits
    await p.exec();

    revalidatePath("/links");
    return { success: true };
  } catch (error) {
    console.error("Failed to update URL:", error);
    return { success: false, error: "Failed to update URL" };
  }
}
