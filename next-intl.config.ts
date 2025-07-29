import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const activeLocale = locale || "en"; // ✅ fallback locale

  return {
    locale: activeLocale, // ✅ LOCALE RETURN KARNA ZAROORI HAI
    messages: (await import(`./messages/${activeLocale}.json`)).default
  };
});
