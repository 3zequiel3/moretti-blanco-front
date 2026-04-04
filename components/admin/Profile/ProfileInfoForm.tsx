"use client";

import { useEffect, useState } from "react";
import type { AdminUser } from "@/types/user";
import { updateAdminProfile } from "@/lib/userService";

type ProfileInfoFormProps = {
  user: AdminUser;
  onUserUpdated: (user: AdminUser) => void;
};

export function ProfileInfoForm({ user, onUserUpdated }: ProfileInfoFormProps) {
  const [nombre, setNombre] = useState(user.nombre);
  const [username, setUsername] = useState(user.username);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.foto_url);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(user.foto_url);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, user.foto_url]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);
    setError(null);

    try {
      const updated = await updateAdminProfile({
        nombre,
        username,
        foto: file,
      });

      setFile(null);
      setStatus("Perfil actualizado correctamente.");
      onUserUpdated(updated);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo actualizar el perfil.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-2xl border border-[#d8dee6] bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#d8dee6] bg-[#eff4ff]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#2563eb]">
              {nombre.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center rounded-xl border border-[#d8dee6] bg-[#f8fafc] px-4 py-2 text-sm font-semibold text-[#334155] transition hover:border-[#c41e3a] hover:text-[#c41e3a]">
          Cambiar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              setFile(next);
            }}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
          Nombre
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="rounded-xl border border-[#d8dee6] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2563eb]"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
          Usuario
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="rounded-xl border border-[#d8dee6] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2563eb]"
            required
          />
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}
      {status && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-fit rounded-xl bg-[#0f172a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
