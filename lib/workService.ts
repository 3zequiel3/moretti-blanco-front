import { fetchAPI } from "@/lib/apiClient";
import type { IWork } from "@/types/work";

export interface WorkFormPayload {
  titulo: string;
  descripcion: string;
  imagenes: File[];
  comentarios?: string;
  puntuacion?: number;
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
