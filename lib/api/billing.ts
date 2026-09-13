import { api } from "./client";
import type { BillingStatus } from "./types";

export function getBillingStatus() {
  return api.get<BillingStatus>("/frontend-api/billing/status");
}
