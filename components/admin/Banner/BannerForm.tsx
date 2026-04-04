"use client";

import { useState } from "react";
import { FileSelectorBanner } from "./FileSelectorBanner";
import { fetchAPI } from "@/lib/apiClient";
import type { IBanner } from "@/types/banner";

interface BannerFormProps {
  onSuccess?: () => void;
  initialData?: IBanner | null;
}

export const BannerForm = ({ onSuccess, initialData }: BannerFormProps) => {
  // Si hay initialData, pre-cargamos los estados
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState(
    initialData?.descripcion || "",
  );
  const [orden, setOrden] = useState(initialData?.orden || 1);
  const [isActive, setIsActive] = useState(
    initialData ? initialData.is_active : true,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Si es creación y no hay archivo, bloqueamos. Si es edición, el archivo es opcional.
    if (!initialData && !selectedFile) {
      return setFeedback({
        type: "error",
        msg: "Por favor selecciona una imagen.",
      });
    }
    if (!descripcion.trim()) {
      return setFeedback({
        type: "error",
        msg: "Por favor ingresa una descripción.",
      });
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }
      formDataToSend.append("descripcion", descripcion);
      formDataToSend.append("orden", orden.toString());
      formDataToSend.append("is_active", String(isActive)); // Por si tu backend permite cambiar estado aquí

      // Decidimos la ruta y el método según el modo
      const endpoint = initialData
        ? `/carrousel/${initialData.id}`
        : "/carrousel/";
      const method = initialData ? "PATCH" : "POST"; // Ajusta a PATCH si tu backend lo requiere

      await fetchAPI<IBanner>(endpoint, {
        method,
        body: formDataToSend,
      });

      setFeedback({
        type: "success",
        msg: initialData ? "Slide actualizado" : "Slide creado",
      });
      onSuccess?.();
    } catch (error: any) {
      setFeedback({
        type: "error",
        msg: error.message || "Error al procesar la solicitud.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Imagen:</label>
        {/* Opcional: Podrías pasarle initialData?.image_url al selector para que muestre la imagen actual */}
        <FileSelectorBanner onImageSelect={setSelectedFile} />
        {initialData && !selectedFile && (
          <p className="text-xs text-gray-500">
            * Deja esto vacío si quieres mantener la imagen actual.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          Descripción:
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="min-h-[110px] w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#be123c] focus:shadow-[0_0_0_3px_rgba(190,18,60,0.16)]"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Orden:</label>
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(parseInt(e.target.value) || 1)}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#be123c]"
          />
        </div>

        {/* Switch básico de Estado para Edición */}
        {initialData && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Estado:
            </label>
            <div className="flex h-[46px] items-center">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 accent-[#be123c]"
                />
                <span className="text-sm">
                  {isActive ? "Activo" : "Oculto"}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`rounded-lg p-3 text-sm font-medium ${feedback.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}
        >
          {feedback.msg}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 min-h-[44px] rounded-xl bg-gradient-to-br from-[#be123c] to-[#9f1239] px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-70"
      >
        {isLoading
          ? "Guardando..."
          : initialData
            ? "Actualizar Slide"
            : "Agregar Slide"}
      </button>
    </form>
  );
};
