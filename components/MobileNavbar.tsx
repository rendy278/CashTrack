import React from "react";
import { RiMenu2Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";

interface MobileNavbarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  links: { url: string; label: string }[];
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  open,
  setOpen,
  links,
}) => {
  return (
    <aside>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-xl p-2"
        aria-label="Open Navigation Menu"
      >
        <RiMenu2Line size={20} />
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background shadow-lg transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col items-start h-full  gap-y-10">
          <div className=" border-b border-foreground w-full ">
            <div className="p-4 flex justify-between items-center w-full">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="text-xl "
                aria-label="Close Navigation Menu"
              >
                <MdClose size={30} />
              </button>
            </div>
          </div>

          <ul className="flex flex-col p-4 items-start gap-4">
            {links.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-xl text-muted-foreground w-full"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}
    </aside>
  );
};

export default MobileNavbar;
