// components/public/Footer.tsx
import { CcCircle } from "react-bootstrap-icons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto w-full bg-[#2d2d2d] px-[20px] py-[24px] md:px-[32px] md:py-[32px]">
      <div className="mx-auto flex max-w-[1100px] items-center justify-center gap-[6px] text-center md:gap-[8px]">
        
        <CcCircle className="shrink-0 text-[1rem] text-white md:text-[1.2rem]" />
        
        <p className="m-0 text-[0.85rem] leading-[1.6] text-white md:text-[0.9rem]">
          {currentYear} Moretti & Blanco. Todos los derechos reservados.
        </p>
        
      </div>
    </footer>
  );
};