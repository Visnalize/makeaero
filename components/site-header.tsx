"use client";

import GitHub from "@/components/icon/github";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/button", label: "Button" },
  { href: "/orb", label: "Glossy Orb" },
  { href: "/window-glass", label: "Window Glass" },
  { href: "/about", label: "About" },
];

const socialLinks = [
  {
    href: "https://github.com/Visnalize/makeaero",
    icon: <GitHub className="w-5 h-5" />,
    label: "GitHub",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="top-0 z-50 sticky bg-white/70 backdrop-blur-md border-white/30 border-b">
      <div className="flex justify-between items-center mx-auto px-6 max-w-6xl h-14">
        <Link
          href="/"
          className="font-bold text-slate-800 hover:text-brand text-xl transition-colors"
        >
          Make Aero
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium text-sm transition-colors",
                  pathname === link.href
                    ? "bg-brand-light text-brand-dark"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                )}
              >
                {link.label}
              </Link>
            ))}
            <span className="mx-2 text-slate-400">|</span>
          </nav>

          {/* Social links — always visible */}
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="hover:bg-slate-100 px-2 py-1.5 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.icon}
            </a>
          ))}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="sm:hidden hover:bg-slate-100 p-2 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="sm:hidden top-full right-0 left-0 absolute bg-white/90 backdrop-blur-md px-4 pt-1 pb-3 border-white/30 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                pathname === link.href
                  ? "bg-brand-light text-brand-dark"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
