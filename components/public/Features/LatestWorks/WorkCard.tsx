// components/public/WorkCard/WorkCard.tsx
import { ImageSlider } from "@/components/ui/ImageSlider";
import type { ImageData } from "@/types/work"; // Importamos el tipo de imagen

type WorkCardProps = {
  titulo: string;
  descripcion: string;
  imagenes: ImageData[];
  comentarios?: string;
  puntuacion?: number;
};

export const WorkCard = ({
  titulo,
  descripcion,
  imagenes,
  comentarios,
  puntuacion = 0,
}: WorkCardProps) => {
  const clampedRating = Math.max(0, Math.min(5, Math.round(puntuacion)));

  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
      <div className="relative h-[220px] w-full overflow-hidden bg-[#d8dde8] md:h-[258px]">
        <ImageSlider images={imagenes} altText={titulo} />
      </div>

      <div className="p-4 md:p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-[1.05rem] font-semibold text-[var(--color-text)] md:text-[1.15rem]">
            {titulo}
          </h3>

          <div
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#f7d8a2] bg-[#fff8ea] px-2.5 py-1"
            aria-label={`Puntuación ${clampedRating} de 5`}
          >
            <div className="flex items-center gap-0.5 text-[12px] leading-none">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= clampedRating ? "text-[#f5a623]" : "text-[#d1d5db]"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[11px] font-semibold text-[#a86b00]">
              {clampedRating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="mb-3 text-[0.88rem] leading-[1.6] text-[var(--color-text-light)]">
          {descripcion}
        </p>

        {comentarios && (
          <p className="m-0 mt-3 border-t border-[var(--color-border)] pt-3 text-[0.82rem] leading-[1.65] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">
              Comentarios:
            </strong>{" "}
            {comentarios}
          </p>
        )}
      </div>
    </div>
  );
};
