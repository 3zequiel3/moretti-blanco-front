// components/public/About.tsx
import Image from "next/image";

export const About = () => {
  return (
    <section
      id="about"
      className="section-reveal w-full bg-[var(--color-bg-secondary)] px-5 py-[72px] md:px-8 md:py-[88px]"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-6 rounded-[22px] border border-[var(--color-border)] bg-white/85 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.09)] md:flex-row md:gap-10 md:p-8">
        {/* Reemplaza .aboutText */}
        <div className="flex-1">
          <h2 className="mb-5 text-[1.6rem] font-bold text-[var(--color-text)] md:text-[2rem]">
            Quiénes Somos
          </h2>
          <p className="mb-4 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            Somos una empresa familiar con más de 5 años de experiencia en el
            mercado.
          </p>
          <p className="mb-4 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            A lo largo de nuestra trayectoria hemos trabajado en grandes obras y
            con pequeños clientes, brindándole a cada uno de ellos la atención
            personalizada y la calidad que requerían.
          </p>
          <p className="mb-0 text-[0.96rem] leading-[1.82] text-[var(--color-text-light)]">
            Nos dedicamos a la instalación de cercos perimetrales, portones,
            automatizaciones y metalúrgica en general.
          </p>
        </div>

        {/* Reemplaza .aboutImage */}
        <div className="flex w-full flex-1 justify-center">
          <Image
            src="/about/about.jpg"
            alt="Quiénes Somos - Instalaciones y Metalúrgica"
            width={600}
            height={400}
            className="h-auto w-full rounded-[14px] border border-[var(--color-border)] object-cover"
          />
        </div>
      </div>
    </section>
  );
};
