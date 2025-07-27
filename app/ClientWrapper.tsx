// app/ClientWrapper.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
