"use server";

import { createFaunaClient } from "@/lib/fauna";
import { ShortenedUrl } from "@/types";
import faunadb from "faunadb";
import { revalidatePath } from "next/cache";

const q = faunadb.query;

export async function createLink(destination: string, customSlug?: string) {
  try {
    const client = createFaunaClient();
    const slug = customSlug || Math.random().toString(36).substring(2, 8);

    const result = await client.query(
      q.Create(q.Collection("Mini"), {
        data: {
          destination,
          mini: slug,
          createdAt: q.Now(),
        },
      })
    );

    // Convert the result to ShortenedUrl format
    const shortenedUrl: ShortenedUrl = {
      id: result["ref"].toJSON()["@ref"].id,
      originalUrl: result["data"].destination,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${result["data"].mini}`,
      slug: result["data"].mini,
      createdAt: result["data"].createdAt.toJSON()["@ts"],
    };

    revalidatePath("/links");

    return { success: true, data: shortenedUrl };
  } catch (error) {
    console.error("Error creating link:", error);
    return { success: false, error: "Failed to create link" };
  }
}
