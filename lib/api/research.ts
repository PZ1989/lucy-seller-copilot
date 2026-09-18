import { api } from "./client";
import type { MarketResearchResponse } from "./types";

export type MarketResearchInput = { query: string; mode: string; country: string };

export function runMarketResearch(input: MarketResearchInput) {
  return api.post<MarketResearchResponse>("/frontend-api/research", input);
}
