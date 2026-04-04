"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goToIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, images.length - 1));
    setCurrentIndex(nextIndex);
  };

  const goToPrev = () => goToIndex(currentIndex - 1);
  const goToNext = () => goToIndex(currentIndex + 1);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = touchStartX - touchEndX;

    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setTouchStartX(null);
  };

  if (!images.length) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ aspectRatio: "16 / 12" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={`${img}-${index}`} className="h-full min-w-full">
              <img
                src={img}
                alt={`${title} - ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-900/70 p-2 text-white shadow-lg backdrop-blur transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Imagen anterior"
            onClick={goToPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-900/70 p-2 text-white shadow-lg backdrop-blur transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Imagen siguiente"
            onClick={goToNext}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {currentIndex + 1} / {images.length}
          </div>

          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                aria-label={`Ir a imagen ${index + 1}`}
                onClick={() => goToIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === currentIndex ? "w-5 bg-white" : "w-2.5 bg-white/55 hover:bg-white/75"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
