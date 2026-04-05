"use client";

import { useEffect, useMemo, useState } from "react";
import { XLg } from "react-bootstrap-icons";
import type { IContactData, IContactLinks } from "@/types/contact";
import { ContactPhotoEditor } from "./ContactPhotoEditor";
import { ContactNameCel } from "./ContactNameCel";
import { ContactLinks, type LinkEntry } from "./ContactLinks";

export type ContactFormPayload = {
  nombre: string;
  cargo: string;
  telefono: string;
  links_botones: IContactLinks;
  file: File | null;
};

type ContactModalProps = {
  isOpen: boolean;
  contact: IContactData | null;
  onClose: () => void;
  onSubmit: (payload: ContactFormPayload) => Promise<void>;
};

const linksObjectToEntries = (links: IContactLinks): LinkEntry[] => {
  return Object.entries(links || {}).map(([key, value]) => ({
    key,
    value,
  }));
};

const linksEntriesToObject = (entries: LinkEntry[]): IContactLinks => {
  return entries.reduce<IContactLinks>((acc, entry) => {
    const key = entry.key.trim();
    const value = entry.value.trim();

    if (key && value) {
      acc[key] = value;
    }

    return acc;
  }, {});
};

export const ContactModal = ({
  isOpen,
  contact,
  onClose,
  onSubmit,
}: ContactModalProps) => {
  const isEditMode = Boolean(contact);

  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [links, setLinks] = useState<LinkEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setNombre(contact?.nombre || "");
    setCargo(contact?.cargo || "");
    setTelefono(contact?.telefono || "");
    setSelectedFile(null);
    setLinks(linksObjectToEntries(contact?.links_botones || {}));
    setFeedback(null);
  }, [isOpen, contact]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const isDirty = useMemo(() => {
    if (!isOpen) {
      return false;
    }

    const currentLinks = linksEntriesToObject(links);
    const initialLinks = contact?.links_botones || {};

    return Boolean(
      nombre.trim() !== (contact?.nombre || "").trim() ||
      cargo.trim() !== (contact?.cargo || "").trim() ||
      telefono.trim() !== (contact?.telefono || "").trim() ||
      selectedFile ||
      JSON.stringify(currentLinks) !== JSON.stringify(initialLinks),
    );
  }, [isOpen, nombre, cargo, telefono, selectedFile, links, contact]);

  if (!isOpen) {
    return null;
  }

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleChangeLink = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setLinks((prev) =>
      prev.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const handleAddPresetLink = (preset: string) => {
    const presetUrls: Record<string, string> = {
      WhatsApp: "https://api.whatsapp.com/send?phone=",
      Instagram: "https://www.instagram.com/",
      Facebook: "https://www.facebook.com/",
      LinkedIn: "https://www.linkedin.com/company/",
      "Solicitar presupuesto": "https://api.whatsapp.com/send?phone=",
    };

    const normalizeKey = (value: string) =>
      value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const alreadyExists = links.some(
      (entry) => normalizeKey(entry.key) === normalizeKey(preset),
    );

    if (alreadyExists) {
      return;
    }

    setLinks((prev) => [
      ...prev,
      {
        key:
          normalizeKey(preset) === "solicitar presupuesto"
            ? "solicitar_presupuesto"
            : preset,
        value: presetUrls[preset] || "https://",
      },
    ]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    if (!nombre.trim()) {
      setFeedback({ type: "error", msg: "El nombre es obligatorio." });
      return;
    }

    if (!telefono.trim()) {
      setFeedback({ type: "error", msg: "El teléfono es obligatorio." });
      return;
    }

    if (!isEditMode && !selectedFile) {
      setFeedback({ type: "error", msg: "Debes seleccionar una foto." });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        nombre: nombre.trim(),
        cargo: cargo.trim(),
        telefono: telefono.trim(),
        links_botones: linksEntriesToObject(links),
        file: selectedFile,
      });

      setFeedback({
        type: "success",
        msg: isEditMode ? "Contacto actualizado." : "Contacto creado.",
      });
      onClose();
    } catch (submitError) {
      setFeedback({
        type: "error",
        msg:
          submitError instanceof Error
            ? submitError.message
            : "No se pudo guardar el contacto.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e6e7eb] px-5 py-4 md:px-6 md:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c41e3a]">
              {isEditMode ? "Editar contacto" : "Nuevo contacto"}
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#1f2937] md:text-2xl">
              {isEditMode ? "Modificar perfil" : "Crear perfil de contacto"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e6e7eb] p-2 text-[#6b7280] transition hover:bg-[#f8f9fb] hover:text-[#1f2937]"
            aria-label="Cerrar"
          >
            <XLg size={18} />
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto px-5 py-5 md:px-6 md:py-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="space-y-4">
            <ContactPhotoEditor
              photoUrl={contact?.foto_url || null}
              isLoading={isSubmitting}
              onPhotoChange={(file) => setSelectedFile(file)}
              title="Foto de contacto"
            />

            <div className="rounded-2xl border border-[#e6e7eb] bg-[#f8f9fb] p-4 md:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c41e3a]">
                Estado del formulario
              </p>
              <p className="mt-2 text-sm leading-6 text-[#4b5563]">
                {isEditMode
                  ? "Editá nombre, cargo, teléfono, links o reemplazá la foto desde la izquierda."
                  : "Completá la info principal y subí una foto para publicar un nuevo contacto."}
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <ContactNameCel
              name={nombre}
              cargo={cargo}
              phone={telefono}
              onNameChange={setNombre}
              onCargoChange={setCargo}
              onPhoneChange={setTelefono}
              disabled={isSubmitting}
            />

            <ContactLinks
              entries={links}
              onAddPreset={handleAddPresetLink}
              onRemove={handleRemoveLink}
              onChange={handleChangeLink}
              disabled={isSubmitting}
            />

            {feedback && (
              <div
                className={`rounded-xl px-4 py-3 text-sm font-medium ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
              >
                {feedback.msg}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-[#e6e7eb] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-[#e6e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#4b5563] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || (!isDirty && isEditMode)}
                className="rounded-xl bg-gradient-to-br from-[#c41e3a] to-[#a31730] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Guardando..."
                  : isEditMode
                    ? "Actualizar contacto"
                    : "Crear contacto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
