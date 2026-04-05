"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "Quienes somos", href: "#about" },
  { label: "Ultimos trabajos", href: "#latest-works" },
  { label: "Contacto", href: "#contact" },
];

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCompact, setIsMobileCompact] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const updateMobileCompactState = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const compact = isMobile && window.scrollY > 64;

      setIsMobileCompact(compact);
      if (!compact) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", updateMobileCompactState, {
      passive: true,
    });
    window.addEventListener("resize", updateMobileCompactState);

    updateMobileCompactState();

    return () => {
      window.removeEventListener("scroll", updateMobileCompactState);
      window.removeEventListener("resize", updateMobileCompactState);
    };
  }, [mounted]);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-[100]">
        <div className="hidden h-[72px] border-b border-[var(--color-border-strong)] bg-[color:var(--color-bg)]/92 md:block" />
        <div className="h-[238px] border-b border-[var(--color-border-strong)] bg-[color:var(--color-bg)] md:hidden" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[100]">
      <div className="hidden border-b border-[var(--color-border-strong)] bg-[color:var(--color-bg)]/92 backdrop-blur-md md:block">
        <div className="mx-auto flex h-[72px] w-full max-w-[1140px] items-center justify-between gap-4 px-8">
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

          <nav className="no-scrollbar flex max-w-none items-center gap-2 overflow-x-auto rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1.5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.01em] text-[var(--color-text-light)] transition hover:bg-[rgba(196,30,58,0.08)] hover:text-[var(--color-primary)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="md:hidden">
        {!isMobileCompact ? (
          <div className="border-b border-[var(--color-border-strong)] bg-[color:var(--color-bg)] shadow-[0_10px_22px_rgba(15,23,42,0.10)]">
            <div className="mx-auto flex h-[180px] w-full max-w-[1140px] items-center justify-center px-4 pt-5">
              <Link href="/" className="block">
                <Image
                  src="/navbar/morettiblanco_logo.png"
                  alt="Moretti Blanco"
                  className="h-auto w-auto max-h-[132px] object-contain"
                  width={665}
                  height={600}
                  priority
                />
              </Link>
            </div>

            <div className="px-3 pb-3">
              <nav className="grid h-[42px] grid-cols-3 items-center rounded-full border border-[#b8c3d4] bg-[#eef2f7] px-1 text-center shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                {links.map((link) => (
                  <a
                    key={`mobile-top-${link.href}`}
                    href={link.href}
                    className="truncate rounded-full px-2 py-1.5 text-[clamp(12px,3vw,14px)] font-semibold tracking-[0.005em] text-[#4a5568] transition-colors duration-200 hover:bg-white/70 hover:text-[#243041] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94a3b8]/60"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        ) : (
          <div className="relative border-b border-[var(--color-border-strong)] bg-[color:var(--color-bg)]/96 shadow-[0_8px_18px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <div className="mx-auto flex h-[74px] w-full max-w-[1140px] items-center justify-between px-4">
              <Link href="/" className="block">
                <Image
                  src="/navbar/morettiblanco_logo.png"
                  alt="Moretti Blanco"
                  className="h-auto w-auto max-h-[48px] object-contain"
                  width={665}
                  height={600}
                  priority
                />
              </Link>

              <button
                type="button"
                aria-label="Abrir menú"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8dce2] bg-[#f9fafb] text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)]"
              >
                <span className="flex flex-col gap-[4px]">
                  <span className="h-[2px] w-5 rounded-full bg-current" />
                  <span className="h-[2px] w-5 rounded-full bg-current" />
                  <span className="h-[2px] w-5 rounded-full bg-current" />
                </span>
              </button>
            </div>

            {isMobileMenuOpen && (
              <div className="absolute right-4 top-[62px] z-[110] w-[min(78vw,280px)] overflow-hidden rounded-2xl border border-[#d8dce2] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.14)]">
                <ul className="flex flex-col p-2">
                  {links.map((link) => (
                    <li key={`mobile-dropdown-${link.href}`}>
                      <a
                        href={link.href}
                        onClick={handleMobileLinkClick}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1f2937] transition hover:bg-[rgba(196,30,58,0.08)] hover:text-[var(--color-primary)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
