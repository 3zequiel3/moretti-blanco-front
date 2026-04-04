import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

function buildTargetUrl(pathParts: string[], search: string): string {
  const normalizedBase = BACKEND_BASE_URL.replace(/\/$/, "");
  const path = pathParts.join("/");
  const url = path
    ? `${normalizedBase}/${path}${search}`
    : `${normalizedBase}${search}`;

  return url;
}

function resolvePathParts(
  request: NextRequest,
  params: { path?: string[] },
): string[] {
  const fromParams = params.path ?? [];
  if (fromParams.length > 0) {
    return fromParams;
  }

  const prefix = "/api/backend/";
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith(prefix)) {
    return [];
  }

  const fromPathname = pathname.slice(prefix.length).split("/").filter(Boolean);
  return fromPathname;
}

type PreparedBody =
  | { kind: "none" }
  | { kind: "buffer"; value: ArrayBuffer }
  | { kind: "form"; value: FormData };

function cloneFormData(source: FormData): FormData {
  const cloned = new FormData();
  for (const [key, value] of source.entries()) {
    if (value instanceof File) {
      cloned.append(key, value, value.name);
    } else {
      cloned.append(key, value);
    }
  }
  return cloned;
}

async function refreshSession(
  refreshToken: string,
): Promise<LoginResponse | null> {
  const normalizedBase = BACKEND_BASE_URL.replace(/\/$/, "");
  const refreshUrl = `${normalizedBase}/users/refresh`;

  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `mb_refresh_token=${encodeURIComponent(refreshToken)}`,
    },
    body: "{}",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function proxyToBackend(
  request: NextRequest,
  params: { path?: string[] },
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("mb_access_token")?.value;
  const refreshToken = cookieStore.get("mb_refresh_token")?.value;
  const pathParts = resolvePathParts(request, params);
  const targetUrl = buildTargetUrl(pathParts, request.nextUrl.search);
  const endpointPath = pathParts.join("/");

  console.log("🔍 PROXY DEBUG:", {
    pathname: request.nextUrl.pathname,
    pathParts,
    targetUrl,
    method: request.method,
  });

  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const isFormData = Boolean(contentType?.includes("multipart/form-data"));

  const buildHeaders = (token?: string): Headers => {
    const headers = new Headers();

    // Con FormData dejamos que fetch calcule boundary automáticamente.
    if (contentType && !isFormData) {
      headers.set("Content-Type", contentType);
    }
    if (accept) {
      headers.set("Accept", accept);
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  };

  let preparedBody: PreparedBody = { kind: "none" };

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (isFormData) {
      preparedBody = { kind: "form", value: await request.formData() };
      console.log("📦 FormData detected - using parsed FormData body");
    } else {
      preparedBody = { kind: "buffer", value: await request.arrayBuffer() };
      console.log("📝 JSON/other detected - using buffer");
    }
  }

  const executeRequest = async (token?: string): Promise<Response> => {
    const init: RequestInit = {
      method: request.method,
      headers: buildHeaders(token),
      cache: "no-store",
    };

    if (preparedBody.kind === "buffer") {
      init.body = preparedBody.value;
    }
    if (preparedBody.kind === "form") {
      init.body = cloneFormData(preparedBody.value);
    }

    return fetch(targetUrl, init);
  };

  console.log("🔍 INIT CONFIG:", {
    method: request.method,
    contentType,
    hasBody: preparedBody.kind !== "none",
    bodyKind: preparedBody.kind,
  });

  // Hacer el fetch
  let backendResponse: Response;
  try {
    backendResponse = await executeRequest(accessToken);
    console.log("✅ BACKEND RESPONSE:", {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      url: backendResponse.url,
    });

    const shouldTryRefresh =
      backendResponse.status === 401 &&
      Boolean(refreshToken) &&
      !endpointPath.startsWith("users/login") &&
      !endpointPath.startsWith("users/refresh") &&
      !endpointPath.startsWith("users/logout");

    if (shouldTryRefresh) {
      const refreshedSession = await refreshSession(refreshToken!);

      if (refreshedSession) {
        cookieStore.set({
          name: "mb_access_token",
          value: refreshedSession.access_token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: refreshedSession.expires_in,
        });

        cookieStore.set({
          name: "mb_refresh_token",
          value: refreshedSession.refresh_token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: REFRESH_COOKIE_MAX_AGE,
        });

        backendResponse = await executeRequest(refreshedSession.access_token);
      } else {
        cookieStore.delete("mb_access_token");
        cookieStore.delete("mb_refresh_token");
      }
    }
  } catch (error: any) {
    console.error("❌ BACKEND FETCH ERROR:", {
      error: error.message,
      targetUrl,
    });
    throw error;
  }

  // Procesar respuesta
  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");

  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }

  const setCookie = backendResponse.headers.get("set-cookie");
  if (setCookie) {
    responseHeaders.append("Set-Cookie", setCookie);
  }

  if (backendResponse.status === 204) {
    return new NextResponse(null, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  }

  const body = await backendResponse.arrayBuffer();
  return new NextResponse(body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return proxyToBackend(request, resolvedParams);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return proxyToBackend(request, resolvedParams);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return proxyToBackend(request, resolvedParams);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return proxyToBackend(request, resolvedParams);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return proxyToBackend(request, resolvedParams);
}
