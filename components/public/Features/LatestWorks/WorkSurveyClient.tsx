"use client";

import { useMemo, useState } from "react";
import { ImageCarousel } from "@/components/admin/LatestWorks/ImageCarousel";
import type { IWork } from "@/types/work";
import { submitWorkSurvey } from "@/lib/workService";

interface WorkSurveyClientProps {
  work: IWork;
}

export const WorkSurveyClient = ({ work }: WorkSurveyClientProps) => {
  const [puntuacion, setPuntuacion] = useState<number>(work.puntuacion || 0);
  const [comentarios, setComentarios] = useState(work.comentarios || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageUrls = useMemo(
    () => work.imagenes.map((img) => img.url),
    [work.imagenes],
  );

  const canSubmit = useMemo(() => {
    return puntuacion >= 1 && puntuacion <= 5 && comentarios.trim().length >= 3;
  }, [comentarios, puntuacion]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!canSubmit) {
      setError(
        "Completá una puntuación del 1 al 5 y un comentario de al menos 3 caracteres.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedWork = await submitWorkSurvey(work.id, {
        puntuacion,
        comentarios,
      });

      setPuntuacion(updatedWork.puntuacion || puntuacion);
      setComentarios(updatedWork.comentarios || comentarios);
      setSuccess("¡Gracias! Tu evaluación fue enviada correctamente.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar tu evaluación. Intentá nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(196,30,58,0.12),transparent_50%),radial-gradient(circle_at_100%_100%,rgba(97,107,122,0.16),transparent_45%),var(--color-bg)] px-4 py-10 text-[var(--color-text)] md:px-8 md:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-16 -left-10 h-52 w-52 rounded-full bg-[rgba(196,30,58,0.14)] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[rgba(71,85,105,0.18)] blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="rounded-[28px] border border-[var(--color-border)] bg-[linear-gradient(145deg,#ffffff_0%,#f3f6fa_90%)] p-4 shadow-[0_18px_42px_rgba(15,23,42,0.12)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary-hover)]">
            Encuesta de satisfacción
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-[var(--color-text)] md:text-4xl">
            {work.titulo}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-light)] md:text-[15px]">
            {work.descripcion}
          </p>

          <div className="mt-6 w-full max-w-[880px]">
            <ImageCarousel images={imageUrls} title={work.titulo} />
          </div>
        </article>

        <aside className="rounded-[28px] border border-[var(--color-border-strong)] bg-[linear-gradient(160deg,#ffffff_0%,#edf2f8_100%)] p-5 shadow-[0_20px_44px_rgba(15,23,42,0.13)] md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-hover)]">
            Tu opinión importa
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-[var(--color-text)] md:text-2xl">
            Evaluá este trabajo
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-light)]">
            Valorá el resultado y dejá un comentario breve para ayudarnos a
            mejorar cada proyecto.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-[var(--color-text)]">
                Puntuación
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPuntuacion(star)}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition ${star <= puntuacion ? "border-[#f5a623] bg-[#fff2d8] text-[#b86a00] shadow-[0_4px_14px_rgba(245,166,35,0.2)]" : "border-[var(--color-border)] bg-white text-[#94a3b8] hover:border-[var(--color-border-strong)] hover:text-[#64748b]"}`}
                    aria-label={`Seleccionar ${star} estrella${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="comentarios"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Comentarios
              </label>
              <textarea
                id="comentarios"
                value={comentarios}
                onChange={(event) => setComentarios(event.target.value)}
                placeholder="Contanos cómo fue tu experiencia con este trabajo..."
                rows={5}
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--color-text)] outline-none transition placeholder:text-[#94a3b8] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(196,30,58,0.16)]"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(120deg,var(--color-primary)_0%,var(--color-primary-hover)_100%)] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(196,30,58,0.34)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting ? "Enviando..." : "Enviar evaluación"}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
};
