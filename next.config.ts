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
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || "",
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
  process.env.NEXT_PUBLIC_STORAGE_URL || process.env.BACKEND_PUBLIC_URL,
  "/**",
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
      ...(storagePattern ? [storagePattern] : []),
    ],
  },
};

export default nextConfig;
