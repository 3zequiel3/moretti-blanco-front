"use client";

import { useState } from "react";

interface RatingSelectorProps {
  value: number;
  onChange: (rating: number) => void;
  label?: string;
  disabled?: boolean;
}

export const RatingSelector = ({
  value,
  onChange,
  label = "Puntuación",
  disabled = false,
}: RatingSelectorProps) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverValue || value) >= star;

          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-bold transition ${isFilled ? "border-amber-300 bg-amber-300 text-amber-700 shadow-sm" : "border-slate-200 bg-white text-slate-300 hover:border-amber-200 hover:text-amber-500"} ${disabled ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5"}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              title={`${star} estrella${star > 1 ? "s" : ""}`}
              aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          );
        })}
      </div>

      {value > 0 && (
        <small className="text-xs text-slate-500">{value} de 5 estrellas</small>
      )}
    </div>
  );
};
