import { NextResponse } from 'next/server';

/**
 * Route protection runs client-side for now: /account, /checkout and /order
 * show a sign-in prompt when there is no session (see SETUP.md).
 *
 * To enforce protection at the edge instead, swap this for Clerk's
 * clerkMiddleware (see https://clerk.com/docs/quickstarts/nextjs) once the
 * Clerk keys are configured.
 */
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
