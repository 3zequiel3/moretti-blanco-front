"use client";

import { CameraFill } from "react-bootstrap-icons";

type ContactPhotoProps = {
  preview: string | null;
  isLoading: boolean;
  onEditClick: () => void;
  title?: string;
};

export function ContactPhoto({
  preview,
  isLoading,
  onEditClick,
  title = "Foto de contacto",
}: ContactPhotoProps) {
  return (
    <div className="grid justify-items-center gap-4">
      <h2 className="text-lg font-semibold text-[#1f2937]">{title}</h2>

      <div className="relative grid aspect-square w-[min(260px,70vw)] place-items-center overflow-visible rounded-full border-2 border-[#e6e7eb] bg-[#f8f9fb]">
        <div className="grid h-full w-full place-items-center overflow-hidden rounded-full">
          {preview ? (
            <img
              src={preview}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-semibold text-[#6b7280]">
              Sin foto
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onEditClick}
          disabled={isLoading}
          title="Editar foto"
          className="absolute bottom-0 right-0 grid h-12 w-12 place-items-center rounded-full border-3 border-white bg-[#c41e3a] text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CameraFill size={18} />
        </button>
      </div>
    </div>
  );
}
