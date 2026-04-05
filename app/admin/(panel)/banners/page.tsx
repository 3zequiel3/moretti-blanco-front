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
  const nextBannerOrder =
    banners.length > 0
      ? Math.max(...banners.map((banner) => banner.orden)) + 1
      : 1;

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAPI<IBanner[]>("/carrousel");
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
      <div className="mx-auto w-full max-w-[1400px] px-2 pb-8 pt-6 md:px-4 md:pt-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error: {error}
          </div>
        )}

        <div className="overflow-hidden rounded-[26px] border border-[#e6e7eb] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#e6e7eb] bg-gradient-to-r from-white via-[#fff7f8] to-[#fff1f4] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7 md:py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c41e3a]">
                Administración
              </p>
              <h1 className="mt-1 text-2xl font-extrabold leading-tight text-[#1f2937] md:text-[34px]">
                Gestionar banners
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] md:text-[15px]">
                Crea, edita y ordena los slides principales que se muestran en
                la portada publica.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a01830]"
            >
              <PlusCircle size={18} /> Nuevo Slide
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[840px] w-full text-left text-sm">
              <thead className="border-b-2 border-[#c41e3a] bg-[#f8f9fb] text-[#2c2c2c]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Imagen</th>
                  <th className="px-5 py-4 font-semibold">Descripción</th>
                  <th className="px-5 py-4 text-center font-semibold">Orden</th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Estado
                  </th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8] bg-white">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-gray-500"
                    >
                      Cargando banners...
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10">
                      <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[#e6e7eb] bg-[#fafbfc] px-5 py-8 text-center">
                        <p className="text-lg font-semibold text-[#1f2937]">
                          No hay banners creados
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                          Creá el primer slide para publicarlo en la portada.
                        </p>
                        <button
                          onClick={handleOpenCreate}
                          className="mt-4 rounded-xl bg-[#c41e3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a01830]"
                        >
                          Nuevo Slide
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  banners.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#fafafa]">
                      <td className="px-5 py-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[#e6e7eb] bg-[#f8f9fb]">
                          <Image
                            src={item.image_url}
                            alt="slide"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="max-w-[260px] px-5 py-4">
                        <p className="line-clamp-2 text-[#4b5563]">
                          {item.descripcion}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="rounded-full bg-[#f2f4f8] px-3 py-1 font-semibold text-[#1f2937]">
                          {item.orden}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                        >
                          {item.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#e6e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b5563] transition hover:border-[#f0b8c2] hover:text-[#c41e3a]"
                        >
                          <PencilSquare size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="ml-2 inline-flex items-center gap-2 rounded-xl border border-[#f0d7dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#9f1239] transition hover:border-[#ef9fb0] hover:text-[#c41e3a]"
                        >
                          <Trash size={16} />
                          Eliminar
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
        nextOrder={nextBannerOrder}
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
