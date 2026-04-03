// components/public/Features/LatestWorks.tsx
import { WorkCard } from "./WorkCard";
import type { IWork } from "@/types/work"; // Importamos tu interfaz principal

// Adaptamos los datos de prueba a tu interfaz exacta IWork
const LATEST_WORKS: IWork[] = [
  {
    id: 1,
    titulo: "Estructura Perimetral",
    descripcion: "Instalación de cerco perimetral de alta seguridad.",
    imagenes: [{ url: "/works/work.jpg" }, { url: "/works/work.jpg" }],
    comentarios: "Trabajo finalizado en tiempo récord.",
    is_active: true,
    puntuacion: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: "Portón Automático",
    descripcion: "Diseño e instalación de portón corredizo.",
    imagenes: [{ url: "/works/work.jpg" }, { url: "/works/work.jpg" }],
    comentarios: "El cliente quedó muy conforme con el motor.",
    is_active: true,
    puntuacion: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    titulo: "Techo Metálico",
    descripcion: "Estructura metálica para cochera doble.",
    imagenes: [{ url: "/works/work.jpg" }, { url: "/works/work.jpg" }],
    comentarios: "Se utilizó material galvanizado.",
    is_active: true,
    puntuacion: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const LatestWorks = () => {
  // Filtramos para asegurar que solo mostramos los activos, 
  // respetando la lógica de tu interfaz
  const works = LATEST_WORKS.filter(work => work.is_active);

  if (!works || works.length === 0) {
    return <div className="p-8 text-center">No hay trabajos para mostrar.</div>;
  }

  return (
    <section id="latest-works" className="w-full bg-[var(--color-bg-secondary)] py-[40px] px-5 md:py-[60px] md:px-8">
      <div className="mx-auto max-w-[1100px]">
        
        <div className="mb-8 text-left md:mb-12">
          <h2 className="mb-4 text-[1.5rem] font-bold text-[var(--color-text)] md:text-[1.875rem]">
            Últimos Trabajos
          </h2>
          <p className="m-0 max-w-[800px] text-[0.95rem] leading-[1.8] text-[var(--color-text-light)]">
            A lo largo de nuestra trayectoria hemos trabajado en grandes obras y
            con pequeños clientes, brindándole a cada uno de ellos la atención
            personalizada y la calidad que requerían.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              titulo={work.titulo}
              descripcion={work.descripcion}
              imagenes={work.imagenes}
              comentarios={work.comentarios}
            />
          ))}
        </div>

      </div>
    </section>
  );
};