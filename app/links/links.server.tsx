"use server";

import { ShortenedUrl } from "@/types";
import faunadb from "faunadb";
import { LinksTable } from "./links-table";

export async function LinksSection() {
  if (!process.env.FAUNA_GUEST_SECRET) {
    throw new Error("FAUNA_GUEST_SECRET env var not set");
  }

  const q = faunadb.query;
  const guestClient = new faunadb.Client({
    secret: process.env.FAUNA_GUEST_SECRET,
  });

  try {
    const minis = await guestClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Mini"))),
        q.Lambda((x) => q.Get(x))
      )
    );

    if (!minis || !minis?.["data"] || minis?.["data"].length === 0) {
      return <p>No links found</p>;
    }

    const reformattedUrls: ShortenedUrl[] = [];
    minis["data"].reverse().forEach((url) => {
      reformattedUrls.push({
        id: url.ref.toJSON()["@ref"].id,
        originalUrl: url.data.destination,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${url.data.mini}`,
        slug: url.data.mini,
        createdAt: url.data.createdAt.toJSON()["@ts"],
        clicks: 0,
      });
    });

    return <LinksTable links={reformattedUrls} />;
  } catch (error) {
    console.error(error);

    return <p>An error occurred</p>;
  }
}
