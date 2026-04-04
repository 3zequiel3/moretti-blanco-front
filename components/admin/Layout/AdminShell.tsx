"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "@/components/admin/Navbar/AdminNavbar";
import { Sidebar } from "@/components/admin/Sidebar/Sidebar";
import { getCurrentAdminUser } from "@/lib/userService";
import type { AdminUser } from "@/types/user";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadUser = async () => {
      try {
        const data = await getCurrentAdminUser();
        if (!ignore) {
          setUser(data);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      }
    };

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const handleNavbarToggle = () => {
    if (isSidebarPinned || isSidebarExpanded) {
      setIsSidebarPinned(false);
      setIsSidebarExpanded(false);
      return;
    }

    setIsSidebarPinned(true);
    setIsSidebarExpanded(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg-secondary)]">
      <Sidebar
        user={user}
        isExpanded={isSidebarExpanded}
        isPinned={isSidebarPinned}
        setIsExpanded={setIsSidebarExpanded}
        setIsPinned={setIsSidebarPinned}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar
          user={user}
          onToggleSidebar={handleNavbarToggle}
          isSidebarPinned={isSidebarPinned}
        />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
