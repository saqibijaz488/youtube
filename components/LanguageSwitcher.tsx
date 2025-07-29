"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/lt") ? "lt" : "en";

  const switchLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    let newPath;
    if (pathname.startsWith("/en") || pathname.startsWith("/lt")) {
      newPath = pathname.replace(/^\/(en|lt)/, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }
    router.push(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={switchLanguage}
      className={`w-20 h-8 rounded-md  bg-[#3b9c3c] text-white text-sm font-semibold px-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    >
      <option value="en" className="text-black">EN</option>
      <option value="lt" className="text-black">LT</option>
    </select>
  );
};

export default LanguageSwitcher;
