import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "lt"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

const isProtectedRoute = createRouteMatcher([
  "/cart",
  "/orders",
  "/wishlist"
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  // ✅ i18n middleware call karo
  const intlResponse = intlMiddleware(req);

  // ✅ Latest Clerk syntax me protect() hatao aur instead auth().userId check karo
  const { userId } = auth();

  if (isProtectedRoute(req) && !userId) {
    // ✅ Agar user logged in nahi hai to Clerk login page pe redirect karo
    return Response.redirect(new URL("/sign-in", req.url));
  }

  return intlResponse;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/(en|lt)/:path*'
  ],
};
