"use client";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import SignIn from "./SignIn";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import { Logs } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderClientProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    email: string | null;
  } | null;
  orders: any;
}

const HeaderClient = ({ user, orders }: HeaderClientProps) => {
  return (
    <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
      {/* ✅ Language Switcher Desktop Only */}
      <LanguageSwitcher className="hidden md:block" />

      <CartIcon />
      <FavoriteButton />

      {/* ✅ Orders Button */}
      {user && (
        <Link
          href={"/orders"}
          className="group relative hover:text-shop_light_green hoverEffect"
        >
          <Logs />
          <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {orders?.length ? orders?.length : 0}
          </span>
        </Link>
      )}

      {/* ✅ Clerk Authentication Buttons */}
      <ClerkLoaded>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {!user && <SignIn />}
      </ClerkLoaded>
    </div>
  );
};

export default HeaderClient;
