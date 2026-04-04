"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/apiClient";
import type { IBanner } from "@/types/banner";
import Image from "next/image";
import { PlusCircle, PencilSquare, Trash } from "react-bootstrap-icons";

// Importamos ambos modales
import { BannerModal } from "@/components/admin/Banner/BannerModal";
import { DeleteBanner } from "@/components/admin/Banner/DeleteBanner";

export default function BannersPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para controlar los Modales y el Banner seleccionado
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBanner | null>(null);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAPI<IBanner[]>("/carrousel/");
      setBanners(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // Controladores de acciones
  const handleOpenCreate = () => {
    setSelectedBanner(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (banner: IBanner) => {
    setSelectedBanner(banner);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (banner: IBanner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  // Callback de éxito para recargar tabla
  const handleActionSuccess = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBanner(null);
    loadBanners();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-6">
      <div className="mx-auto grid w-full max-w-[1400px] gap-6 pb-8 pt-6 md:px-4 md:pt-8">
        <header className="w-full overflow-hidden rounded-2xl border border-[#e6e7eb] bg-gradient-to-r from-white via-[#fff7f8] to-[#fff1f4] shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7 md:py-6">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-[#1f2937] md:text-[34px]">
                Gestionar banners
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] md:text-[15px]">
                Crea, edita y ordena los slides principales que se muestran en
                la portada publica.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-lg bg-[#c41e3a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#a01830]"
            >
              <PlusCircle size={18} /> Nuevo Slide
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded bg-red-50 p-4 text-red-600">
            Error: {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b-2 border-[#c41e3a] bg-[#f0f0f0] text-[#2c2c2c]">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Imagen</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4 text-center">Orden</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : (
                  banners.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fafafa]">
                      <td className="p-4 font-semibold text-[#c41e3a]">
                        {item.id}
                      </td>
                      <td className="p-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={item.image_url}
                            alt="slide"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="max-w-[200px] p-4">
                        <p className="line-clamp-2 text-gray-600">
                          {item.descripcion}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <span className="rounded-full bg-gray-200 px-3 py-1 font-semibold">
                          {item.orden}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {item.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {/* Botones de acción conectados a los estados */}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-600 hover:text-[#c41e3a]"
                        >
                          <PencilSquare size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="p-1.5 text-gray-600 hover:text-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Renderizamos ambos modales pasándoles la información */}
      <BannerModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        bannerToEdit={selectedBanner}
        onSuccess={handleActionSuccess}
      />
      <DeleteBanner
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        bannerToDelete={selectedBanner}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
