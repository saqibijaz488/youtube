import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  const t = useTranslations('header');
  
  return (
    <Link href={"/"} className="inline-flex">
      <h2
        className={cn(
          "text-2xl text-shop_dark_green font-black tracking-wider hover:text-shop_light_green hoverEffect group font-sans",
          className
        )}
      >
        {t('brandName')}
        <span
          className={cn(
            "text-shop_light_green group-hover:text-shop_dark_green hoverEffect ml-0.5",
            spanDesign
          )}
        >
          .
        </span>
      </h2>
    </Link>
  );
};

export default Logo;
