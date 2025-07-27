import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'lt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

const isProtectedRoute = createRouteMatcher([
  '/cart',
  '/orders',
  '/wishlist'
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  // Handle internationalization first
  const intlResponse = intlMiddleware(req);
  
  if (isProtectedRoute(req)) {
    auth().protect();
  }
  
  return intlResponse;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Match internationalization
    '/(en|lt)/:path*'
  ],
};