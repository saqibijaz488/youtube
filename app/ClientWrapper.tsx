// app/ClientWrapper.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: "#4CAF50" },
        elements: {
          formButtonPrimary: "bg-shop_btn_dark_green hover:bg-shop_dark_green",
          card: "shadow-none",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
