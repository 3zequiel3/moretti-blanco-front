"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Quienes somos", href: "#about" },
  { label: "Ultimos trabajos", href: "#latest-works" },
  { label: "Contacto", href: "#contact" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--color-border-strong)] bg-[color:var(--color-bg)]/92 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1140px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex h-full items-center">
          <Link href="/">
            <Image
              src="/navbar/morettiblanco_logo.png"
              alt="Moretti Blanco"
              className="h-auto w-auto max-h-[52px] object-contain"
              width={665}
              height={600}
              priority
            />
          </Link>
        </div>

        <nav className="no-scrollbar hidden max-w-[65vw] items-center gap-1 overflow-x-auto rounded-full border border-[var(--color-border)] bg-white/70 px-2 py-1.5 md:flex md:max-w-none md:gap-2 md:px-3">
          {links.map((link) => {
            return (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-light)] transition hover:bg-[rgba(196,30,58,0.10)] hover:text-[var(--color-primary)] md:text-xs"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="relative md:hidden">
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white/85 text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)]"
          >
            <span className="flex flex-col gap-[4px]">
              <span className="h-[2px] w-5 rounded-full bg-current" />
              <span className="h-[2px] w-5 rounded-full bg-current" />
              <span className="h-[2px] w-5 rounded-full bg-current" />
            </span>
          </button>

          {isMobileMenuOpen && (
            <div className="absolute right-0 top-[54px] w-[min(78vw,280px)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_18px_38px_rgba(15,23,42,0.18)]">
              <ul className="flex flex-col p-2">
                {links.map((link) => (
                  <li key={`mobile-${link.href}`}>
                    <a
                      href={link.href}
                      onClick={handleMobileLinkClick}
                      className="block rounded-xl px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text)] transition hover:bg-[rgba(196,30,58,0.10)] hover:text-[var(--color-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
