// components/public/Contact.tsx
import Image from "next/image";
import { Whatsapp, Instagram, Facebook, Linkedin } from "react-bootstrap-icons";
import { fetchAPIServer } from "@/lib/apiClient.server";
import type { IContactData } from "@/types/contact";

const DUMMY_CONTACT_DATA: IContactData[] = [
  {
    id: 1,
    nombre: "Pablo Moretti",
    cargo: "Asesor comercial",
    telefono: "+54 9 261 123 4567",
    foto_url: "/contact/contact.jpg",
    links_botones: {
      whatsapp: "https://wa.me/1234567890",
      instagram: "https://instagram.com/morettiblanco",
      facebook: "https://facebook.com/morettiblanco",
      linkedin: "https://www.linkedin.com/company/morettiblanco",
    },
  },
];

type SocialConfig = {
  key: string;
  href: string;
};

const normalizeContactPhotoUrl = (photoUrl: string | null): string => {
  if (!photoUrl) {
    return "/contact/contact.jpg";
  }

  if (photoUrl.startsWith("/")) {
    return photoUrl;
  }

  try {
    const parsed = new URL(photoUrl);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `/api/backend${parsed.pathname}${parsed.search}`;
    }

    // Para Railway S3 privado usamos URLs presignadas absolutas.
    return photoUrl;
  } catch {
    // Si no es URL valida, usamos fallback por seguridad visual.
  }

  return "/contact/contact.jpg";
};

const normalizeContact = (contact: IContactData): IContactData => ({
  ...contact,
  cargo: contact.cargo || null,
  foto_url: normalizeContactPhotoUrl(contact.foto_url),
  links_botones: contact.links_botones ?? {},
});

const getContactDataWithFallback = async (): Promise<IContactData[]> => {
  try {
    const list = await fetchAPIServer<IContactData[]>("/contacto/list");
    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeContact);
    }

    const single = await fetchAPIServer<IContactData | null>("/contacto");
    if (single) {
      return [normalizeContact(single)];
    }

    return DUMMY_CONTACT_DATA;
  } catch {
    return DUMMY_CONTACT_DATA;
  }
};

// 2. Helpers (Se mantienen igual, solo adaptamos las clases)
const buildSocialLinks = (
  links: Record<string, string> | undefined,
): SocialConfig[] => {
  if (!links) return [];

  const isSocialKey = (key: string) => {
    const normalized = key.toLowerCase().trim();
    return (
      normalized.includes("whatsapp") ||
      normalized.includes("instagram") ||
      normalized.includes("facebook") ||
      normalized.includes("linkedin") ||
      normalized.includes("linkledin")
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

const getSocialIcon = (key: string) => {
  const normalized = key.toLowerCase().trim();
  if (normalized.includes("whatsapp")) return <Whatsapp />;
  if (normalized.includes("instagram")) return <Instagram />;
  if (normalized.includes("facebook")) return <Facebook />;
  if (normalized.includes("linkedin") || normalized.includes("linkledin")) {
    return <Linkedin />;
  }
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
  if (normalized.includes("linkedin") || normalized.includes("linkledin")) {
    return "bg-[#0A66C2] text-white";
  }
  return "bg-[var(--color-primary-hover)] text-white"; // Genérico
};

export const Contact = async () => {
  const contactData = await getContactDataWithFallback();

  return (
    <section
      id="contact"
      className="w-full bg-[radial-gradient(circle_at_0%_0%,rgba(196,30,58,0.12),transparent_50%),radial-gradient(circle_at_100%_100%,rgba(97,107,122,0.18),transparent_44%),var(--color-bg)] px-5 py-[72px] md:px-8 md:py-[96px]"
    >
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-8">
        <div className="max-w-[760px] text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary-hover)]">
            Contacto
          </p>
          <h2 className="mb-4 text-[1.75rem] font-bold leading-tight text-[var(--color-text)] md:text-[2.25rem]">
            Contacto
          </h2>
          <p className="m-0 text-[0.95rem] leading-[1.85] text-[var(--color-text-light)] md:text-[1rem]">
            Elegí la persona indicada para tu consulta y coordiná tu proyecto.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
          {contactData.map((contact) => {
            const socialLinks = buildSocialLinks(contact.links_botones);

            return (
              <article
                key={contact.id}
                className="group relative flex min-h-[490px] w-[min(86vw,325px)] overflow-hidden rounded-[22px] border border-[var(--color-border-strong)] bg-[linear-gradient(145deg,#ffffff_0%,#f2f4f8_85%)] px-6 py-7 shadow-[0_14px_40px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.18)] md:min-h-[520px]"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[rgba(196,30,58,0.12)] blur-2xl" />

                <div className="flex h-full w-full flex-col items-center text-center">
                  <div className="relative mt-2 h-[160px] w-[160px] overflow-hidden rounded-full border-2 border-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] md:h-[176px] md:w-[176px]">
                    <Image
                      src={contact.foto_url || "/contact/contact.jpg"}
                      alt={contact.nombre || "Contacto"}
                      fill
                      sizes="(max-width: 768px) 160px, 176px"
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-[1.95rem] font-semibold text-[var(--color-text)]">
                      {contact.nombre}
                    </h3>
                    {contact.cargo && (
                      <p className="mt-2 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-hover)]">
                        {contact.cargo}
                      </p>
                    )}
                    <p className="mt-3 text-[1rem] text-[var(--color-text-light)]">
                      Teléfono: {contact.telefono || "-"}
                    </p>
                  </div>

                  <div className="mt-auto flex w-full flex-wrap items-center justify-center gap-2.5 border-t border-[var(--color-border)] pt-5">
                    {socialLinks.map((link) => (
                      <a
                        key={`${contact.id}-${link.key}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex h-[44px] w-[44px] items-center justify-center rounded-full text-[1.3rem] no-underline shadow-sm transition duration-200 hover:scale-105 hover:shadow-[0_6px_16px_rgba(0,0,0,0.17)] ${getSocialButtonClass(link.key)}`}
                        aria-label={link.key}
                        title={link.key}
                      >
                        {getSocialIcon(link.key)}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {contactData.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white/70 px-5 py-8 text-center text-sm text-[var(--color-text-light)]">
            No hay datos de contacto para mostrar en este momento.
          </div>
        )}
      </div>
    </section>
  );
};
