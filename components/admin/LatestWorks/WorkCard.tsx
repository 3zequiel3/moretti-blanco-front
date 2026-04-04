"use client";

import type { IWork } from "@/types/work";
import { ActionMenu, type ActionMenuItem } from "./ActionMenu";
import { ImageCarousel } from "./ImageCarousel";

interface WorkCardProps {
  work: IWork;
  onEdit?: (work: IWork) => void;
  onView?: (work: IWork) => void;
  onToggleActive?: (id: number, action: "activate" | "deactivate") => void;
}

export const WorkCard = ({
  work,
  onEdit,
  onView,
  onToggleActive,
}: WorkCardProps) => {
  const isActive = work.is_active;
  const imageUrls = work.imagenes.map((image) => image.url);

  const actionItems: ActionMenuItem[] = [
    {
      label: "Editar",
      icon: "✎",
      onClick: () => onEdit?.(work),
    },
    {
      label: "Ver",
      icon: "👁",
      onClick: () => onView?.(work),
    },
    {
      label: work.is_active ? "Desactivar" : "Activar",
      icon: work.is_active ? "✕" : "✓",
      onClick: () =>
        onToggleActive?.(work.id, work.is_active ? "deactivate" : "activate"),
      variant: work.is_active ? "danger" : "default",
    },
  ];

  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 ${isActive ? "border-slate-200 hover:-translate-y-1 hover:shadow-lg" : "border-dashed border-slate-300 bg-slate-50/80 grayscale"}`}
    >
      <div className="relative">
        <ImageCarousel images={imageUrls} title={work.titulo} />
        {!isActive && (
          <>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/40" />
            <div className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full border border-slate-300 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">
              No visible en portada
            </div>
          </>
        )}
        <div className="absolute right-3 top-3 z-10">
          <ActionMenu items={actionItems} />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-base font-bold leading-snug md:text-lg ${isActive ? "text-slate-900" : "text-slate-600"}`}
          >
            {work.titulo}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
          >
            {isActive ? "Activo" : "Inactivo"}
          </span>
        </div>

        <p
          className={`text-sm leading-6 ${isActive ? "text-slate-600" : "text-slate-500"}`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {work.descripcion}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <small
            className={`text-xs font-medium ${isActive ? "text-slate-400" : "text-slate-500"}`}
          >
            {new Date(work.created_at).toLocaleDateString("es-AR")}
          </small>

          <div
            className="flex items-center gap-1 text-amber-400"
            aria-label={`Puntuación ${work.puntuacion} de 5`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= work.puntuacion ? "text-amber-400" : "text-slate-200"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
