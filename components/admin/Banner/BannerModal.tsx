"use client";

import { useEffect, useRef } from "react";
import { BannerForm } from "./BannerForm";
import { XLg } from "react-bootstrap-icons";
import type { IBanner } from "@/types/banner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Si pasamos un banner, estamos editando. Si es null, estamos creando.
  bannerToEdit?: IBanner | null;
  onSuccess: () => void;
}

export const BannerModal = ({
  isOpen,
  onClose,
  bannerToEdit,
  onSuccess,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed left-1/2 top-1/2 m-0 w-[min(760px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-[rgba(15,23,42,0.45)] backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <h2 className="m-0 text-[1.75rem] font-bold text-gray-900">
          {bannerToEdit ? "Editar Slide" : "Agregar Nuevo Slide"}
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <XLg size={20} />
        </button>
      </div>

      <div className="max-h-[min(72vh,820px)] overflow-y-auto px-6 py-6">
        {/* Le pasamos el banner al formulario para que pre-cargue los datos */}
        <BannerForm onSuccess={onSuccess} initialData={bannerToEdit} />
      </div>
    </dialog>
  );
};
