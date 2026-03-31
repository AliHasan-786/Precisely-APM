"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Case Study", href: "/case-study" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Wordmark */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-xl font-bold bg-gradient-to-r from-[#4A154B] to-[#E20074] bg-clip-text text-transparent">
              PM-Intel
            </span>
            <span className="text-[11px] text-gray-400 font-medium tracking-wide">
              PM internship portfolio
            </span>
          </Link>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-purple-50 text-[#4A154B]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 transition-opacity shadow-sm"
            >
              Launch Demo
              <ArrowRight size={14} />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-purple-50 text-[#4A154B]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 transition-opacity"
          >
            Launch Demo
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </header>
  );
}
