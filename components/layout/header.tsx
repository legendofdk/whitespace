"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/du-an", label: "Dự án" },
  { href: "/dat-nen", label: "Đất nền" },
  { href: "/cho-thue", label: "Cho thuê" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="shell flex min-h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sand/40 bg-white/5 font-display text-xl">
            W
          </div>
          <div>
            <div className="font-display text-2xl leading-none">WhiteSpace</div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-slate-300">Luxury Real Estate</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-200 transition hover:text-white">
              {item.label}
            </Link>
          ))}
          <a
            href="tel:0234235344"
            className="rounded-full border border-sand/40 bg-sand px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Hotline 24/7
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
          aria-label="Open menu"
        >
          <span className="text-lg">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-ink md:hidden">
          <div className="shell flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 text-sm text-slate-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
