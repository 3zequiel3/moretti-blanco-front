// components/public/Values.tsx
import Image from "next/image";

export const Values = () => {
  return (
    // Reemplaza .section (Nota: uso bg-white equivalente a #ffffff)
    <section className="w-full bg-white py-[60px] px-8">
      
      {/* Reemplaza .container (Mobile First: flex-col, luego md:flex-row) */}
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-[20px] md:flex-row md:gap-[40px]">
        
        {/* Reemplaza .valuesText */}
        <div className="flex-1">
          <h2 className="mb-6 text-[1.5rem] font-bold text-[var(--color-text)] md:text-[1.875rem]">
            Nuestros Valores
          </h2>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">Compromiso</strong> en cada obra.
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">Experiencia:</strong> Nos avalan la alta calidad y atención
            a los detalles garantizando la seguridad y durabilidad.
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">Calidad:</strong> Trabajamos con materiales de las mejores
            empresas del país.
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            <strong className="font-semibold text-[var(--color-text)]">Resultados:</strong> Trabajamos de manera seria con
            excelentes tiempos de entrega y eficiencia en cada tarea.
          </p>
        </div>

        {/* Reemplaza .valuesImage */}
        <div className="flex w-full flex-1 justify-center">
          <Image
            src="/values/values.jpg"
            alt="Nuestros Valores - Compromiso y Calidad"
            width={600} // Ancho base para calcular la proporción
            height={400} // Alto base para calcular la proporción
            className="h-auto w-full rounded-[6px] object-cover"
          />
        </div>

      </div>
    </section>
  );
};