import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import MobileMenu from "@/components/MobileMenu";
import { currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/queries";
import HeaderClient from "./HeaderClient";

const Header = async () => {
  const user = await currentUser();

  // ✅ orders sirf tab fetch karo jab user logged in hai
  let orders = null;
  if (user?.id) {
    orders = await getMyOrders(user.id);
  }

  // ✅ Safe plain object create karo (class object nahi bhejna)
  const safeUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress || null,
      }
    : null;

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center md:ml-0 ml-1 gap-1 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        <HeaderMenu />

        {/* ✅ Ab sirf plain user object bhej rahe hain */}
        <HeaderClient user={safeUser} orders={orders} />
      </Container>
    </header>
  );
};

export default Header;
