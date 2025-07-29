"use client";
import { usePathname, useRouter } from "next/navigation";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Check current locale from URL
  const currentLocale = pathname.startsWith("/lt") ? "lt" : "en";

  // ✅ Function to switch between English & Lithuanian
  const switchLanguage = () => {
    const newLocale = currentLocale === "en" ? "lt" : "en";

    // ✅ Replace current locale in URL
    let newPath;
    if (pathname.startsWith("/en") || pathname.startsWith("/lt")) {
      newPath = pathname.replace(/^\/(en|lt)/, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded-md transition"
    >
      {currentLocale === "en" ? "🇬🇧 EN" : "🇱🇹 LT"}
    </button>
  );
};

export default LanguageSwitcher;
