"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
import { useTranslations } from "next-intl";   // ✅ i18n hook import

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  const t = useTranslations(); // ✅ hook call

  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.value)}
              key={item?.value}
              className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${
                selectedTab === item?.value
                  ? "bg-shop_light_green text-white border-shop_light_green"
                  : "bg-shop_light_green/10"
              }`}
            >
              {t(`productType.${item.value}`)}   {/* ✅ translation key */}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect"
      >
        {t("common.seeAll")}   {/* ✅ translation for See All */}
      </Link>
    </div>
  );
};

export default HomeTabbar;
