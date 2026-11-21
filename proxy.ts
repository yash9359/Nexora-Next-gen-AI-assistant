import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sso-callback(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is already authenticated and visits sign-in, redirect them to home
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect all non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};