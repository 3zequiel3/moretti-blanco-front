// components/public/Carrousel.tsx
'use client' // Obligatorio porque Swiper necesita el navegador

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";


import type { IBanner } from "@/types/banner";

type CarrouselProps = {
  slides: IBanner[];
};

export function Carrousel({ slides }: CarrouselProps) {
  // Filtramos por si acaso quieres asegurarte de que solo pasen los activos
  // (ya que vi que agregaste "is_active" a tu array de prueba)
  const slidesActivos = slides.filter(slide => slide.is_active);

  if (!slidesActivos || slidesActivos.length === 0) return null;

  return (
    // Mantenemos tu contenedor con las medidas dinámicas de Tailwind
    <div className="relative w-full h-[clamp(260px,62vw,360px)] md:h-[clamp(320px,52vw,520px)] group">
      
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
        // Swiper usa variables CSS para los colores de sus flechas por defecto.
        // Aquí las forzamos a blanco y ajustamos un poco su tamaño.
        style={{
          "--swiper-navigation-color": "#ffffff",
          "--swiper-navigation-size": "28px",
        } as React.CSSProperties}
      >
        {slidesActivos.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            
            {/* Gradiente superpuesto (se mantiene intacto tu diseño de Tailwind) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-black/30 pointer-events-none z-10" />

            {/* Imagen optimizada de Next.js */}
            <Image
              src={slide.image_url}
              alt={slide.descripcion || "Banner de trabajo"}
              fill
              // LCP optimizado: solo la primera imagen se carga desesperadamente (priority)
              priority={index === 0} 
              className="object-cover z-0"
            />

            {/* Caja de texto centrada con Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/35 backdrop-blur-[2px] text-white rounded-[10px] text-center z-20 w-[min(92%,720px)] px-[clamp(10px,2vw,20px)] py-[clamp(14px,3vw,28px)]">
              <h2 className="m-0 font-medium leading-[1.35] drop-shadow-md text-[clamp(1rem,1.5vw,1.7rem)]">
                {slide.descripcion}
              </h2>
            </div>
            
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
}