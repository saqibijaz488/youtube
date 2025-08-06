"use client";
import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              {t("description")}
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>{t("quickLinks")}</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {t(`quickLinksData.${item.title.toLowerCase().replace(/\s+/g, "")}`, { defaultValue: item.title })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>{t("categories")}</SubTitle>
            <ul className="space-y-3 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {t(`categoriesData.${item.title.toLowerCase().replace(/\s+/g, "")}`, { defaultValue: item.title })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <SubTitle>{t("newsletter")}</SubTitle>
            <SubText>
              {t("newsletterDescription")}
            </SubText>
            <form className="space-y-3">
              <Input placeholder={t("enterEmail")} type="email" required />
              <Button className="w-full">{t("subscribe")}</Button>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. {t("allRightsReserved")}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
