"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { fetchAPI } from "@/lib/apiClient";
import type {
  CreateContactData,
  IContactData,
  IContactLinks,
  UpdateContactData,
  UpdateContactPhotoData,
} from "@/types/contact";
import { ContactLinks, type LinkEntry } from "./ContactLinks";
import { ContactNameCel } from "./ContactNameCel";
import { ContactPhotoEditor } from "./ContactPhotoEditor";

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

async function getContactData(): Promise<IContactData | null> {
  return fetchAPI<IContactData | null>("/contacto/");
}

async function createContactData(
  payload: CreateContactData,
): Promise<IContactData> {
  const body = new FormData();
  body.append("nombre", payload.nombre);
  body.append("telefono", payload.telefono);
  body.append("file", payload.file);
  body.append("links_botones", JSON.stringify(payload.links_botones));

  return fetchAPI<IContactData>("/contacto/", {
    method: "POST",
    body,
  });
}

async function updateContactData(
  payload: UpdateContactData,
): Promise<IContactData> {
  return fetchAPI<IContactData>(`/contacto/${payload.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: payload.nombre,
      telefono: payload.telefono,
      links_botones: payload.links_botones,
    }),
  });
}

async function updateContactPhoto(
  payload: UpdateContactPhotoData,
): Promise<IContactData> {
  const body = new FormData();
  body.append("file", payload.file);

  return fetchAPI<IContactData>(`/contacto/${payload.id}/update_photo`, {
    method: "POST",
    body,
  });
}

export function AdminContact() {
  const [contact, setContact] = useState<IContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createPhoto, setCreatePhoto] = useState<File | null>(null);
  const [createLinks, setCreateLinks] = useState<LinkEntry[]>([]);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLinks, setEditLinks] = useState<LinkEntry[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const isInitialSetup = useMemo(
    () => !isLoading && !contact && !error,
    [isLoading, contact, error],
  );

  const isCreateDirty = useMemo(() => {
    const hasFilledLink = createLinks.some(
      (entry) => entry.key.trim() || entry.value.trim(),
    );

    return Boolean(
      createName.trim() || createPhone.trim() || createPhoto || hasFilledLink,
    );
  }, [createName, createPhone, createPhoto, createLinks]);

  const isEditDirty = useMemo(() => {
    if (!contact) {
      return false;
    }

    const linksChanged =
      JSON.stringify(linksEntriesToObject(editLinks)) !==
      JSON.stringify(contact.links_botones || {});

    return (
      editName.trim() !== contact.nombre.trim() ||
      editPhone.trim() !== contact.telefono.trim() ||
      linksChanged
    );
  }, [contact, editName, editPhone, editLinks]);

  useEffect(() => {
    if (!saveFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveFeedback(null);
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [saveFeedback]);

  const loadContact = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getContactData();
      setContact(data);
    } catch (err) {
      setError("Error al cargar datos de contacto.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, []);

  useEffect(() => {
    if (!contact) {
      return;
    }

    setEditName(contact.nombre);
    setEditPhone(contact.telefono);
    setEditLinks(linksObjectToEntries(contact.links_botones));
  }, [contact]);

  const handleRemoveLink = (mode: "create" | "edit", index: number) => {
    if (mode === "create") {
      setCreateLinks((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    setEditLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeLink = (
    mode: "create" | "edit",
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const updater = (prev: LinkEntry[]) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      );

    if (mode === "create") {
      setCreateLinks(updater);
      return;
    }

    setEditLinks(updater);
  };

  const handleCreateSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!createPhoto) {
      setError("Debes seleccionar una foto para crear el contacto.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await createContactData({
        nombre: createName,
        telefono: createPhone,
        file: createPhoto,
        links_botones: linksEntriesToObject(createLinks),
      });

      setCreateName("");
      setCreatePhone("");
      setCreatePhoto(null);
      setCreateLinks([]);

      await loadContact();
      setSaveFeedback("Contacto creado y publicado correctamente.");
    } catch {
      setError("No se pudo crear el contacto.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateData = async () => {
    if (!contact) {
      return;
    }

    setIsUpdatingData(true);
    setError(null);

    try {
      await updateContactData({
        id: contact.id,
        nombre: editName,
        telefono: editPhone,
        links_botones: linksEntriesToObject(editLinks),
      });

      await loadContact();
      setSaveFeedback("Cambios guardados correctamente.");
    } catch {
      setError("No se pudieron guardar los cambios.");
    } finally {
      setIsUpdatingData(false);
    }
  };

  const handleUpdatePhoto = async (file: File) => {
    if (!contact) {
      return;
    }

    setIsUpdatingPhoto(true);
    setError(null);

    try {
      await updateContactPhoto({ id: contact.id, file });
      await loadContact();
      setSaveFeedback("Foto actualizada correctamente.");
    } catch {
      setError("No se pudo actualizar la foto.");
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleAddPresetLink = (mode: "create" | "edit", preset: string) => {
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

    const alreadyExists = (entries: LinkEntry[]) =>
      entries.some((entry) => {
        const normalized = normalizeKey(entry.key);
        const normalizedPreset = normalizeKey(preset);
        return normalized === normalizedPreset;
      });

    const nextEntry: LinkEntry = {
      key:
        normalizeKey(preset) === "solicitar presupuesto"
          ? "solicitar_presupuesto"
          : preset,
      value: presetUrls[preset] || "https://",
    };

    if (mode === "create") {
      setCreateLinks((prev) =>
        alreadyExists(prev) ? prev : [...prev, nextEntry],
      );
      return;
    }

    setEditLinks((prev) => (alreadyExists(prev) ? prev : [...prev, nextEntry]));
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#e6e7eb] bg-white p-4 text-sm text-[#6b7280]">
        Cargando datos de contacto...
      </div>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-2 pb-8 pt-6 md:px-4 md:pt-8">
      <header className="w-full overflow-hidden rounded-2xl border border-[#e6e7eb] bg-gradient-to-r from-white via-[#fff7f8] to-[#fff1f4] shadow-sm">
        <div className="px-5 py-5 md:px-7 md:py-6">
          <h1 className="text-2xl font-extrabold leading-tight text-[#1f2937] md:text-[34px]">
            Datos de contacto
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] md:text-[15px]">
            Gestiona el perfil publico principal: nombre, telefono, imagen y
            links sociales visibles en el sitio.
          </p>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saveFeedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveFeedback}
        </div>
      )}

      {isInitialSetup ? (
        <article className="w-full rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 space-y-1">
            <h2 className="text-lg font-semibold text-[#1f2937]">
              Crea el primer contacto
            </h2>
            <p className="text-sm text-[#6b7280]">
              Completa nombre, telefono, foto de perfil y links para publicarlo.
            </p>
          </div>

          <form className="grid gap-5" onSubmit={handleCreateSubmit}>
            <div className="grid gap-5 md:grid-cols-[minmax(220px,300px)_1fr] md:items-start">
              <ContactPhotoEditor
                photoUrl={null}
                isLoading={isCreating}
                onPhotoChange={(file) => setCreatePhoto(file)}
                title="Foto de contacto"
              />

              <ContactNameCel
                name={createName}
                phone={createPhone}
                onNameChange={setCreateName}
                onPhoneChange={setCreatePhone}
                disabled={isCreating}
              />
            </div>

            <ContactLinks
              entries={createLinks}
              onAddPreset={(preset) => handleAddPresetLink("create", preset)}
              onRemove={(index) => handleRemoveLink("create", index)}
              onChange={(index, field, value) =>
                handleChangeLink("create", index, field, value)
              }
              disabled={isCreating}
            />

            <div className="sticky bottom-2 z-10 flex flex-col gap-3 rounded-xl border border-[#f1d6db] bg-white/95 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                {isCreateDirty
                  ? "Hay cambios sin guardar"
                  : "Sin cambios pendientes"}
              </p>
              <button
                className="rounded-xl bg-[#c41e3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a01830] disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isCreating || !isCreateDirty}
              >
                {isCreating ? "Guardando..." : "Crear contacto"}
              </button>
            </div>
          </form>
        </article>
      ) : (
        <article className="w-full rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-sm md:p-8">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-[minmax(220px,300px)_1fr] md:items-start">
              <ContactPhotoEditor
                photoUrl={contact?.foto_url || null}
                isLoading={isUpdatingPhoto}
                onPhotoChange={handleUpdatePhoto}
                title="Foto de contacto"
              />

              <ContactNameCel
                name={editName}
                phone={editPhone}
                onNameChange={setEditName}
                onPhoneChange={setEditPhone}
                disabled={isUpdatingData}
              />
            </div>

            <ContactLinks
              entries={editLinks}
              onAddPreset={(preset) => handleAddPresetLink("edit", preset)}
              onRemove={(index) => handleRemoveLink("edit", index)}
              onChange={(index, field, value) =>
                handleChangeLink("edit", index, field, value)
              }
              disabled={isUpdatingData}
            />

            <div className="sticky bottom-2 z-10 flex flex-col gap-3 rounded-xl border border-[#f1d6db] bg-white/95 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                {isEditDirty
                  ? "Hay cambios sin guardar"
                  : "Sin cambios pendientes"}
              </p>
              <button
                className="rounded-xl bg-[#c41e3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a01830] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={isUpdatingData || !isEditDirty}
                onClick={handleUpdateData}
              >
                {isUpdatingData ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
