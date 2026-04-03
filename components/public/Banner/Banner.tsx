// components/public/Banner.tsx
import { Carrousel } from "./Carrousel";
import type { IBanner } from "@/types/banner";

// Array hardcodeado para probar.
const slidesDePrueba: IBanner[] = [
  { 
    id: 1, 
    image_url: "/carrousel_img/carrousel1.jpg", 
    descripcion: "Estructuras metálicas de alta resistencia",
    orden: 1,
    is_active: true
  },
  { 
    id: 2, 
    image_url: "/carrousel_img/carrousel2.jpg", 
    descripcion: "Diseño y precisión en cada trabajo",
    orden: 2,
    is_active: true
  },
  { 
    id: 3, 
    image_url: "/carrousel_img/carrousel3.jpg", 
    descripcion: "Soluciones industriales a medida",
    orden: 3,
    is_active: true
  },
];

export const Banner = () => {
  return (
    <section>
      <Carrousel slides={slidesDePrueba} />
    </section>
  );
};