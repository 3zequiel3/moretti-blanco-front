"use client";

import { useEffect, useState } from "react";
import { getCurrentAdminUser } from "@/lib/userService";
import type { AdminUser } from "@/types/user";
import { ProfileInfoForm } from "@/components/admin/Profile/ProfileInfoForm";
import { PasswordChangeForm } from "@/components/admin/Profile/PasswordChangeForm";

export function AdminProfileView() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCurrentAdminUser();
        if (!ignore) {
          setUser(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el perfil.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[980px] p-6">
        <div className="rounded-2xl border border-[#d8dee6] bg-white p-8 text-sm text-[#475569] shadow-sm">
          Cargando perfil...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto w-full max-w-[980px] p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error ?? "No se encontró el perfil."}
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-[980px] gap-5 p-4 md:p-6">
      <header className="rounded-2xl border border-[#d8dee6] bg-gradient-to-r from-white via-[#eef4ff] to-[#f8fbff] p-5 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#0f172a]">
          Perfil administrador
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Editá tus datos y gestioná la seguridad de tu cuenta de
          administración.
        </p>
      </header>

      <ProfileInfoForm user={user} onUserUpdated={setUser} />
      <PasswordChangeForm />
    </section>
  );
}
