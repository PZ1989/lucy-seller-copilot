import { api } from "./lib/api/client";
import type { BillingStatus } from "./types";

export function getBillingStatus() {
  return api.get<BillingStatus>("/frontend-api/billing/status");
}
