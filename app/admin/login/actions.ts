// app/admin/login/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function loginAction(prevState: any, form: FormData) {
  // Extraemos los datos del formulario HTML
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || "Credenciales inválidas" };
    }

    const data = await response.json(); // LoginResponse con access+refresh

    // Replicamos la configuración exacta de tu backend en Next.js
    const cookieStore = await cookies();
    cookieStore.set({
      name: "mb_access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // False en local, True en prod
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in ?? 1800,
    });
    cookieStore.set({
      name: "mb_refresh_token",
      value: data.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 2592000, // 30 dias
    });
  } catch (err: any) {
    return { error: "Error de conexión con el backend" };
  }

  // Si todo salió bien, lo mandamos al panel
  redirect("/admin");
}
export async function logoutAction() {
  // Para cerrar sesión, simplemente borramos la cookie del token
  const cookieStore = await cookies();
  cookieStore.delete("mb_access_token");
  cookieStore.delete("mb_refresh_token");

  // Y redirigimos al login
  redirect("/admin/login");
}
