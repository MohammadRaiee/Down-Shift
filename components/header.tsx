// 'use client'
// import { useState , useEffect} from "react";
// import { cn } from "@/lib/utils";
// export default function(){
//  const [isScrolled,setIsScrolled]=useState(false)
 
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);

//       }
    

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//     return (<>
//     <header  className={cn(
//         "fixed top-0 left-0 right-0 z-40 bg-amber-100 transition-all duration-300",
//         isScrolled
//           ? "bg-background/60 backdrop-blur-sm shadow-xs"
//           : "bg-transparent"
//       )} >

//         {/* <h1 className="text-9xl text-stone-600">hhhhhhhhhhhhhhh</h1> */}
//       </header>
//     </>)
// }

'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/cart/CartDrawer";
import { ShoppingCart, LogIn } from "lucide-react";

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
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-black/90 backdrop-blur-sm shadow-sm"
          : "bg-black/80"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-100">
        {/* Empty left block where logo would be */}
        <div className="w-32" />

        {/* Center navigation */}
        <nav className="flex gap-8">
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
          <button
            className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors"
            type="button"
            onClick={() => setCartOpen(true)}
          >
            <span>My Cart</span>
            <ShoppingCart size={14} />
          </button>

          <Button
            size="sm"
            className="flex items-center gap-1 rounded-full bg-red-600 px-4 py-1 text-xs font-semibold hover:bg-red-700"
          >
            <span>Login</span>
            <LogIn size={14} />
          </Button>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}