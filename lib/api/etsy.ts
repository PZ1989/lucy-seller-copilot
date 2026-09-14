import { api } from "./client";
import type { EtsyConnection, EtsyDraftInput, EtsyDraftWriteResponse, EtsyListingDetail, EtsyListingsApiResponse, EtsyListingsResponse, EtsyProfilesResponse, EtsyReadinessProfilesApiResponse, EtsyReviewsApiResponse, EtsyReviewsResponse, EtsyShippingProfilesApiResponse, EtsyStats } from "./types";

type PageOptions = {
  limit?: number;
  offset?: number;
  state?: "active" | "draft";
};

function pageQuery({ limit = 25, offset = 0, state }: PageOptions = {}) {
  const params = new URLSearchParams({
    limit: String(Math.min(Math.max(limit, 1), 100)),
    offset: String(Math.max(offset, 0)),
  });
  if (state) params.set("state", state);
  return `?${params.toString()}`;
}

export function getEtsyConnection() {
  return api.get<EtsyConnection>("/frontend-api/etsy/connection");
}

export function getEtsyListings(options?: PageOptions) {
  const { limit = 25, offset = 0 } = options ?? {};
  return api.get<EtsyListingsApiResponse>(`/frontend-api/etsy/listings${pageQuery(options)}`).then((response): EtsyListingsResponse => ({
    listings: response.items ?? [],
    pagination: { limit, offset, total: response.total ?? undefined },
  }));
}

export function getEtsyListing(listingId: string | number) {
  return api.get<EtsyListingDetail>(`/frontend-api/etsy/listings/${encodeURIComponent(String(listingId))}`);
}

export function getEtsyStats() {
  return api.get<EtsyStats>("/frontend-api/etsy/stats");
}

export function getEtsyShippingProfiles() {
  return api.get<EtsyShippingProfilesApiResponse>("/frontend-api/etsy/shipping-profiles").then((response): EtsyProfilesResponse => ({
    profiles: (response.items ?? []).flatMap((profile) => profile.shippingProfileId == null || !profile.title ? [] : [{ id: profile.shippingProfileId, name: profile.title }]),
  }));
}

function readinessDescription(profile: NonNullable<EtsyReadinessProfilesApiResponse["items"]>[number], locale: "en" | "uk") {
  const processingTime = [profile.minProcessingTime, profile.maxProcessingTime].filter((value): value is number => typeof value === "number");
  if (processingTime.length === 0) return null;
  const range = processingTime.length === 2 && processingTime[0] !== processingTime[1] ? `${processingTime[0]}–${processingTime[1]}` : String(processingTime[0]);
  if (profile.processingTimeUnit === "business_days") return `${range} ${locale === "uk" ? "робочих днів" : "business days"}`;
  return range;
}

export function getEtsyReadinessProfiles(locale: "en" | "uk" = "en") {
  return api.get<EtsyReadinessProfilesApiResponse>("/frontend-api/etsy/readiness-profiles").then((response): EtsyProfilesResponse => ({
    profiles: (response.items ?? []).flatMap((profile) => profile.readinessStateId == null || !profile.readinessState ? [] : [{
      id: profile.readinessStateId,
      name: profile.readinessState,
      description: readinessDescription(profile, locale),
    }]),
  }));
}

export function searchEtsyTaxonomy(query: string) {
  return api.get<{ items?: Array<{ taxonomyId: string | number; name: string; path: string | string[] }> }>(`/frontend-api/etsy/taxonomy?query=${encodeURIComponent(query)}`).then((response) => response.items ?? []);
}

export function generateLucyListing(prompt: string, language: "uk" | "en", productType: "physical" | "download", provider?: "openai" | "claude") {
  return api.post<import("./types").LucyListingGeneration>("/frontend-api/lucy/listings/generate", { prompt, language, productType, provider });
}

export function getLucyProviderStatus() {
  return api.get<import("./types").LucyProviderStatus>("/frontend-api/lucy/providers");
}

export function optimizeLucyListing(input: { title: string; description: string; tags: string[]; materials?: string[]; productType?: "physical" | "digital"; language: "uk" | "en"; provider?: "openai" | "claude" }) {
  return api.post<import("./types").LucyListingOptimization>("/frontend-api/lucy/listings/optimize", input);
}

export function createEtsyDraft(input: EtsyDraftInput) {
  return api.post<EtsyDraftWriteResponse>("/frontend-api/etsy/listings/draft", input);
}

export function updateEtsyDraft(listingId: string | number, input: EtsyDraftInput) {
  return api.patch<EtsyDraftWriteResponse>(`/frontend-api/etsy/listings/${encodeURIComponent(String(listingId))}/draft`, input);
}

export function uploadEtsyDraftImage(listingId: string | number, file: File) {
  const data = new FormData();
  data.append("image", file);
  return api.upload<EtsyDraftWriteResponse>(`/frontend-api/etsy/listings/${encodeURIComponent(String(listingId))}/images`, data);
}

export function getEtsyReviews(options?: PageOptions) {
  const { limit = 25, offset = 0 } = options ?? {};
  return api.get<EtsyReviewsApiResponse>(`/frontend-api/etsy/reviews${pageQuery(options)}`).then((response): EtsyReviewsResponse => ({
    reviews: response.items ?? [],
    pagination: { limit, offset, total: response.total ?? undefined },
  }));
}

export async function disconnectEtsy(shopId?: string) {
  return api.post<EtsyConnection>("/frontend-api/etsy/disconnect", shopId ? { shop_id: shopId } : {});
}

export function etsyOAuthStartUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) throw new Error("The API base URL is not configured.");
  return `${baseUrl.replace(/\/$/, "")}/oauth/etsy/start`;
}
