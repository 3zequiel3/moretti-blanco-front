// components/public/WorkCard/WorkCard.tsx
import { ImageSlider } from "@/components/ui/ImageSlider";
import type { ImageData } from "@/types/work"; // Importamos el tipo de imagen

type WorkCardProps = {
  titulo: string;
  descripcion: string;
  imagenes: ImageData[];
  comentarios?: string;
};

export const WorkCard = ({
  titulo,
  descripcion,
  imagenes,
  comentarios,
}: WorkCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
      
      <div className="relative w-full h-[220px] md:h-[260px] bg-[#f5f5f5] overflow-hidden">
        {/* Pasamos las imágenes y el título (para el alt) al Slider */}
        <ImageSlider images={imagenes} altText={titulo} />
      </div>

      <div className="p-4 md:p-5">
        <h3 className="mb-2 text-[1rem] md:text-[1.1rem] font-semibold text-[var(--color-text)]">
          {titulo}
        </h3>
        <p className="mb-3 text-[0.85rem] leading-[1.5] text-[var(--color-text-light)]">
          {descripcion}
        </p>
        
        {/* Solo mostramos la sección de comentarios si existen */}
        {comentarios && (
          <p className="m-0 mt-3 border-t border-[var(--color-border)] pt-3 text-[0.8rem] leading-[1.6] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">Comentarios:</strong> {comentarios}
          </p>
        )}
      </div>
      
    </div>
  );
};