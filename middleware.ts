import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { Redis } from "@upstash/redis";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

async function handleShortlink(request: NextRequest) {
  try {
    const slug = request.nextUrl.pathname.slice(1);

    // get destination URL data, if the slug is a valid shortlink
    const result: string | null = await redis.hget(slug, "destinationUrl");
    console.log("🚀 ~ handleShortlink ~ result:", result);

    if (!result) throw new Error("Key not found or destinationUrl not set");

    // increment visit counter
    await redis.hincrby(slug, "visits", 1);

    return NextResponse.redirect(new URL(result), {
      status: 302,
    });
  } catch (error) {
    console.error("Error fetching shortlink:", error?.message);
    return NextResponse.next();
  }
}

// Protected routes middleware
export const protectedMiddleware = withMiddlewareAuthRequired(
  async function middleware(req: NextRequest, event: NextFetchEvent) {
    return NextResponse.next();
  }
);

// Main middleware function
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Handle protected routes first
  if (pathname.startsWith("/links")) {
    return protectedMiddleware(request, event);
  }

  // Skip shortlink handling for system paths
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  // Handle shortlink redirects for all other paths
  return handleShortlink(request);
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    // Match paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
