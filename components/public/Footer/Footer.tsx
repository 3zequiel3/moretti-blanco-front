// components/public/Footer.tsx
import { CcCircle } from "react-bootstrap-icons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-[rgba(148,163,184,0.3)] bg-[#0f172a] px-[20px] py-[24px] md:px-[32px] md:py-[30px]">
      <div className="mx-auto flex max-w-[1120px] items-center justify-center gap-[7px] text-center md:gap-[8px]">
        <CcCircle className="shrink-0 text-[1rem] text-[#f8b6c0] md:text-[1.2rem]" />

        <p className="m-0 text-[0.84rem] leading-[1.6] text-[#dbe2ee] md:text-[0.9rem]">
          {currentYear} Moretti & Blanco. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
