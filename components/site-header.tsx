"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/button", label: "Button" },
  { href: "/orb", label: "Glossy Orb" },
  { href: "/window-glass", label: "Window Glass" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="top-0 z-50 sticky bg-white/70 backdrop-blur-md border-white/30 border-b">
      <div className="flex justify-between items-center mx-auto px-6 max-w-6xl h-14">
        <Link href="/" className="font-bold text-slate-800 hover:text-brand text-xl transition-colors">
          Make Aero
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-full font-medium text-sm transition-colors",
                pathname === link.href
                  ? "bg-brand-light text-brand-dark"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
