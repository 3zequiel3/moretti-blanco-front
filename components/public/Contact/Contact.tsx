// components/public/Contact.tsx
import Image from "next/image";
import { Whatsapp, Instagram, Facebook } from "react-bootstrap-icons";
import type { IContactData } from "@/types/contact"; // Asegúrate de exportar tus interfaces aquí

// 1. Datos hardcodeados de ejemplo basados en tu interfaz
const DUMMY_CONTACT_DATA: IContactData = {
  id: 1,
  nombre: "Pablo Moretti",
  telefono: "+54 9 261 123 4567",
  foto_url: "/contact/contact.jpg", // Asegúrate de tener una imagen de prueba en public/contact/
  links_botones: {
    whatsapp: "https://wa.me/1234567890",
    instagram: "https://instagram.com/morettiblanco",
    facebook: "https://facebook.com/morettiblanco",
  },
};

type SocialConfig = {
  key: string;
  href: string;
};

// 2. Helpers (Se mantienen igual, solo adaptamos las clases)
const buildSocialLinks = (
  links: Record<string, string> | undefined
): SocialConfig[] => {
  if (!links) return [];
  return Object.entries(links)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .map(([key, value]) => ({ key, href: value.trim() }));
};

const getSocialIcon = (key: string) => {
  const normalized = key.toLowerCase().trim();
  if (normalized.includes("whatsapp")) return <Whatsapp />;
  if (normalized.includes("instagram")) return <Instagram />;
  if (normalized.includes("facebook")) return <Facebook />;
  return key.slice(0, 1).toUpperCase();
};

// ¡MAGIA TAILWIND! Aquí devolvemos los colores exactos que tenías en el CSS
const getSocialButtonClass = (key: string) => {
  const normalized = key.toLowerCase().trim();
  if (normalized.includes("whatsapp")) {
    return "bg-[#25D366] text-white";
  }
  if (normalized.includes("instagram")) {
    return "bg-gradient-to-br from-[#d466ea] to-[#9c4ba2] text-white";
  }
  if (normalized.includes("facebook")) {
    return "bg-[#1877F2] text-white";
  }
  return "bg-[var(--color-primary-hover)] text-white"; // Genérico
};

export const Contact = () => {
  // Simulamos la respuesta de la API usando nuestro DUMMY DATA
  const contactData = DUMMY_CONTACT_DATA;
  const socialLinks = buildSocialLinks(contactData?.links_botones);

  return (
    // Reemplaza .section
    <section id="contact" className="w-full bg-[var(--color-bg-alt)] py-[60px] px-5 md:py-[80px] md:px-8">
      
      {/* Reemplaza .container */}
      <div className="mx-auto max-w-[800px] flex flex-col items-center gap-[24px] text-center md:gap-[32px]">
        
        {/* Reemplaza .contactText */}
        <div>
          <h2 className="mb-4 text-[1.5rem] font-bold text-[var(--color-text)] md:text-[2rem]">
            Contacto
          </h2>
          <p className="m-0 text-[0.9rem] leading-[1.8] text-[var(--color-text)] md:text-[0.95rem]">
            ¿Tienes alguna pregunta? ¡No dudes en ponerte en contacto con
            nosotros!
          </p>
        </div>

        {/* Reemplaza .manualContact */}
        <div className="flex w-full flex-col items-center gap-[12px]">
          
          {/* Reemplaza .profileImage (Con Hover Effects y Next/Image) */}
          <div className="relative mb-4 md:mb-5 h-[140px] w-[140px] md:h-[180px] md:w-[180px] overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_12px_32px_rgba(196,30,58,0.2)]">
            <Image
              src={contactData?.foto_url || "https://via.placeholder.com/150"}
              alt={contactData?.nombre || "Contacto"}
              fill
              className="object-cover"
            />
          </div>

          {/* Reemplaza .personName y .phone */}
          <h2 className="m-0 text-[1.5rem] font-semibold text-[var(--color-text)]">
            {contactData?.nombre}
          </h2>
          <p className="m-0 text-[1.1rem] text-[var(--color-text)]">
            Teléfono: {contactData?.telefono || "-"}
          </p>

          {/* Reemplaza .buttonGroup y .socialButton */}
          <div className="mt-2 flex justify-center gap-[16px] md:gap-[24px]">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                // Combinamos las clases base del botón con el color dinámico
                className={`flex h-[48px] w-[48px] md:h-[56px] md:w-[56px] items-center justify-center rounded-full text-[1.5rem] md:text-[1.8rem] no-underline shadow-sm transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] ${getSocialButtonClass(link.key)}`}
                aria-label={link.key}
                title={link.key}
              >
                {getSocialIcon(link.key)}
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};