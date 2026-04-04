// components/public/Features/LatestWorks.tsx
import { WorkCard } from "./WorkCard";
import type { IWork } from "@/types/work";
import { fetchAPIServer } from "@/lib/apiClient.server";

// Datos de prueba (Fallback)
const LATEST_WORKS_PRUEBA: IWork[] = [
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
  // ... (tus otros datos de prueba se mantienen igual)
];

/**
 * Normaliza un array de imágenes.
 * Devuelve siempre el formato { url: string }[] que espera IWork y WorkCard.
 */
function normalizeWorksImageUrls(
  imagenes: { url: string }[],
): { url: string }[] {
  if (!imagenes || imagenes.length === 0) return [];

  return imagenes.map((img) => {
    // Si ya es una ruta relativa local, la dejamos tal cual
    if (img.url.startsWith("/")) {
      return img;
    }

    try {
      const parsed = new URL(img.url);
      // Si la URL viene del backend con la ruta de uploads, la parseamos por el proxy/api
      if (parsed.pathname.startsWith("/uploads/")) {
        return { url: `/api/backend${parsed.pathname}${parsed.search}` };
      }
    } catch {
      // Si el new URL falla (no es una URL válida absoluta), devolvemos la original silenciosamente
    }

    return img; // Retornamos la imagen sin modificar si no cumple las condiciones anteriores
  });
}

/**
 * Función para obtener los trabajos desde el backend
 */
async function getLatestWorksData(): Promise<IWork[]> {
  try {
    const latestData = await fetchAPIServer<IWork[]>(
      "/ultimos-trabajos/active",
    );

    // Mapeamos los datos para normalizar SOLAMENTE el array de imágenes
    // manteniendo el resto de la estructura IWork intacta.
    const latestWorks = latestData.map((work) => ({
      ...work,
      imagenes: normalizeWorksImageUrls(work.imagenes),
    }));

    console.log("Latest works data fetched successfully");
    return latestWorks;
  } catch (error) {
    console.error("Error fetching latest works data, using fallback:", error);
    return LATEST_WORKS_PRUEBA; // Fallback a datos de prueba en caso de que el backend falle
  }
}

// Convertimos el componente en un Server Component asíncrono
export const LatestWorks = async () => {
  // 1. Obtenemos los datos (reales o el fallback si falla)
  const allWorks = await getLatestWorksData();

  // 2. Filtramos para asegurar que solo mostramos los activos
  const activeWorks = allWorks.filter((work) => work.is_active);

  if (!activeWorks || activeWorks.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--color-text)]">
        No hay trabajos para mostrar.
      </div>
    );
  }

  return (
    <section
      id="latest-works"
      className="w-full bg-[var(--color-bg-secondary)] py-[40px] px-5 md:py-[60px] md:px-8"
    >
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
          {activeWorks.map((work) => (
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
