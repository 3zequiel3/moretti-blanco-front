import { fetchAPI } from "@/lib/apiClient";
import type { IWork } from "@/types/work";

export interface WorkFormPayload {
  titulo: string;
  descripcion: string;
  imagenes: File[];
  comentarios?: string;
  puntuacion?: number;
}

interface UploadTarget {
  upload_url: string;
  storage_path: string;
  object_key: string;
}

interface DirectWorkImagePayload {
  url: string;
  nombre?: string;
}

interface DirectWorkPayload {
  titulo: string;
  descripcion: string;
  imagenes: DirectWorkImagePayload[];
  comentarios?: string;
}

function useDirectUploadMode(): boolean {
  const configuredMode =
    process.env.NEXT_PUBLIC_WORK_UPLOAD_MODE?.trim().toLowerCase();

  if (configuredMode === "direct") {
    return true;
  }

  if (configuredMode === "local") {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

  return !localHosts.has(hostname);
}

function buildWorkFormData(payload: WorkFormPayload): FormData {
  const formData = new FormData();
  formData.append("titulo", payload.titulo);
  formData.append("descripcion", payload.descripcion);

  if (payload.comentarios?.trim()) {
    formData.append("comentarios", payload.comentarios.trim());
  }

  payload.imagenes.forEach((file) => {
    formData.append("imagenes", file);
  });

  return formData;
}

async function fetchWorksList(endpoint: string): Promise<IWork[]> {
  try {
    return await fetchAPI<IWork[]>(endpoint);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No se encontraron trabajos")
    ) {
      return [];
    }

    throw error;
  }
}

async function rateWork(
  workId: number,
  puntuacion: number,
  comentarios?: string,
): Promise<IWork> {
  const formData = new FormData();
  formData.append("puntuacion", String(puntuacion));
  formData.append("comentarios", comentarios?.trim() || "Sin comentarios");

  return fetchAPI<IWork>(`/ultimos-trabajos/${workId}/encuesta`, {
    method: "POST",
    body: formData,
  });
}

async function presignWorkImageUpload(file: File): Promise<UploadTarget> {
  return fetchAPI<UploadTarget>("/ultimos-trabajos/uploads/presign", {
    method: "POST",
    body: JSON.stringify({
      folder: "ultimos_trabajos",
      original_filename: file.name,
      content_type: file.type || "application/octet-stream",
    }),
  });
}

async function uploadWorkImageDirect(
  file: File,
): Promise<DirectWorkImagePayload> {
  const target = await presignWorkImageUpload(file);

  const uploadResponse = await fetch(target.upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`No se pudo subir ${file.name}`);
  }

  return {
    url: target.storage_path,
    nombre: file.name,
  };
}

async function createWorkDirect(payload: WorkFormPayload): Promise<IWork> {
  const images = await Promise.all(
    payload.imagenes.map((file) => uploadWorkImageDirect(file)),
  );
  const directPayload: DirectWorkPayload = {
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    imagenes: images,
    comentarios: payload.comentarios?.trim() || undefined,
  };

  return fetchAPI<IWork>("/ultimos-trabajos/direct", {
    method: "POST",
    body: JSON.stringify(directPayload),
  });
}

async function updateWorkDirect(
  workId: number,
  payload: WorkFormPayload,
): Promise<IWork> {
  const images = await Promise.all(
    payload.imagenes.map((file) => uploadWorkImageDirect(file)),
  );
  const directPayload: DirectWorkPayload = {
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    imagenes: images,
    comentarios: payload.comentarios?.trim() || undefined,
  };

  return fetchAPI<IWork>(`/ultimos-trabajos/${workId}/direct`, {
    method: "PATCH",
    body: JSON.stringify(directPayload),
  });
}

export interface WorkSurveyPayload {
  puntuacion: number;
  comentarios: string;
}

export async function getAllWorks(): Promise<IWork[]> {
  return fetchWorksList("/ultimos-trabajos/all");
}

export async function getActiveWorks(): Promise<IWork[]> {
  return fetchWorksList("/ultimos-trabajos/active");
}

export async function getWorkById(workId: number): Promise<IWork> {
  return fetchAPI<IWork>(`/ultimos-trabajos/${workId}`);
}

export async function submitWorkSurvey(
  workId: number,
  payload: WorkSurveyPayload,
): Promise<IWork> {
  const formData = new FormData();
  formData.append("puntuacion", String(payload.puntuacion));
  formData.append("comentarios", payload.comentarios.trim());

  return fetchAPI<IWork>(`/ultimos-trabajos/${workId}/encuesta`, {
    method: "POST",
    body: formData,
  });
}

export async function createWork(payload: WorkFormPayload): Promise<IWork> {
  if (useDirectUploadMode()) {
    const createdWork = await createWorkDirect(payload);

    if (payload.puntuacion && payload.puntuacion !== createdWork.puntuacion) {
      return rateWork(createdWork.id, payload.puntuacion, payload.comentarios);
    }

    return createdWork;
  }

  const createdWork = await fetchAPI<IWork>("/ultimos-trabajos", {
    method: "POST",
    body: buildWorkFormData(payload),
  });

  if (payload.puntuacion && payload.puntuacion !== createdWork.puntuacion) {
    return rateWork(createdWork.id, payload.puntuacion, payload.comentarios);
  }

  return createdWork;
}

export async function updateWork(
  workId: number,
  payload: WorkFormPayload,
): Promise<IWork> {
  if (useDirectUploadMode()) {
    const updatedWork = await updateWorkDirect(workId, payload);

    if (payload.puntuacion && payload.puntuacion !== updatedWork.puntuacion) {
      return rateWork(updatedWork.id, payload.puntuacion, payload.comentarios);
    }

    return updatedWork;
  }

  const formData = buildWorkFormData(payload);

  const updatedWork = await fetchAPI<IWork>(`/ultimos-trabajos/${workId}`, {
    method: "PATCH",
    body: formData,
  });

  if (payload.puntuacion && payload.puntuacion !== updatedWork.puntuacion) {
    return rateWork(updatedWork.id, payload.puntuacion, payload.comentarios);
  }

  return updatedWork;
}

export async function activateWork(workId: number): Promise<IWork> {
  return fetchAPI<IWork>(`/ultimos-trabajos/${workId}/activate`, {
    method: "POST",
  });
}

export async function deactivateWork(workId: number): Promise<IWork> {
  return fetchAPI<IWork>(`/ultimos-trabajos/${workId}/deactivate`, {
    method: "POST",
  });
}
