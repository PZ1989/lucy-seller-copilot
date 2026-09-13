import { api } from "./client";
import type { BrowserSession } from "./types";

export function getSession() {
  return api.get<BrowserSession>("/frontend-api/session");
}
