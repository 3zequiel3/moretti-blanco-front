"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/apiClient";
import type { IContactData } from "@/types/contact";
import { ContactsTable } from "./ContactsTable";
import { ContactModal, type ContactFormPayload } from "./ContactModal";

async function getContactDataList(): Promise<IContactData[]> {
  try {
    return await fetchAPI<IContactData[]>("/contacto/list");
  } catch {
    const single = await fetchAPI<IContactData | null>("/contacto/");
    return single ? [single] : [];
  }
}

async function createContactData(payload: ContactFormPayload): Promise<void> {
  if (!payload.file) {
    throw new Error("Debes seleccionar una foto para crear el contacto.");
  }

  const body = new FormData();
  body.append("nombre", payload.nombre);
  body.append("cargo", payload.cargo || "");
  body.append("telefono", payload.telefono);
  body.append("file", payload.file);
  body.append("links_botones", JSON.stringify(payload.links_botones));

  await fetchAPI<IContactData>("/contacto/", {
    method: "POST",
    body,
  });
}

async function updateContactData(
  id: number,
  payload: ContactFormPayload,
): Promise<void> {
  await fetchAPI<IContactData>(`/contacto/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: payload.nombre,
      cargo: payload.cargo,
      telefono: payload.telefono,
      links_botones: payload.links_botones,
    }),
  });

  if (payload.file) {
    const body = new FormData();
    body.append("file", payload.file);

    await fetchAPI<IContactData>(`/contacto/${id}/update_photo`, {
      method: "POST",
      body,
    });
  }
}

export function AdminContact() {
  const [contacts, setContacts] = useState<IContactData[]>([]);
  const [selectedContact, setSelectedContact] = useState<IContactData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getContactDataList();
      setContacts(data);
    } catch {
      setError("Error al cargar los datos de contacto.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (!saveFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveFeedback(null);
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [saveFeedback]);

  const handleOpenCreate = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: IContactData) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleSubmitContact = async (payload: ContactFormPayload) => {
    if (selectedContact) {
      await updateContactData(selectedContact.id, payload);
      setSaveFeedback("Contacto actualizado correctamente.");
    } else {
      await createContactData(payload);
      setSaveFeedback("Contacto creado correctamente.");
    }

    await loadContacts();
  };

  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-2 pb-8 pt-6 md:px-4 md:pt-8">
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

      <ContactsTable
        contacts={contacts}
        isLoading={isLoading}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
      />

      <ContactModal
        isOpen={isModalOpen}
        contact={selectedContact}
        onClose={handleCloseModal}
        onSubmit={handleSubmitContact}
      />
    </section>
  );
}
