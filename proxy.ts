// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Esta función se ejecuta en cada petición a las rutas que definamos
export function proxy(request: NextRequest) {
  // 1. Buscamos la cookie segura que guardará nuestro Server Action del login
  const accessToken = request.cookies.get("mb_access_token")?.value;
  const refreshToken = request.cookies.get("mb_refresh_token")?.value;

  const url = request.nextUrl.clone();
  const isLoginPage = url.pathname === "/admin/login";
  const isAdminRoute = url.pathname.startsWith("/admin");

  // Escenario A: Intenta entrar a /admin pero NO tiene ninguna sesión.
  if (isAdminRoute && !isLoginPage && !accessToken && !refreshToken) {
    // Lo pateamos de vuelta al login
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Escenario B: Ya está logueado, pero intenta ir a la página de login
  if (isLoginPage && (accessToken || refreshToken)) {
    // Lo redirigimos directo al panel principal del admin
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Escenario C: Todo está en orden, lo dejamos pasar
  return NextResponse.next();
}

// Configuración obligatoria: Le decimos a Next.js en qué rutas exactas
// debe ejecutar este guardia de seguridad para no gastar recursos en la web pública.
export const config = {
  matcher: ["/admin/:path*"], // Protege /admin y cualquier subruta (/admin/works, etc.)
};
