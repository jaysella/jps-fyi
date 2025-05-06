"use server";

import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

const redis = Redis.fromEnv();

export async function updateShortlink(
  oldKey: string,
  args?: { newKey?: string; newDestinationUrl?: string }
) {
  try {
    if (args?.newKey && oldKey !== args?.newKey) {
      const renamed = await redis.renamenx(oldKey, args?.newKey);
      if (!renamed) {
        throw new Error(
          `Rename failed: either "${oldKey}" does not exist or "${args?.newKey}" already exists`
        );
      }
    }

    if (args?.newDestinationUrl) {
      await redis.hset(args?.newKey ?? oldKey, {
        destinationUrl: args?.newDestinationUrl,
      } as Record<string, string>);
    }

    revalidatePath("/links");
    return { success: true };
  } catch (error) {
    console.error("Failed to update URL:", error);
    return { success: false, error: "Failed to update URL" };
  }
}
