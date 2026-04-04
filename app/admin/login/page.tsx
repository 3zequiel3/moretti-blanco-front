// app/admin/login/page.tsx
"use client";

import { useActionState } from "react";
import Image from "next/image";
// Importamos la acción de servidor que maneja el fetch a FastAPI y setea la cookie
import { loginAction } from "./actions"; 

export default function Login() {
  // useActionState reemplaza a tu antiguo useAuth y useState.
  // Automáticamente maneja el evento preventDefault, el estado de carga y los errores.
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    // Reemplaza .page
    <section className="grid min-h-screen place-items-center bg-[var(--color-bg-secondary)] p-6">
      
      {/* Reemplaza .panel */}
      <div className="w-[min(540px,92vw)] rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg)] p-7 shadow-[0_14px_34px_rgba(17,24,39,0.08)]">
        
        {/* Reemplaza .logo */}
        <Image
          src="/navbar/morettiblanco_logo.png"
          alt="Moretti Blanco"
          width={665} // Requerido por Next.js para aspect-ratio
          height={600}
          priority // Carga prioritaria porque está por encima del pliegue (LCP)
          className="mx-auto mb-[18px] block h-auto w-full max-w-[280px] object-contain"
        />

        {/* Reemplaza .form */}
        <form action={formAction} className="grid gap-[14px]">
          
          {/* Reemplaza .field */}
          <div className="grid gap-[6px]">
            {/* Reemplaza .label */}
            <label
              htmlFor="username"
              className="text-[0.92rem] text-[var(--color-text-light)]"
            >
              Usuario
            </label>
            {/* Reemplaza .input */}
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="username"
              className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-[14px] py-[12px] text-[1rem] text-[var(--color-text)] outline-none transition-all duration-[120ms] ease-in-out focus:border-[var(--color-primary-hover)] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.18)]"
            />
          </div>

          <div className="grid gap-[6px]">
            <label
              htmlFor="password"
              className="text-[0.92rem] text-[var(--color-text-light)]"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-[14px] py-[12px] text-[1rem] text-[var(--color-text)] outline-none transition-all duration-[120ms] ease-in-out focus:border-[var(--color-primary-hover)] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.18)]"
            />
          </div>

          {/* Reemplaza .error */}
          {state?.error && (
            <p className="m-0 rounded-[10px] border border-[#fecaca] bg-[#fee2e2] px-[12px] py-[10px] text-[0.9rem] text-[#991b1b]">
              {state.error}
            </p>
          )}

          {/* Reemplaza .submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1 cursor-pointer rounded-[12px] border border-transparent bg-[var(--color-primary-hover)] px-[14px] py-[12px] text-[0.98rem] font-semibold text-white transition-all duration-[100ms] ease-in-out hover:brightness-110 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Verificando..." : "Ingresar"}
          </button>
          
        </form>
      </div>
    </section>
  );
}