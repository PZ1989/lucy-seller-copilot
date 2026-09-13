"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getBillingStatus } from "@/lib/api/billing";
import type { BillingStatus } from "@/lib/api/types";
import { useSession } from "@/lib/session";

type SubscriptionState = "loading" | "paid" | "preview" | "error";

type SubscriptionContextValue = {
  billing: BillingStatus | null;
  state: SubscriptionState;
  paid: boolean;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  requirePaid: () => boolean;
  refreshBilling: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function isPaidStatus(status: string | undefined) {
  return status === "active" || status === "trialing";
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [state, setState] = useState<SubscriptionState>("loading");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const { status: sessionStatus } = useSession();

  async function refreshBilling() {
    setState("loading");
    try {
      const nextBilling = await getBillingStatus();
      setBilling(nextBilling);
      setState(isPaidStatus(nextBilling.subscriptionStatus) ? "paid" : "preview");
    } catch {
      setBilling(null);
      setState("error");
    }
  }

  useEffect(() => {
    if (sessionStatus === "authenticated") void refreshBilling();
    if (sessionStatus === "unauthenticated" || sessionStatus === "unavailable") setState("error");
  }, [sessionStatus]);

  function requirePaid() {
    if (isPaidStatus(billing?.subscriptionStatus)) return true;
    setPaywallOpen(true);
    return false;
  }

  return <SubscriptionContext.Provider value={{ billing, state, paid: state === "paid", paywallOpen, openPaywall: () => setPaywallOpen(true), closePaywall: () => setPaywallOpen(false), requirePaid, refreshBilling }}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used inside SubscriptionProvider");
  return context;
}
