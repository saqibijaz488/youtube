import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWrapper from "../ClientWrapper";

export const metadata: Metadata = {
  title: {
    template: "%s - Vilnius online store",
    default: "Vilnius online store",
  },
  description: "Vilnius online store, Your premium shopping destination in Lithuania",
};

export default async function ClientLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  
  return (
    <NextIntlClientProvider messages={messages}>
      <ClientWrapper>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ClientWrapper>
    </NextIntlClientProvider>
  );
}
