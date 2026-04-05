import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const isDev = process.env.NODE_ENV !== "production";

function buildRemotePattern(
  rawUrl: string | undefined,
  pathname: string,
): RemotePattern | null {
  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    return {
      protocol: parsed.protocol === "http:" ? "http" : "https",
      hostname: parsed.hostname,
      port: parsed.port,
      pathname,
    };
  } catch {
    return null;
  }
}

const backendPattern = buildRemotePattern(
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL,
  "/uploads/**",
);

const storagePattern = buildRemotePattern(
  process.env.NEXT_PUBLIC_STORAGE_URL || "https://t3.storageapi.dev",
  "/**",
);

const railwayBackendPattern = buildRemotePattern(
  process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL ||
    "https://moretti-blanco-back-production.up.railway.app",
  "/uploads/**",
);

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      ...(backendPattern ? [backendPattern] : []),
      ...(railwayBackendPattern ? [railwayBackendPattern] : []),
      ...(storagePattern ? [storagePattern] : []),
    ],
  },
};

export default nextConfig;
