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
  { href: "/wallpaper", label: "Wallpaper" },
  { href: "/pfp", label: "PFP" },
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
    <header className="top-0 z-50 sticky aero-header">
      <div className="flex justify-between items-center mx-auto px-6 max-w-6xl h-14">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-800 hover:text-brand-dark text-xl transition-colors"
        >
          <span
            aria-hidden
            className="inline-block rounded-full w-5 h-5"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #eafff9, #12c6a6 55%, #0a7d67 100%)",
              boxShadow:
                "inset 0 -2px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.3)",
            }}
          />
          Make Aero
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium text-sm transition-colors",
                  pathname === link.href
                    ? "aero-nav-active"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60",
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
            className="lg:hidden hover:bg-slate-100 p-2 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="lg:hidden top-full right-0 left-0 absolute aero-header px-4 pt-1 pb-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                pathname === link.href
                  ? "aero-nav-active"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60",
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
