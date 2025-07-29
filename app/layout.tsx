import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultLocale = "en";
  const messages = (await import(`../messages/${defaultLocale}.json`)).default;

  return (
    <html lang={defaultLocale}>
      <body className="font-poppins antialiased">
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
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
      </body>
    </html>
  );
}
