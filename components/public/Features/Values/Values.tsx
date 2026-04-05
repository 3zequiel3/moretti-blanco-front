// components/public/Values.tsx
import Image from "next/image";

export const Values = () => {
  return (
    <section className="section-reveal w-full bg-[linear-gradient(180deg,#f7f8fb_0%,#eef2f8_100%)] px-5 py-[72px] md:px-8 md:py-[88px]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-6 rounded-[22px] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)] md:flex-row md:gap-10 md:p-8">
        {/* Reemplaza .valuesText */}
        <div className="flex-1">
          <h2 className="mb-6 text-[1.6rem] font-bold text-[var(--color-text)] md:text-[2rem]">
            Nuestros Valores
          </h2>
          <p className="mb-4 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">
              Compromiso
            </strong>{" "}
            en cada obra.
          </p>
          <p className="mb-4 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">
              Experiencia:
            </strong>{" "}
            Nos avalan la alta calidad y atención a los detalles garantizando la
            seguridad y durabilidad.
          </p>
          <p className="mb-4 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">
              Calidad:
            </strong>{" "}
            Trabajamos con materiales de las mejores empresas del país.
          </p>
          <p className="mb-0 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">
              Resultados:
            </strong>{" "}
            Trabajamos de manera seria con excelentes tiempos de entrega y
            eficiencia en cada tarea.
          </p>
        </div>

        {/* Reemplaza .valuesImage */}
        <div className="flex w-full flex-1 justify-center">
          <Image
            src="/values/values.jpg"
            alt="Nuestros Valores - Compromiso y Calidad"
            width={600}
            height={400}
            className="h-auto w-full rounded-[14px] border border-[var(--color-border)] object-cover"
          />
        </div>
      </div>
    </section>
  );
};
