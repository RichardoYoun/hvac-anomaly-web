"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Menu, Zap } from "lucide-react";

const NAV = ["Products", "Solutions", "Developers", "Resources", "Pricing"];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-black/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-[17px] font-semibold tracking-tight text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--ps-accent-gradient)] shadow-[0_4px_12px_rgba(253,98,82,0.35)] transition group-hover:scale-105">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.2} />
            </span>
            PowerSense
          </Link>
          <ul className="hidden items-center gap-7 text-[14px] font-medium text-white/85 md:flex">
            {NAV.map((label) => (
              <li key={label}>
                <Link
                  href="#"
                  className="transition hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 text-[14px] font-medium text-white md:gap-4">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-3 py-1.5 transition hover:text-white/75 md:inline"
          >
            Sign in
          </Link>
          <Link
            href="#contact"
            className="hidden items-center gap-1 rounded-full px-3 py-1.5 transition hover:text-white/75 md:inline-flex"
          >
            Contact sales
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 font-medium text-[#0a2540] shadow-sm transition hover:bg-white/90"
          >
            Open app
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            className="rounded-full p-1.5 text-white md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
