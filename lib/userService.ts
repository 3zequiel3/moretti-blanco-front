import { fetchAPI } from "@/lib/apiClient";
import type { AdminUser, ChangePasswordPayload } from "@/types/user";

export async function getCurrentAdminUser(): Promise<AdminUser> {
  return fetchAPI<AdminUser>("/users/verify", {
    method: "GET",
  });
}

export async function updateAdminProfile(payload: {
  nombre?: string;
  username?: string;
  foto?: File | null;
}): Promise<AdminUser> {
  const formData = new FormData();

  if (payload.nombre !== undefined) {
    formData.append("nombre", payload.nombre);
  }

  if (payload.username !== undefined) {
    formData.append("username", payload.username);
  }

  if (payload.foto) {
    formData.append("foto_perfil", payload.foto);
  }

  return fetchAPI<AdminUser>("/users/profile", {
    method: "PUT",
    body: formData,
  });
}

export async function changeAdminPassword(
  payload: ChangePasswordPayload,
): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>("/users/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
