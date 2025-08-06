'use client';

import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import enMessages from '../../messages/en.json';
import ltMessages from '../../messages/lt.json';
import { use } from 'react';

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any;
}) {
  // Properly unwrap params using React.use()
  const unwrappedParams = 'then' in params ? use(params) : params;
  const locale = unwrappedParams.locale || "en";
  
  // Use pre-imported messages
  const messages = locale === 'lt' ? ltMessages : enMessages;

  return (
    // ✅ ❌ HTML aur BODY yahan nahi honge
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#fff",
          },
        }}
      />
    </NextIntlClientProvider>
  );
}
