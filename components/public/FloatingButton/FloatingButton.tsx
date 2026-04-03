// components/public/FloatingButton.tsx
import { Whatsapp } from "react-bootstrap-icons";

// Simulamos los datos que luego vendrán de FastAPI
const DUMMY_WHATSAPP_LINK = "https://wa.me/1234567890"; 

export const FloatingButton = () => {
  return (
    <a
      href={DUMMY_WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar presupuesto por WhatsApp"
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