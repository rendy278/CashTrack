"use client";

import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import { links } from "@/constant/dashboardlink";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import SwitchThemeBtn from "./SwitchThemeBtn";
import MobileNavbar from "./MobileNavbar";
import { UserCircle } from "lucide-react";

const DesktopNavbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Set initial loading state to true

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <nav className="block border-b bg-background">
      <div className="flex justify-between items-center w-full p-6">
        <div className="flex items-center gap-x-4">
          <MobileNavbar open={open} setOpen={setOpen} links={links} />
          <Logo />
          <ul className="hidden md:flex items-center gap-x-4">
            {links.map((item, index) => {
              const isActive = pathname === item.url;
              return (
                <li key={index} className="relative flex items-center">
                  <Link
                    href={item.url}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-lg text-muted-foreground justify-start w-full",
                      isActive && "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>

                  {isActive && (
                    <div className="absolute -bottom-7 left-1/2 h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <SwitchThemeBtn />
          {loading ? (
            <UserCircle className="w-11 h-11" /> // Show loading spinner (UserCircle) while loading
          ) : (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-11 h-11 rounded-full",
                  userButtonPopoverCard: "border border-sky-500 shadow-lg",
                },
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
