"use client";

import type { IWork } from "@/types/work";
import { ImageCarousel } from "./ImageCarousel";
import { XLg } from "react-bootstrap-icons";

interface ViewWorkModalProps {
  isOpen: boolean;
  work: IWork | null;
  onClose: () => void;
}

export const ViewWorkModal = ({
  isOpen,
  work,
  onClose,
}: ViewWorkModalProps) => {
  if (!isOpen || !work) return null;

  const imageUrls = work.imagenes.map((image) => image.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6 md:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">
              Vista previa
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900 md:text-2xl">
              {work.titulo}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <XLg size={18} />
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto px-5 py-5 md:px-6 md:py-6 lg:grid-cols-[minmax(320px,1fr)_1fr]">
          <div className="space-y-4">
            <ImageCarousel images={imageUrls} title={work.titulo} />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Estado
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${work.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                >
                  {work.is_active ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= work.puntuacion
                        ? "text-amber-400"
                        : "text-slate-200"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-700">
                  {work.puntuacion}/5
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Descripción
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {work.descripcion}
              </p>
            </div>

            {work.comentarios && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Comentarios
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {work.comentarios}
                </p>
              </div>
            )}

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Creado
                </p>
                <p className="mt-1 font-medium text-slate-700">
                  {new Date(work.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Actualizado
                </p>
                <p className="mt-1 font-medium text-slate-700">
                  {new Date(work.updated_at).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
