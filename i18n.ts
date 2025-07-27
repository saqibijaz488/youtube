import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const locales = ['en', 'lt'];

  // ✅ agar galat locale aya to fallback en
  const finalLocale = locales.includes(locale as any) ? locale : 'en';

  return {
    locale: finalLocale,  // ✅ IMPORTANT: locale return karo
    messages: (await import(`./messages/${finalLocale}.json`)).default
  };
});
