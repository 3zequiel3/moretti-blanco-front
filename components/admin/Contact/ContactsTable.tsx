"use client";

import Image from "next/image";
import { PencilSquare, PlusCircle } from "react-bootstrap-icons";
import type { IContactData } from "@/types/contact";

type ContactsTableProps = {
  contacts: IContactData[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (contact: IContactData) => void;
};

const countSocialLinks = (contact: IContactData) => {
  return Object.entries(contact.links_botones || {}).filter(([, value]) => {
    return typeof value === "string" && value.trim().length > 0;
  }).length;
};

export const ContactsTable = ({
  contacts,
  isLoading,
  onCreate,
  onEdit,
}: ContactsTableProps) => {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#e6e7eb] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#e6e7eb] bg-gradient-to-r from-white via-[#fff7f8] to-[#fff1f4] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7 md:py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c41e3a]">
            Administración
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#1f2937] md:text-[32px]">
            Datos de contacto
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] md:text-[15px]">
            Gestioná uno o varios perfiles de contacto. Cada registro se edita
            desde un modal para mantener la grilla limpia.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a01830]"
        >
          <PlusCircle size={18} /> Nuevo contacto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[840px] w-full text-left text-sm">
          <thead className="border-b-2 border-[#c41e3a] bg-[#f8f9fb] text-[#2c2c2c]">
            <tr>
              <th className="px-5 py-4 font-semibold">Foto</th>
              <th className="px-5 py-4 font-semibold">Persona</th>
              <th className="px-5 py-4 font-semibold">Teléfono</th>
              <th className="px-5 py-4 font-semibold">Links</th>
              <th className="px-5 py-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e8e8e8] bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Cargando datos de contacto...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10">
                  <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[#e6e7eb] bg-[#fafbfc] px-5 py-8 text-center">
                    <p className="text-lg font-semibold text-[#1f2937]">
                      No hay contactos creados
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                      Creá el primer registro para publicar los datos de
                      contacto en la web.
                    </p>
                    <button
                      onClick={onCreate}
                      className="mt-4 rounded-xl bg-[#c41e3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a01830]"
                    >
                      Nuevo contacto
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className="transition hover:bg-[#fafafa]">
                  <td className="px-5 py-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[#e6e7eb] bg-[#f8f9fb]">
                      <Image
                        src={contact.foto_url || "/contact/contact.jpg"}
                        alt={contact.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-[#1f2937]">
                        {contact.nombre}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#c41e3a]">
                        {contact.cargo || "Sin cargo"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#4b5563]">
                    {contact.telefono}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[#f2f4f8] px-3 py-1 text-xs font-semibold text-[#4b5563]">
                      {countSocialLinks(contact)} link
                      {countSocialLinks(contact) === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => onEdit(contact)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#e6e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b5563] transition hover:border-[#f0b8c2] hover:text-[#c41e3a]"
                    >
                      <PencilSquare size={16} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
