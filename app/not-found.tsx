import Logo from "@/components/Logo";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  const t = useTranslations('errors');
  
  return (
    <div className="bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo />

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('lookingForSomething')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('pageNotFoundDescription')}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-vilnius-primary/80 hover:bg-vilnius-primary focus:outline-none focus:ring-2 focus:ring-offset-2 hoverEffect"
            >
              {t('goToHomepage')}
            </Link>
            <Link
              href="/help"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-md text-vilnius-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {t('help')}
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('needHelp')}{" "}
            <Link
              href="/help"
              className="font-medium text-vilnius-primary hover:text-vilnius-primary/80"
            >
              {t('help')}
            </Link>{" "}
            {t('or')}{" "}
            <Link
              href="/contact"
              className="font-medium text-vilnius-primary hover:text-vilnius-primary/80"
            >
              {t('contactUs')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
