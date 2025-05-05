"use server";

import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

const redis = Redis.fromEnv();

export async function deleteShortlink(key: string) {
  try {
    const result = await redis.del(key);

    if (result === 1) {
      revalidatePath("/links");
      return { success: true };
    }

    console.error("Failed to delete shortlink");
    return { success: false, error: "Failed to delete shortlink" };
  } catch (error) {
    console.error("Failed to delete shortlink:", error);
    return { success: false, error: "Failed to delete shortlink" };
  }
}
