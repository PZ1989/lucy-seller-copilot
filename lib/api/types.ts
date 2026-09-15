export type UserPlan = "pro" | "multi_store";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  accountStatus: string;
};

export type BrowserSession = {
  authenticated: true;
  user: AuthenticatedUser;
};

export type EtsyConnectionHealth = "connected" | "expired" | "needs_attention" | "sync_error" | "loading" | "not_connected";

export type EtsyConnection = {
  connected: boolean;
  shopId: string | null;
  shopName: string | null;
  lastSyncAt: string | null;
  permissions: string[];
  connectionHealth: EtsyConnectionHealth | null;
};

export type EtsyPaging = {
  limit?: number;
  offset?: number;
  total?: number;
};

export type EtsyListing = {
  listingId: string | number;
  title: string;
  state: string;
  price: { amount: number; currency: string | null } | null;
  quantity: number | null;
  views: number | null;
  favorites: number | null;
  url: string | null;
  updatedAt: string | null;
  thumbnailUrl: string | null;
};

export type EtsyListingDetail = EtsyListing & {
  description: string | null;
  images: Array<{ url: string; alt?: string | null }>;
  tags?: string[];
  materials?: string[];
  taxonomyId?: string | number | null;
};

export type EtsyDraftInput = {
  title: string;
  description?: string;
  price?: number;
  quantity?: number;
  type?: "physical" | "download";
  whoMade?: "i_did" | "someone_else" | "collective";
  whenMade?: EtsyWhenMade;
  taxonomyId?: string | number;
  tags?: string[];
  materials?: string[];
  shippingProfileId?: string | number;
  readinessStateId?: string | number;
};

export type EtsyWhenMade =
  | "made_to_order"
  | "2020_2026"
  | "2010_2019"
  | "2007_2009"
  | "before_2007"
  | "2000_2006"
  | "1990s"
  | "1980s"
  | "1970s"
  | "1960s"
  | "1950s"
  | "1940s"
  | "1930s"
  | "1920s"
  | "1910s"
  | "1900s"
  | "1800s"
  | "1700s"
  | "before_1700";

export type EtsyProfile = {
  id: string | number;
  name: string;
  description?: string | null;
};

export type EtsyShippingProfilesApiResponse = {
  items?: Array<{
    shippingProfileId?: string | number | null;
    title?: string | null;
  }> | null;
};

export type EtsyReadinessProfilesApiResponse = {
  items?: Array<{
    readinessStateId?: string | number | null;
    readinessState?: string | null;
    minProcessingTime?: number | null;
    maxProcessingTime?: number | null;
    processingTimeUnit?: string | null;
  }> | null;
};

export type EtsyProfilesResponse = {
  profiles: EtsyProfile[];
};

export type EtsyDraftWriteResponse = {
  listingId: string | number;
  state: string;
};

export type LucyListingGeneration = {
  provider: "openai" | "anthropic" | "claude";
  title: string;
  description: string;
  tags: string[];
  materials: string[];
  suggestedPrice: number | null;
  quantity: number;
  whoMade: EtsyDraftInput["whoMade"];
  whenMade: EtsyWhenMade;
  productType: "physical" | "download";
  categorySuggestion: string | { label: string; query: string } | null;
};

export type LucyListingOptimization = {
  provider: "openai" | "anthropic" | "claude";
  improvedTitle: string;
  improvedDescription: string;
  improvedTags: string[];
  improvedMaterials?: string[];
  recommendations: string[];
};

export type LucyProviderStatus = { openai: boolean; anthropic: boolean; defaultProvider: "auto" | "openai" | "anthropic" };
export type LucyCreditStatus = { plan: "pro" | "multi_store"; monthlyAllowance: number; monthlyRemaining: number; purchasedRemaining: number; totalAvailable: number; billingCycleEndsAt: string; usagePercent: number };
export type LucyChatResponse = { response: string; suggestions?: string[] };
export type LucyConnection = { connected: boolean; fingerprint: string | null; lastVerifiedAt: string | null };
export type LucyConnections = { openai: LucyConnection; anthropic: LucyConnection };

export type EtsyListingsApiResponse = {
  items?: EtsyListing[] | null;
  total?: number | null;
};

export type EtsyListingsResponse = {
  listings: EtsyListing[];
  pagination?: EtsyPaging;
};

export type EtsyStats = {
  activeListings: number;
  views: number | null;
  favorites: number | null;
};

export type EtsyReview = {
  reviewId: string | number;
  rating: number | null;
  message: string | null;
  createdAt: string | null;
  listingId: string | number | null;
};

export type EtsyReviewsApiResponse = {
  items?: EtsyReview[] | null;
  total?: number | null;
};

export type EtsyReviewsResponse = {
  reviews: EtsyReview[];
  pagination?: EtsyPaging;
};

export type ConnectedShop = {
  id: string;
  name: string;
  connected: boolean;
};

export type BillingStatus = {
  accountStatus: string;
  subscriptionStatus: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  lastPaymentAt: string | null;
  hasStripeCustomer: boolean;
  connectedShops: number;
  shopLimit: number;
  portalUrl: string | null;
};

export type ApiErrorCode = "unauthenticated" | "unavailable" | "timeout" | "request_failed" | "invalid_response";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
