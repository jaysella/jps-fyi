import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import faunadb from "faunadb";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createFaunaClient } from './lib/fauna';

const q = faunadb.query;

// Define paths that don't need shortlink handling
const publicPaths = new Set([
  '/',
  '/links'
]);

// Handle shortlink redirects
async function handleShortlink(request: NextRequest) {
  try {
    const client = createFaunaClient()
    const slug = request.nextUrl.pathname.slice(1);

    const result = await client.query<{
      data: { destination: string };
    }>(
      q.Let(
        {
          match: q.Match(q.Index("mini_by_mini"), slug),
        },
        q.If(
          q.Exists(q.Var("match")),
          q.Get(q.Var("match")),
          q.Abort("Mini not found")
        )
      )
    );

    return NextResponse.redirect(new URL(result.data.destination), { status: 302 });
  } catch (error) {
    console.error("Error fetching mini:", error);
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
  if (pathname.startsWith('/links')) {
    return protectedMiddleware(request, event);
  }

  // Skip shortlink handling for system paths
  if (
    publicPaths.has(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/')
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
