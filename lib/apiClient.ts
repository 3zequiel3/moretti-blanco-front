// lib/apiClient.ts

const BASE_URL = "/api/backend";

// Construir URL absoluta para Server Components
function getAbsoluteUrl(path: string): string {
  // En el client, usa URL relativa
  if (typeof window !== "undefined") {
    return `${BASE_URL}${path}`;
  }

  // En el servidor, usa el host del frontend (no el backend)
  // NEXT_PUBLIC_API_URL suele apuntar al backend y aqui romperia la ruta /api/backend/*
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return `${baseUrl}${BASE_URL}${path}`;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = getAbsoluteUrl(endpoint);
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Cliente browser-safe: no usa next/headers.
  const response = await fetch(url, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });

  // Manejo de errores
  if (!response.ok) {
    let errorMessage = `Error en la petición: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage =
          typeof errorData.detail === "string"
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
