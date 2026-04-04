"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export const ActionMenu = ({ items }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }

    return undefined;
  }, [isOpen]);

  const handleItemClick = (item: ActionMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Acciones"
        aria-label="Menú de acciones"
      >
        ⋮
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 min-w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
          {items.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${item.variant === "danger" ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-100"}`}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && (
                <span className="flex items-center justify-center text-sm">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
