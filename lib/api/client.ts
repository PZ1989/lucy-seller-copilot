import { ApiError } from "./types";

const DEFAULT_TIMEOUT_MS = 10_000;

export function apiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new ApiError("The API base URL is not configured.", "unavailable");
  }
  return baseUrl.replace(/\/$/, "");
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers: { Accept: "application/json", ...init.headers },
      signal: controller.signal,
    });

    if (response.status === 401) {
      throw new ApiError("Your session has expired.", "unauthenticated", response.status);
    }
    if (!response.ok) {
      throw new ApiError("The request could not be completed.", "request_failed", response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError("The API returned an invalid response.", "invalid_response", response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request timed out.", "timeout");
    }
    throw new ApiError("The API is unavailable.", "unavailable");
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
