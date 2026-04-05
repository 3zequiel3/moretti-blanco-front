// components/public/Banner.tsx
import { Carrousel } from "./Carrousel";
import type { IBanner } from "@/types/banner";
import { fetchAPIServer } from "@/lib/apiClient.server";

const slidesDePrueba: IBanner[] = [
  {
    id: 1,
    image_url: "/carrousel_img/carrousel1.jpg",
    descripcion: "Estructuras metalicas de alta resistencia",
    orden: 1,
    is_active: true,
  },
  {
    id: 2,
    image_url: "/carrousel_img/carrousel2.jpg",
    descripcion: "Diseno y precision en cada trabajo",
    orden: 2,
    is_active: true,
  },
  {
    id: 3,
    image_url: "/carrousel_img/carrousel3.jpg",
    descripcion: "Soluciones industriales a medida",
    orden: 3,
    is_active: true,
  },
];

function normalizeBannerImageUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl;

  // Si ya es relativa/local, mantener.
  if (imageUrl.startsWith("/")) return imageUrl;

  try {
    const parsed = new URL(imageUrl);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `/api/backend${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // Si no es URL valida, devolver tal como vino.
  }

  return imageUrl;
}

async function getBannerData(): Promise<IBanner[]> {
  try {
    const bannerData = await fetchAPIServer<IBanner[]>("/carrousel");
    const normalizedBanners = bannerData.map((banner) => ({
      ...banner,
      image_url: normalizeBannerImageUrl(banner.image_url),
    }));
    console.log("Banner data fetched successfully:", normalizedBanners);
    return normalizedBanners;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return slidesDePrueba; // Fallback a datos de prueba
  }
}

export const Banner = async () => {
  const slides = await getBannerData();

  return (
    <section>
      <Carrousel slides={slides} />
    </section>
  );
};
