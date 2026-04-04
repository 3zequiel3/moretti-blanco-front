"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BoxArrowRight,
  ChevronLeft,
  ChevronRight,
  PersonCircle,
} from "react-bootstrap-icons";
import type { AdminUser } from "@/types/user";
import { logoutAction } from "@/app/admin/login/actions";

type AdminNavbarProps = {
  user: AdminUser | null;
  onToggleSidebar: () => void;
  isSidebarPinned: boolean;
};

export function AdminNavbar({
  user,
  onToggleSidebar,
  isSidebarPinned,
}: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="grid h-16 grid-cols-[64px_1fr_auto] items-center gap-2 px-2 md:px-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)]"
          aria-label={isSidebarPinned ? "Cerrar sidebar" : "Abrir sidebar"}
          title={isSidebarPinned ? "Cerrar sidebar" : "Abrir sidebar"}
        >
          {isSidebarPinned ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>

        <div className="hidden md:block" aria-hidden />

        <div className="flex items-center justify-end gap-2 pr-1">
          <Link
            href="/admin/profile"
            className="group flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] pl-2 pr-3 py-1.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary-hover)]"
            aria-label="Ir a perfil"
          >
            {user?.foto_url ? (
              <Image
                src={user.foto_url}
                alt="Foto de perfil"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full border border-[#e2e8f0] object-cover"
              />
            ) : (
              <PersonCircle className="h-7 w-7 text-[var(--color-primary-hover)]" />
            )}
            <span className="hidden md:inline">{user?.nombre ?? "Perfil"}</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-primary-hover)] transition hover:border-[var(--color-primary-hover)] hover:bg-[var(--color-bg-secondary)]"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <BoxArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
