"use client";
import { AlignLeft } from "lucide-react";
import React, { useState } from "react";
import { useTranslations } from "next-intl"; // ✅ Translation hook add kiya
import SideMenu from "./SideMenu";

const MobileMenu = () => {
  const t = useTranslations("navigation"); // ✅ Future proof - SideMenu ka text yahan se ayega
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* ✅ Toggle button */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
      </button>

      {/* ✅ Sidebar */}
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};

export default MobileMenu;
