// components/admin/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Briefcase,
  ChevronDown,
  Gear,
  House,
  PersonCircle,
  ShieldLock,
} from "react-bootstrap-icons";
import type { AdminUser } from "@/types/user";
interface IMenuItem {
  id: number;
  icon: React.ElementType;
  label: string;
  path?: string;
  subitems?: Array<{
    id: number;
    label: string;
    path: string;
  }>;
}

const menuItems: IMenuItem[] = [
  {
    id: 1,
    icon: House,
    label: "Inicio",
    path: "/admin",
  },
  {
    id: 2,
    icon: ShieldLock,
    label: "Sitio",
    subitems: [
      { id: 2.1, label: "Banners", path: "/admin/banners" },
      { id: 2.2, label: "Contacto", path: "/admin/contact" },
      { id: 2.3, label: "Últimos Trabajos", path: "/admin/latestworks" },
    ],
  },
  {
    id: 3,
    icon: PersonCircle,
    label: "Perfil",
    path: "/admin/profile",
  },
];

type SidebarProps = {
  user: AdminUser | null;
  isExpanded: boolean;
  isPinned: boolean;
  setIsExpanded: (value: boolean) => void;
  setIsPinned: (value: boolean) => void;
};

export const Sidebar = ({
  user,
  isExpanded,
  isPinned,
  setIsExpanded,
  setIsPinned,
}: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [hoveredGroupId, setHoveredGroupId] = useState<number | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<number | null>(null);
  const pathname = usePathname();

  const toggleSubitems = (itemId: number) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const closeDesktopSidebarByNavigation = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsExpanded(false);
    }
  };

  const clientMenuItem = menuItems[1];
  const ClientIcon = clientMenuItem.icon;

  return (
    <>
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative hidden h-full md:flex"
      >
        <ProSidebar
          collapsed={!isExpanded}
          width="280px"
          collapsedWidth="80px"
          transitionDuration={240}
          rootStyles={{
            border: "none",
            height: "100%",
            backgroundColor: "var(--color-text)",
            borderRight: "1px solid rgba(229, 231, 235, 0.24)",
            "& .ps-sidebar-container": {
              backgroundColor: "transparent",
            },
            "&.ps-collapsed .ps-menu-button": {
              width: "56px",
              margin: "0 auto",
              padding: "0",
              justifyContent: "center",
            },
            "&.ps-collapsed .ps-menu-icon": {
              minWidth: "24px",
              marginRight: "0",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "&.ps-collapsed .ps-menu-label": { display: "none" },
          }}
        >
          <Menu
            className="flex-1 py-5"
            menuItemStyles={{
              button: ({ active }) => ({
                height: "52px",
                width: isExpanded ? "calc(100% - 18px)" : "56px",
                borderRadius: "12px",
                margin: isExpanded ? "0 9px" : "0 auto",
                justifyContent: isExpanded ? "flex-start" : "center",
                paddingLeft: isExpanded ? "14px" : "0",
                paddingRight: isExpanded ? "14px" : "0",
                color: active ? "#ffffff" : "rgba(255,255,255,0.82)",
                backgroundColor: active
                  ? "var(--color-primary-hover)"
                  : "transparent",
                boxShadow: active
                  ? "0 8px 20px rgba(196, 30, 58, 0.36)"
                  : "none",
                transition: "all 0.18s ease",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: active
                    ? "var(--color-primary-hover)"
                    : "rgba(196,30,58,0.32)",
                },
              }),
              label: { fontSize: "14px", fontWeight: 600 },
              icon: () => ({
                color: "inherit",
                marginRight: isExpanded ? "10px" : "0",
                minWidth: "24px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }),
            }}
          >
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const hasSubitems = item.subitems && item.subitems.length > 0;
              const hasActiveSubitem = Boolean(
                hasSubitems &&
                item.subitems?.some((sub) => sub.path === pathname),
              );
              const isItemExpanded =
                expandedItems.includes(item.id) ||
                hoveredGroupId === item.id ||
                hasActiveSubitem;
              const isActive = item.path === pathname || hasActiveSubitem;

              return (
                <div
                  key={item.id}
                  className="mb-2"
                  onMouseEnter={() => {
                    if (hasSubitems && isExpanded) {
                      setHoveredGroupId(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasSubitems) {
                      setHoveredGroupId((prev) =>
                        prev === item.id ? null : prev,
                      );
                    }
                  }}
                >
                  <MenuItem
                    active={isActive}
                    onClick={() => {
                      if (hasSubitems) {
                        if (!isExpanded) setIsExpanded(true);
                        toggleSubitems(item.id);
                        return;
                      }
                      closeDesktopSidebarByNavigation();
                    }}
                    component={
                      !hasSubitems && item.path ? (
                        <Link href={item.path} />
                      ) : undefined
                    }
                    icon={<IconComponent size={20} />}
                  >
                    {isExpanded && (
                      <div className="flex w-full items-center justify-between">
                        <span>{item.label}</span>
                        {hasSubitems && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isItemExpanded ? "rotate-180" : "rotate-0"}`}
                          />
                        )}
                      </div>
                    )}
                  </MenuItem>

                  {hasSubitems && isItemExpanded && isExpanded && (
                    <div className="mt-1 flex flex-col gap-1 pl-2">
                      {item.subitems?.map((subitem) => (
                        <MenuItem
                          key={subitem.id}
                          active={pathname === subitem.path}
                          component={<Link href={subitem.path} />}
                          onClick={closeDesktopSidebarByNavigation}
                          style={{
                            height: "42px",
                            paddingLeft: "30px",
                            fontSize: "13px",
                          }}
                        >
                          {subitem.label}
                        </MenuItem>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </Menu>

          <div className="border-t border-[rgba(229,231,235,0.22)] p-4">
            <div
              className={`rounded-xl border border-[rgba(229,231,235,0.26)] bg-[rgba(255,255,255,0.05)] p-3 text-white ${isExpanded ? "block" : "hidden"}`}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#94a3b8]">
                Sesión
              </p>
              <p className="mt-1 truncate text-sm font-semibold">
                {user?.nombre ?? "Administrador"}
              </p>
            </div>
          </div>
        </ProSidebar>
      </aside>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
        {mobileSubmenu === clientMenuItem.id && (
          <div className="pointer-events-auto mb-2 rounded-2xl border border-[#e6e7eb] bg-white p-2 shadow-[0_20px_30px_rgba(15,23,42,0.14)]">
            {clientMenuItem.subitems?.map((subitem) => (
              <Link
                key={subitem.id}
                href={subitem.path}
                onClick={() => setMobileSubmenu(null)}
                className={`mb-1 block rounded-xl px-4 py-2 text-sm font-semibold transition ${pathname === subitem.path ? "bg-[#c41e3a] text-white shadow-sm" : "text-[#4b5563] hover:bg-[#f8f9fb] hover:text-[#1f2937]"}`}
              >
                {subitem.label}
              </Link>
            ))}
          </div>
        )}

        <nav className="pointer-events-auto grid grid-cols-3 items-center rounded-[28px] border border-[#e6e7eb] bg-white/96 px-2 py-2 text-[#4b5563] shadow-[0_18px_30px_rgba(15,23,42,0.14)] backdrop-blur-md">
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] font-semibold transition ${pathname === "/admin" ? "bg-[#c41e3a] text-white shadow-sm" : "text-[#4b5563] hover:bg-[#f8f9fb] hover:text-[#1f2937]"}`}
          >
            <House size={18} />
            Inicio
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileSubmenu((prev) =>
                prev === clientMenuItem.id ? null : clientMenuItem.id,
              )
            }
            className={`flex flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] font-semibold transition ${clientMenuItem.subitems?.some((subitem) => subitem.path === pathname) ? "bg-[#c41e3a] text-white shadow-sm" : "text-[#4b5563] hover:bg-[#f8f9fb] hover:text-[#1f2937]"}`}
          >
            <ClientIcon size={18} />
            Sitio
          </button>

          <Link
            href="/admin/profile"
            onClick={() => setMobileSubmenu(null)}
            className={`flex flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] font-semibold transition ${pathname === "/admin/profile" ? "bg-[#c41e3a] text-white shadow-sm" : "text-[#4b5563] hover:bg-[#f8f9fb] hover:text-[#1f2937]"}`}
          >
            <Gear size={18} />
            Perfil
          </Link>
        </nav>
      </div>
    </>
  );
};
