import { ApiError } from "./types";

const DEFAULT_TIMEOUT_MS = 10_000;
const PRODUCTION_API_BASE_URL = "https://connector.lucysellercopilot.online";

export function apiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API_BASE_URL;
  }
  if (!baseUrl) {
    throw new ApiError("The API base URL is not configured.", "unavailable");
  }
  return baseUrl.replace(/\/$/, "");
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const endpoint = `${apiBaseUrl()}${path}`;
    if (path === "/frontend-api/lucy/chat") console.info(`[LUCY_CHAT_FRONTEND] endpoint=${endpoint}`);
    const response = await fetch(endpoint, {
      ...init,
      credentials: "include",
      headers: { Accept: "application/json", ...init.headers },
      signal: controller.signal,
    });

    if (path === "/frontend-api/lucy/chat") {
      console.info(`[LUCY_CHAT_HTTP] status=${response.status}`);
      console.info(`[LUCY_CHAT_CONTENT_TYPE] ${response.headers.get("content-type") ?? "missing"}`);
    }

    if (response.status === 401) {
      throw new ApiError("Your session has expired.", "unauthenticated", response.status);
    }
    if (!response.ok) {
      let publicCode = "request_failed";
      let publicMessage = "The request could not be completed.";
      try {
        const payload = await response.clone().json() as { error?: unknown; message?: unknown };
        if (typeof payload.error === "string") publicCode = payload.error;
        if (typeof payload.message === "string") publicMessage = payload.message;
        if (path === "/frontend-api/lucy/chat") console.info(`[LUCY_CHAT_ERROR_CODE] ${publicCode}`);
      } catch {
        if (path === "/frontend-api/lucy/chat") console.info("[LUCY_CHAT_ERROR_CODE] invalid_backend_response");
      }
      throw new ApiError(publicMessage, publicCode, response.status);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (path === "/frontend-api/lucy/chat") {
      const keys = contentType.includes("application/json") ? Object.keys((await response.clone().json()) as Record<string, unknown> ?? {}) : ["non_json"];
      console.info(`[LUCY_CHAT_RESPONSE_KEYS] ${keys.join(",")}`);
    }

    try {
      if (contentType.includes("application/json")) {
        return (await response.json()) as T;
      }
      throw new ApiError("The API returned a non-JSON response.", "invalid_backend_response", response.status);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("The API returned an invalid response.", "invalid_response", response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request timed out.", "timeout");
    }
    throw new ApiError(error instanceof TypeError ? "The API network request failed." : "The API is unavailable.", error instanceof TypeError ? "network_error" : "unavailable");
  } finally {
    window.clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) }),
  upload: <T>(path: string, body: FormData) => apiRequest<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
