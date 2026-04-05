"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusCircle } from "react-bootstrap-icons";
import type { IWork } from "@/types/work";
import {
  activateWork,
  createWork,
  deactivateWork,
  getAllWorks,
  type WorkFormPayload,
  updateWork,
} from "@/lib/workService";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";
import { ViewWorkModal } from "./ViewWorkModal";

type WorksFilter = "all" | "active" | "inactive";

export const LatestWorksAdmin = () => {
  const [filter, setFilter] = useState<WorksFilter>("all");
  const [allWorks, setAllWorks] = useState<IWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<IWork | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const loadWorks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllWorks();
      setAllWorks(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los trabajos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const works = useMemo(() => {
    if (filter === "active") {
      return allWorks.filter((work) => work.is_active);
    }

    if (filter === "inactive") {
      return allWorks.filter((work) => !work.is_active);
    }

    return allWorks;
  }, [allWorks, filter]);

  const activeCount = useMemo(
    () => allWorks.filter((work) => work.is_active).length,
    [allWorks],
  );

  const inactiveCount = useMemo(
    () => allWorks.filter((work) => !work.is_active).length,
    [allWorks],
  );

  const orderedWorks = useMemo(
    () => [...works].sort((a, b) => Number(b.is_active) - Number(a.is_active)),
    [works],
  );

  const handleOpenCreate = () => {
    setSelectedWork(null);
    setIsViewOpen(false);
    setIsFormOpen(true);
  };

  const handleEdit = (work: IWork) => {
    setSelectedWork(work);
    setIsViewOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (work: IWork) => {
    setSelectedWork(work);
    setIsFormOpen(false);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedWork(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedWork(null);
  };

  const handleToggleActive = async (
    workId: number,
    action: "activate" | "deactivate",
  ) => {
    setError(null);

    try {
      if (action === "activate") {
        await activateWork(workId);
      } else {
        await deactivateWork(workId);
      }

      await loadWorks();
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "No se pudo cambiar el estado del trabajo.",
      );
    }
  };

  const handleSubmitWork = async (payload: WorkFormPayload) => {
    setError(null);

    try {
      if (selectedWork) {
        await updateWork(selectedWork.id, payload);
      } else {
        await createWork(payload);
      }

      await loadWorks();
      setSelectedWork(null);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el trabajo.";
      setError(message);
      throw submitError instanceof Error ? submitError : new Error(message);
    }
  };

  const hasWorks = works.length > 0;

  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-2 pb-8 pt-6 md:px-4 md:pt-8">
      <header className="w-full overflow-hidden rounded-[26px] border border-[#e6e7eb] bg-gradient-to-r from-white via-[#fff7f8] to-[#fff1f4] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7 md:py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c41e3a]">
              Administración
            </p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-[#1f2937] md:text-[34px]">
              Últimos trabajos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] md:text-[15px]">
              Gestioná proyectos destacados, imágenes, rating y estado de
              publicación.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a01830] md:self-auto"
          >
            <PlusCircle size={18} /> Agregar trabajo
          </button>
        </div>
      </header>

      <div className="inline-flex w-fit max-w-full flex-wrap gap-2 justify-self-start rounded-[20px] border border-[#e6e7eb] bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${filter === "all" ? "bg-[#c41e3a] text-white shadow-sm" : "bg-[#f2f4f8] text-[#4b5563] hover:bg-[#e9edf4]"}`}
        >
          Todos ({allWorks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${filter === "active" ? "bg-[#c41e3a] text-white shadow-sm" : "bg-[#f2f4f8] text-[#4b5563] hover:bg-[#e9edf4]"}`}
        >
          Activos ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("inactive")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${filter === "inactive" ? "bg-[#c41e3a] text-white shadow-sm" : "bg-[#f2f4f8] text-[#4b5563] hover:bg-[#e9edf4]"}`}
        >
          Inactivos ({inactiveCount})
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Cargando trabajos...
        </div>
      ) : !hasWorks ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {filter === "active"
              ? "No hay trabajos activos. Activá al menos uno para comenzar."
              : "No hay trabajos cargados todavía. Agregá el primero para empezar."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orderedWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onEdit={handleEdit}
              onView={handleView}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      <WorkModal
        isOpen={isFormOpen}
        work={selectedWork}
        onClose={handleCloseForm}
        onSubmit={handleSubmitWork}
      />

      <ViewWorkModal
        isOpen={isViewOpen}
        work={selectedWork}
        onClose={handleCloseView}
      />
    </section>
  );
};
