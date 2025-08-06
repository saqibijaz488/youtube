"use client";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

interface ContactItemData {
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
}

const FooterTop = () => {
  const t = useTranslations("footer");
  
  const data: ContactItemData[] = [
    {
      titleKey: "visitUs",
      subtitleKey: "location",
      icon: (
        <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },
    {
      titleKey: "callUs",
      subtitleKey: "phone",
      icon: (
        <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },
    {
      titleKey: "workingHours",
      subtitleKey: "hours",
      icon: (
        <Clock className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },
    {
      titleKey: "emailUs",
      subtitleKey: "email",
      icon: (
        <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
      ),
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect"
        >
          {item?.icon}
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-black hoverEffect">
              {t(item?.titleKey)}
            </h3>
            <p className="text-sm text-gray-600">{t(item?.subtitleKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
