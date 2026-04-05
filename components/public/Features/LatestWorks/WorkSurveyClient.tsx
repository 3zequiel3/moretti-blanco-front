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
    <section className="relative min-h-screen overflow-hidden bg-[#0f1218] px-4 py-10 text-slate-100 md:px-8 md:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#c41e3a]/35 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#1f2937]/70 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_45%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="rounded-[28px] border border-white/15 bg-[#1a202b]/85 p-4 shadow-[0_30px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f59aa9]">
            Encuesta de satisfacción
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-white md:text-4xl">
            {work.titulo}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-[15px]">
            {work.descripcion}
          </p>

          <div className="mt-6 w-full max-w-[880px]">
            <ImageCarousel images={imageUrls} title={work.titulo} />
          </div>
        </article>

        <aside className="rounded-[28px] border border-[#f6bac3]/30 bg-[linear-gradient(180deg,#1a202bcc_0%,#11151ecf_100%)] p-5 shadow-[0_26px_56px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6bac3]">
            Tu opinión importa
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-white md:text-2xl">
            Evaluá este trabajo
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Valorá el resultado y dejá un comentario breve para ayudarnos a
            mejorar cada proyecto.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-100">
                Puntuación
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPuntuacion(star)}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition ${star <= puntuacion ? "border-[#f5a623] bg-[#f5a623] text-[#241702]" : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:text-white"}`}
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
                className="text-sm font-semibold text-slate-100"
              >
                Comentarios
              </label>
              <textarea
                id="comentarios"
                value={comentarios}
                onChange={(event) => setComentarios(event.target.value)}
                placeholder="Contanos cómo fue tu experiencia con este trabajo..."
                rows={5}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-400 focus:border-[#f6bac3] focus:ring-4 focus:ring-[#c41e3a]/30"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(120deg,#c41e3a_0%,#9d1630_100%)] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(196,30,58,0.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting ? "Enviando..." : "Enviar evaluación"}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
};
