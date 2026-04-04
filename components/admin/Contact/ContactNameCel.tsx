"use client";

type ContactNameCelProps = {
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  disabled?: boolean;
};

export function ContactNameCel({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  disabled = false,
}: ContactNameCelProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[#e6e7eb] bg-[#f8f9fb] p-4 md:p-5">
      <div>
        <h2 className="text-lg font-semibold text-[#1f2937]">
          Información principal
        </h2>
        <p className="text-xs text-[#6b7280]">
          Estos datos se muestran como contacto principal en el sitio.
        </p>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-[#6b7280]">Nombre</span>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="w-full rounded-lg border border-[#e6e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#c41e3a] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.15)]"
          disabled={disabled}
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-[#6b7280]">
          Teléfono de contacto
        </span>
        <input
          type="text"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          className="w-full rounded-lg border border-[#e6e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#c41e3a] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.15)]"
          disabled={disabled}
          required
        />
      </label>
    </div>
  );
}
