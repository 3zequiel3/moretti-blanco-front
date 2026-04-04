"use client";

import { useRef, useState } from "react";

interface FileUploadAreaProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  label?: string;
  note?: string;
}

export const FileUploadArea = ({
  value,
  onChange,
  maxFiles = 10,
  disabled = false,
  label = "Imágenes",
  note,
}: FileUploadAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;

    const remainingSlots = maxFiles - value.length;
    const nextFiles = Array.from(files).slice(0, remainingSlots);
    const allFiles = [...value, ...nextFiles].slice(0, maxFiles);

    onChange(allFiles);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${dragActive ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 hover:border-rose-300 hover:bg-rose-50/60"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
          📁
        </div>
        <p className="text-sm font-semibold text-slate-700">
          Arrastrá imágenes aquí o hacé clic para seleccionar
        </p>
        <small className="text-xs text-slate-500">
          JPG, PNG, GIF, WebP • Máximo {maxFiles} imágenes
        </small>
        {note && <small className="text-xs text-slate-400">{note}</small>}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(event) => handleFiles(event.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-700">
            {value.length} imagen{value.length > 1 ? "es" : ""} seleccionada
            {value.length > 1 ? "s" : ""}
          </p>
          <div className="flex flex-col gap-2">
            {value.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <span className="min-w-0 flex-1 truncate text-slate-700">
                  {file.name}
                </span>
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
