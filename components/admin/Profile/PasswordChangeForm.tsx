"use client";

import { useState } from "react";
import { changeAdminPassword } from "@/lib/userService";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y su confirmación deben coincidir.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await changeAdminPassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });

      setStatus(response.message || "Contraseña actualizada.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo cambiar la contraseña.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-[#d8dee6] bg-white p-5 shadow-sm"
    >
      <div className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-sm text-[#475569]">
        Primero ingresá tu contraseña actual y luego definí la nueva contraseña
        dos veces.
      </div>

      <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
        Contraseña actual
        <input
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="rounded-xl border border-[#d8dee6] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2563eb]"
          required
        />
      </label>

      <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
        Nueva contraseña
        <input
          type="password"
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="rounded-xl border border-[#d8dee6] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2563eb]"
          required
        />
      </label>

      <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
        Repetir nueva contraseña
        <input
          type="password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="rounded-xl border border-[#d8dee6] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2563eb]"
          required
        />
      </label>

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
        className="w-fit rounded-xl bg-[#c41e3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a01830] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Actualizando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
