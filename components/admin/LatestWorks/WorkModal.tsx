"use client";

import { useEffect, useState } from "react";
import { XLg } from "react-bootstrap-icons";
import type { IWork } from "@/types/work";
import type { WorkFormPayload } from "@/lib/workService";
import { FileUploadArea } from "./FileUploadArea";
import { RatingSelector } from "./RatingSelector";
import { ImageCarousel } from "./ImageCarousel";

interface WorkModalProps {
  isOpen: boolean;
  work: IWork | null;
  onClose: () => void;
  onSubmit: (payload: WorkFormPayload) => Promise<void>;
}

export const WorkModal = ({
  isOpen,
  work,
  onClose,
  onSubmit,
}: WorkModalProps) => {
  const isEditMode = Boolean(work);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (work) {
      setTitulo(work.titulo);
      setDescripcion(work.descripcion);
      setComentarios(work.comentarios || "");
      setPuntuacion(work.puntuacion || 0);
    } else {
      setTitulo("");
      setDescripcion("");
      setComentarios("");
      setPuntuacion(0);
    }

    setImagenes([]);
    setError("");
  }, [isOpen, work]);

  if (!isOpen) return null;

  const currentImages = work?.imagenes.map((image) => image.url) || [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!titulo.trim()) {
      setError("El título es requerido.");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción es requerida.");
      return;
    }

    if (!isEditMode && imagenes.length === 0) {
      setError("Debes seleccionar al menos una imagen.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        comentarios: comentarios.trim() || undefined,
        imagenes,
        puntuacion: puntuacion > 0 ? puntuacion : undefined,
      });

      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el trabajo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6 md:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">
              {isEditMode ? "Editar trabajo" : "Nuevo trabajo"}
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900 md:text-2xl">
              {isEditMode ? "Modificar publicación" : "Agregar trabajo"}
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

        <div className="grid gap-6 overflow-y-auto px-5 py-5 md:px-6 md:py-6 lg:grid-cols-[minmax(320px,420px)_1fr]">
          <div className="space-y-4">
            {currentImages.length > 0 ? (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Imágenes actuales
                  </p>
                  <p className="text-xs text-slate-500">
                    Si no cargás nuevas imágenes, se mantienen las existentes.
                  </p>
                </div>
                <ImageCarousel
                  images={currentImages}
                  title={work?.titulo || "Trabajo"}
                />
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Todavía no hay imágenes cargadas.
              </div>
            )}

            <FileUploadArea
              value={imagenes}
              onChange={setImagenes}
              disabled={isSubmitting}
              label={isEditMode ? "Reemplazar imágenes" : "Imágenes"}
              note={
                isEditMode
                  ? "Subí nuevas imágenes solo si querés reemplazar las actuales."
                  : undefined
              }
            />
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Título *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ej: Estructura perimetral"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Descripción *
                </label>
                <textarea
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  placeholder="Describe el trabajo, materiales o alcance..."
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Comentarios (opcional)
                </label>
                <textarea
                  value={comentarios}
                  onChange={(event) => setComentarios(event.target.value)}
                  placeholder="Notas internas o comentarios visibles en el sitio..."
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div className="md:col-span-2">
                <RatingSelector
                  value={puntuacion}
                  onChange={setPuntuacion}
                  label="Puntuación"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Guardando..."
                  : isEditMode
                    ? "Actualizar trabajo"
                    : "Crear trabajo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
