"use client";

export type LinkEntry = {
  key: string;
  value: string;
};

type ContactLinksProps = {
  entries: LinkEntry[];
  onAddPreset?: (preset: string) => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: "key" | "value", value: string) => void;
  disabled?: boolean;
};

export function ContactLinks({
  entries,
  onAddPreset,
  onRemove,
  onChange,
  disabled = false,
}: ContactLinksProps) {
  const presets = [
    "WhatsApp",
    "Instagram",
    "Facebook",
    "LinkedIn",
    "Solicitar presupuesto",
  ];

  const normalizeKey = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const hasPreset = (preset: string) => {
    const normalizedPreset = normalizeKey(preset);
    return entries.some((entry) => {
      const key = normalizeKey(entry.key);
      return key === normalizedPreset;
    });
  };

  const getDisplayKey = (key: string) => {
    const normalized = normalizeKey(key);
    if (normalized === "solicitar presupuesto") {
      return "Solicitar presupuesto";
    }
    return key;
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#e6e7eb] bg-[#f8f9fb] p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1f2937]">Botones</h3>
          <p className="text-xs text-[#6b7280]">
            Agrega solo canales permitidos para la vista publica.
          </p>
        </div>
      </div>

      {onAddPreset && (
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onAddPreset(preset)}
              disabled={disabled || hasPreset(preset)}
              className="rounded-full border border-[#e6e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#4b5563] transition hover:border-[#f0b8c2] hover:text-[#c41e3a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              + {preset}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {entries.length === 0 && (
          <p className="rounded-xl border border-dashed border-[#e6e7eb] bg-white px-3 py-3 text-sm text-[#6b7280]">
            No hay links configurados. Usa los botones de arriba para
            agregarlos.
          </p>
        )}

        {entries.map((entry, index) => (
          <div
            key={`contact-link-${index}`}
            className="grid grid-cols-1 gap-2 rounded-xl border border-[#eef0f3] bg-white p-3 md:grid-cols-[minmax(160px,0.9fr)_minmax(240px,1.8fr)_auto]"
          >
            <input
              type="text"
              placeholder="Canal"
              value={getDisplayKey(entry.key)}
              onChange={(event) => onChange(index, "key", event.target.value)}
              className="rounded-lg border border-[#e6e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#c41e3a] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.15)]"
              disabled
              readOnly
            />
            <input
              type="url"
              placeholder="https://..."
              value={entry.value}
              onChange={(event) => onChange(index, "value", event.target.value)}
              className="rounded-lg border border-[#e6e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#c41e3a] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.15)]"
              disabled={disabled}
            />
            <button
              type="button"
              className="h-10 min-w-10 rounded-lg border border-[#f2d0d6] bg-white px-3 text-sm font-semibold text-[#a94456] transition hover:bg-[#fff5f7] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => onRemove(index)}
              disabled={disabled}
              title="Eliminar link"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
