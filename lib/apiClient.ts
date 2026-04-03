// lib/apiClient.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Lógica de Autenticación Segura con Cookies
  // Al ejecutarse en el servidor, leemos la cookie directamente.
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ejecutamos la petición hacia FastAPI
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Manejo de errores
  if (!response.ok) {
    let errorMessage = `Error en la petición: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      }
    } catch (e) {
      // Mantenemos el mensaje genérico si el JSON falla
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}