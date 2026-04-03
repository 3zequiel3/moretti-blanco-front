// components/public/About.tsx
import Image from "next/image";

export const About = () => {
  return (
    // Reemplaza .section
    <section 
      id="about" 
      className="w-full bg-[var(--color-bg-secondary)] py-[60px] px-8"
    >
      {/* Reemplaza .container (Mobile First: flex-col, luego md:flex-row) */}
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-[20px] md:flex-row md:gap-[40px]">
        
        {/* Reemplaza .aboutText */}
        <div className="flex-1">
          <h2 className="mb-5 text-[1.5rem] font-bold text-[var(--color-text)] md:text-[1.875rem]">
            Quiénes Somos
          </h2>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            Somos una empresa familiar con más de 5 años de experiencia en el
            mercado.
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            A lo largo de nuestra trayectoria hemos trabajado en grandes obras y
            con pequeños clientes, brindándole a cada uno de ellos la atención
            personalizada y la calidad que requerían.
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            Nos dedicamos a la instalación de cercos perimetrales, portones,
            automatizaciones y metalúrgica en general.
          </p>
        </div>

        {/* Reemplaza .aboutImage */}
        <div className="flex w-full flex-1 justify-center">
          {/* El width y height aquí son solo para que Next calcule el "aspect-ratio". 
            Las clases w-full y h-auto son las que realmente dictan su tamaño en pantalla. 
          */}
          <Image
            src="/about/about.jpg"
            alt="Quiénes Somos - Instalaciones y Metalúrgica"
            width={600}
            height={400}
            className="h-auto w-full rounded-[6px] object-cover"
          />
        </div>
        
      </div>
    </section>
  );
};