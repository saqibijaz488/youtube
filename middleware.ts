import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";  // ✅ for multi-language support

// ✅ Language middleware config
const intlMiddleware = createMiddleware({
  locales: ["en", "lt"],        // ✅ English + Lithuanian
  defaultLocale: "en",          // ✅ Default English
  localePrefix: "as-needed",    // ✅ No forced /en in URL unless needed
});

// ✅ Clerk + intl combine
export default clerkMiddleware((auth, req) => {
  // ✅ Run next-intl middleware to handle locales
  return intlMiddleware(req);
});

// ✅ Matchers
export const config = {
  matcher: [
    // ✅ Skip Next.js internals & static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // ✅ Always run for API routes
    "/(api|trpc)(.*)",
    // ✅ Include internationalized routes
    "/(en|lt)/:path*"
  ],
};
