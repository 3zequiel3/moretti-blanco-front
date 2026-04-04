"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface FileSelectorBannerProps {
  onImageSelect?: (file: File | null) => void;
}

export const FileSelectorBanner = ({ onImageSelect }: FileSelectorBannerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null); // Reemplaza a SweetAlert
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida (JPG, PNG, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es muy grande. El máximo permitido es 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setSelectedFile(file);
      onImageSelect?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    onImageSelect?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {!preview ? (
        <>
          <div
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ease-in-out ${
              isDragging
                ? "scale-[1.01] border-[#9f1239] bg-[rgba(190,18,60,0.12)]"
                : "border-[#be123c] bg-gradient-to-b from-[rgba(190,18,60,0.06)] to-[rgba(190,18,60,0.02)] hover:border-[#9f1239] hover:bg-[rgba(190,18,60,0.09)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2.5">
              <svg className="h-10 w-10 text-[#be123c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="m-0 text-base font-medium text-gray-800">
                Arrastra la imagen aquí o <span className="font-semibold text-[#be123c] underline hover:text-[#881337]">selecciona desde tu equipo</span>
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="hidden"
          />
        </>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center">
          <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-white">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          <div className="flex w-full flex-1 flex-col gap-1">
            <p className="m-0 break-words text-sm font-semibold text-gray-800">{selectedFile?.name}</p>
            <p className="m-0 text-xs text-gray-500">{(selectedFile ? selectedFile.size / 1024 / 1024 : 0).toFixed(2)} MB</p>
            <button type="button" className="mt-2 w-fit rounded-lg bg-[#be123c] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#9f1239]" onClick={handleRemove}>
              Cambiar imagen
            </button>
          </div>
        </div>
      )}
      
      {/* Mensaje de error nativo en lugar de SweetAlert */}
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
};