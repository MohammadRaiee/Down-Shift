'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/cart/CartDrawer";
import { ShoppingCart, LogIn ,Menu } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "z-50  top-0 left-0 right-0  transition-all duration-300",
        isScrolled
          ? "bg-black/90 backdrop-blur-sm shadow-sm"
          : "bg-black/95"
      )}
    >
    <div className="flex max-w-500 w-[95%] mx-auto justify-between  " >
       <img src={`/best4.svg`} alt="Logo" className="w-95 h-22 max-[480px]:w-60 max-[480px]:h-18 min-[500px]:-ml-14 max-[420px]:w-45 max-[420px]:h-15" />
      <div className=" my-auto flex max-w-6xl items-end lg:items-center lg:justify-between  xl:pl-[8%] text-xs font-semibold uppercase tracking-wide text-slate-100">

    <div className="flex gap-8 my-auto items-end" >

        {/* Center navigation */}
        <nav className=" gap-8  my-auto hidden lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-red-500 transition-colors"
            >
              {item.label}
            </Link>  
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">

         
          {/* <Button
            size="sm"
            className=" items-center gap-1 rounded-full bg-red-600 px-4 py-1 text-xs font-semibold hover:bg-red-700 flex  lg:hidden  "
          >
            <span>Login</span>
            <LogIn size={14} />
          </Button> */}

           <button
            className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors"
            type="button"
            onClick={() => setCartOpen(true)}
          >
            <span className="hidden lg:block">My Cart</span>
            <ShoppingCart className=" w-6 h-6 lg:w-4 lg:h-4 max-[420px]:w-3 max-[420px]:h-3"  />
          </button>
  <Button
            size="sm"
            className=" items-center gap-1 rounded-full bg-red-600  py-1 text-xs font-semibold hover:bg-red-700 hidden lg:flex  "
          >
            <span>Login</span>
            <LogIn size={14} />
          </Button>
          <LogIn className="hover:text-red-500 w-5 h-5 block lg:hidden  max-[420px]:w-3 max-[420px]:h-3"  />
                    <Menu className="w-7 h-7 block lg:hidden hover:text-red-500  max-[420px]:w-4 max-[420px]:h-4" />
        </div>
      </div>
      </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}