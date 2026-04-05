// components/public/Carrousel.tsx
"use client"; // Obligatorio porque Swiper necesita el navegador

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import type { IBanner } from "@/types/banner";

type CarrouselProps = {
  slides: IBanner[];
};

export function Carrousel({ slides }: CarrouselProps) {
  const slidesActivos = slides.filter((slide) => slide.is_active);

  if (!slidesActivos || slidesActivos.length === 0) return null;

  return (
    <div className="group relative h-[clamp(320px,70vw,460px)] w-full border-b border-[var(--color-border)] md:h-[clamp(420px,60vw,620px)]">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
        style={
          {
            "--swiper-navigation-color": "#ffffff",
            "--swiper-navigation-size": "24px",
          } as React.CSSProperties
        }
      >
        {slidesActivos.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(95deg,rgba(2,6,23,0.74)_0%,rgba(2,6,23,0.35)_46%,rgba(2,6,23,0.62)_100%)]" />

            <Image
              src={slide.image_url}
              alt={slide.descripcion || "Banner de trabajo"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority={index === 0}
              className="object-cover z-0"
            />

            <div className="absolute bottom-6 left-5 z-20 w-[min(92%,760px)] rounded-[14px] border border-white/20 bg-[rgba(2,6,23,0.38)] px-4 py-4 text-white backdrop-blur-[3px] md:bottom-10 md:left-10 md:px-6 md:py-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f8b6c0] md:text-xs">
                Moretti & Blanco
              </p>
              <h2 className="m-0 text-[clamp(1.15rem,2.4vw,2rem)] font-semibold leading-[1.28] drop-shadow-md">
                {slide.descripcion}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
