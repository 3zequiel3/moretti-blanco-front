// components/ui/ImageSlider.tsx
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

type ImageSliderProps = {
  images: { url: string }[];
  altText: string;
};

export function ImageSlider({ images, altText }: ImageSliderProps) {
  if (!images || images.length === 0) return null;

  return (
    // Agregamos group para poder controlar la visibilidad de las flechas con hover si quisieras,
    // y aplicamos los selectores arbitrarios de Tailwind v4 para achicar y acomodar las flechas.
    <div
      className="relative w-full h-full group
                    [&_.swiper-button-prev]:left-[10px] [&_.swiper-button-next]:right-[10px]
                    [&_.swiper-button-prev::after]:text-[1rem] [&_.swiper-button-prev::after]:font-bold
                    [&_.swiper-button-next::after]:text-[1rem] [&_.swiper-button-next::after]:font-bold"
    >
      <Swiper
        modules={[Navigation]}
        navigation={images.length > 1} // Solo activa flechas si hay más de 1 imagen
        loop={images.length > 1}
        className="w-full h-full"
        style={
          {
            "--swiper-navigation-color": "#ffffff",
          } as React.CSSProperties
        }
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="relative w-full h-full bg-neutral-100"
          >
            <Image
              src={image.url}
              alt={`${altText} - Imagen ${index + 1}`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              // Como estas imágenes están más abajo en la página, NO usamos priority.
              // Dejamos que Next.js aplique lazy-loading por defecto para mejorar el LCP inicial.
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
