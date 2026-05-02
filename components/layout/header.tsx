"use client";

import { projects } from "@/data/mock";
import Link from "next/link";
import { useState } from "react";

const featuredProjectItems = projects
  .filter((project) => project.isFeatured)
  .map((project) => ({
    href: `/du-an/${project.slug}`,
    label: project.name
  }));

const navItems = [
  {
    href: "/du-an",
    label: "Dự án",
    children: featuredProjectItems
  },
  {
    href: "/dat-nen",
    label: "Đất nền",
    children: [
      { href: "/dat-nen?area=Gia%20L%C3%A2m", label: "Gia Lâm" },
      { href: "/dat-nen?area=Long%20Bi%C3%AAn", label: "Long Biên" },
      { href: "/dat-nen?area=%C4%90%C3%B4ng%20Anh", label: "Đông Anh" }
    ]
  },
  {
    href: "/cho-thue",
    label: "Cho thuê",
    children: [
      { href: "/cho-thue?area=Gia%20L%C3%A2m", label: "Gia Lâm" },
      { href: "/cho-thue?area=Long%20Bi%C3%AAn", label: "Long Biên" },
      { href: "/cho-thue?area=%C4%90%C3%B4ng%20Anh", label: "Đông Anh" }
    ]
  },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="group relative"
              onMouseEnter={() => setActiveDropdown(item.children?.length ? item.href : null)}
              onMouseLeave={() => setActiveDropdown((current) => (current === item.href ? null : current))}
            >
              <div className="py-3">
                <Link
                  href={item.href}
                  onClick={() => {
                    if (item.children?.length) {
                      setActiveDropdown((current) => (current === item.href ? null : item.href));
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                  className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-slate-200 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </div>

              {item.children?.length ? (
                <div
                  className={`absolute left-0 top-full z-50 min-w-[220px] pt-2 transition duration-200 ${
                    activeDropdown === item.href
                      ? "visible translate-y-0 opacity-100"
                      : "invisible translate-y-2 opacity-0"
                  }`}
                >
                  <div className="rounded-[24px] border border-white/10 bg-ink/95 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
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
              <div key={item.href} className="border-b border-white/10 py-4">
                <Link href={item.href} onClick={() => setOpen(false)} className="text-sm text-slate-200">
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="mt-3 flex flex-col gap-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="text-sm text-slate-400"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
