import { notFound } from "next/navigation";
import { fetchAPIServer } from "@/lib/apiClient.server";
import type { IWork } from "@/types/work";
import { WorkSurveyClient } from "@/components/public/Features/LatestWorks/WorkSurveyClient";

function normalizeWorksImageUrls(
  imagenes: { url: string }[],
): { url: string }[] {
  if (!imagenes || imagenes.length === 0) return [];

  return imagenes.map((img) => {
    // Si ya viene proxyeada, la respetamos.
    if (img.url.startsWith("/api/backend/")) {
      return img;
    }

    // Si viene como ruta relativa de uploads, la pasamos por el proxy del frontend.
    if (img.url.startsWith("/uploads/")) {
      return { url: `/api/backend${img.url}` };
    }

    // Otras rutas relativas locales se mantienen.
    if (img.url.startsWith("/")) {
      return img;
    }

    try {
      const parsed = new URL(img.url);
      if (parsed.pathname.startsWith("/uploads/")) {
        return { url: `/api/backend${parsed.pathname}${parsed.search}` };
      }
    } catch {
      // Si no se puede parsear, devolvemos el valor original.
    }

    return img;
  });
}

async function getWorkForSurvey(workId: number): Promise<IWork> {
  const work = await fetchAPIServer<IWork>(`/ultimos-trabajos/${workId}`);

  return {
    ...work,
    imagenes: normalizeWorksImageUrls(work.imagenes),
  };
}

export default async function WorkSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workId = Number(id);

  if (!Number.isFinite(workId) || workId <= 0) {
    notFound();
  }

  try {
    const work = await getWorkForSurvey(workId);
    return <WorkSurveyClient work={work} />;
  } catch {
    notFound();
  }
}
