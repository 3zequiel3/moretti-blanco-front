"use client";

import { useEffect, useRef, useState } from "react";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import { fetchAPI } from "@/lib/apiClient";
import type { IBanner } from "@/types/banner";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bannerToDelete: IBanner | null;
  onSuccess: () => void; // Para recargar la tabla
}

export const DeleteBanner = ({
  isOpen,
  onClose,
  bannerToDelete,
  onSuccess,
}: DeleteModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
      setError(null);
    } else {
      dialog.close();
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    setIsLoading(true);
    setError(null);

    try {
      // Nuestro apiClient maneja las respuestas 204 (No Content) automáticamente
      await fetchAPI(`/carrousel/${bannerToDelete.id}`, { method: "DELETE" });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al intentar eliminar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed left-1/2 top-1/2 m-0 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-[rgba(15,23,42,0.5)] backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleFill className="text-2xl text-red-600" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">
          ¿Eliminar Banner?
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Estás a punto de eliminar el banner ID{" "}
          <strong>#{bannerToDelete?.id}</strong>. Esta acción no se puede
          deshacer y el archivo se borrará permanentemente.
        </p>

        {error && (
          <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
        )}

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </dialog>
  );
};
