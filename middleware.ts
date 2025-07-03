import { Redis } from "@upstash/redis";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

const redis = Redis.fromEnv();

async function handleShortlink(request: NextRequest) {
  try {
    const slug = request.nextUrl.pathname.slice(1);

    // get destination URL data, if the slug is a valid shortlink
    const result: string | null = await redis.hget(slug, "destinationUrl");

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

// Main middleware function
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  let authRes = await auth0.middleware(request);

  // Ensure own middleware does not handle the `/auth` routes, auto-mounted and handled by the Auth0 SDK
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  // Allow access to public routes without requiring a session
  if (request.nextUrl.pathname === "/") {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const { pathname } = request.nextUrl;

  // Handle protected routes
  if (pathname.startsWith("/links")) {
    const session = await auth0.getSession(request);

    // If the user does not have a session, redirect to login
    if (!session) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    // If a valid session exists, continue with the response from Auth0 middleware
    return authRes;
  }

  // Skip shortlink handling for system paths
  if (pathname.startsWith("/api/")) {
    return authRes;
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
