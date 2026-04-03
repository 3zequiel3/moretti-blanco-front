import Image from "next/image";
import Link from "next/link";
const links = [
  { label: "Inicio", href: "/" },
  { label: "Quienes somos", href: "#about" },
  { label: "Ultimos trabajos", href: "#latest-works" },
  { label: "Contacto", href: "#contact" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--color-border)] bg-[color:var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-5 md:px-8">
        <div className="flex h-full items-center">
          <Link href="/">
            <Image
              src="/navbar/morettiblanco_logo.png"
              alt="Moretti Blanco"
              className="w-auto h-auto max-h-[50px] object-contain"
              width={665}
              height={600}
              priority
            />
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          {links.map((link) => {
            return (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-text-light)] transition-colors hover:text-[var(--color-primary-hover)]"
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
