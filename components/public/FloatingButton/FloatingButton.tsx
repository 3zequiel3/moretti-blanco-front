"use client";

// components/public/FloatingButton.tsx
import { useEffect, useState } from "react";
import { Whatsapp } from "react-bootstrap-icons";
import { fetchAPI } from "@/lib/apiClient";
import type { IContactData } from "@/types/contact";
const DUMMY_WHATSAPP_LINK = "https://wa.me/1234567890";

type SocialConfig = {
  key: string;
  href: string;
};

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const buildSocialLinks = (
  links: Record<string, string> | undefined,
): SocialConfig[] => {
  if (!links) return [];

  const isSocialKey = (key: string) => {
    const normalized = key.toLowerCase().trim();
    return (
      normalized.includes("whatsapp") ||
      normalized.includes("instagram") ||
      normalized.includes("facebook")
    );
  };

  return Object.entries(links)
    .filter(
      ([key, value]) =>
        isSocialKey(key) &&
        typeof value === "string" &&
        value.trim().length > 0,
    )
    .map(([key, value]) => ({ key, href: value.trim() }));
};

function resolveFloatingLink(
  links: Record<string, string> | undefined,
): string {
  if (links) {
    const presupuestoLink = Object.entries(links).find(([key, value]) => {
      const raw = key.toLowerCase().trim();
      const normalized = normalizeKey(key);
      return (
        (raw === "solicitar_presupuesto" ||
          normalized === "solicitar presupuesto") &&
        typeof value === "string" &&
        value.trim().length > 0
      );
    });

    if (presupuestoLink) {
      return presupuestoLink[1].trim();
    }
  }

  const socialLinks = buildSocialLinks(links);
  const whatsappLink = socialLinks.find((link) =>
    normalizeKey(link.key).includes("whatsapp"),
  );

  return whatsappLink?.href ?? DUMMY_WHATSAPP_LINK;
}

// Simulamos los datos que luego vendrán de FastAPI
export const FloatingButton = () => {
  const [floatingLink, setFloatingLink] = useState(DUMMY_WHATSAPP_LINK);

  useEffect(() => {
    const loadFloatingLink = async () => {
      try {
        const data = await fetchAPI<IContactData | null>("/contacto/");
        setFloatingLink(resolveFloatingLink(data?.links_botones));
      } catch {
        setFloatingLink(DUMMY_WHATSAPP_LINK);
      }
    };

    loadFloatingLink();
  }, []);

  return (
    <a
      href={floatingLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar presupuesto"
      title="Solicitar presupuesto"
      // Usamos "group" para controlar a los hijos en el hover
      className="group fixed bottom-[16px] right-[16px] z-[999] flex h-[50px] min-w-[50px] cursor-pointer items-center justify-center rounded-full bg-[#25D366] px-0 text-white shadow-[0_6px_20px_rgba(37,211,102,0.4)] no-underline transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 md:bottom-[24px] md:right-[24px] md:h-[56px] md:w-[56px] hover:md:w-auto hover:md:px-[20px] hover:md:shadow-[0_8px_28px_rgba(37,211,102,0.6)]"
    >
      {/* Icono (Siempre visible) */}
      <span className="flex shrink-0 items-center justify-center text-[1.5rem] md:text-[1.8rem]">
        <Whatsapp />
      </span>

      {/* Texto expansible (Animación suave con Tailwind) */}
      <span className="w-0 overflow-hidden whitespace-nowrap text-[0.95rem] font-medium opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:ml-[12px] group-hover:w-auto group-hover:opacity-100 hidden md:inline-block">
        ¡Solicita tu presupuesto!
      </span>
    </a>
  );
};
