"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBillingStatus } from "@/lib/api/billing";
import { ApiError, type BillingStatus } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/dashboard/icons";

type Tone = "orange" | "blue" | "mist" | "violet" | "green" | "neutral";
const tones: Record<Tone, string> = { orange: "bg-[#FFF1E9] text-terracotta", blue: "bg-[#EEF5F8] text-[#52758C]", mist: "bg-[#F2F6F8] text-[#66879A]", violet: "bg-[#F3EFF8] text-[#806C9D]", green: "bg-[#EAF6EF] text-[#2D8158]", neutral: "bg-linen/50 text-charcoal/55" };

const plans = [
  { id: "pro", price: "$59", description: "pro", features: ["oneStore", "ai", "listingAnalysis", "keywordResearch", "drafts", "telegram", "allTools", "shopAnalysis", "competitorAnalysis", "seo", "reports", "basicAutomation"] },
  { id: "multi", price: "$99", description: "multi", features: ["upToFive", "ai", "multiShopAnalysis", "bulkCreation", "reportsEachShop", "prioritySupport", "allTools", "advancedAnalytics", "seo", "automation", "telegram"] },
];

function Heading({ title, detail }: { title: string; detail?: string }) { return <div className="mb-3"><h2 className="text-[17px] font-semibold tracking-[-0.03em] text-charcoal">{title}</h2>{detail && <p className="mt-1 text-[10px] text-charcoal/40">{detail}</p>}</div>; }
function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: Tone }) { return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold ${tones[tone]}`}>{children}</span>; }

function statusTone(status: string): Tone {
  if (status === "active" || status === "trialing") return "green";
  if (status === "past_due" || status === "unpaid" || status === "incomplete") return "orange";
  if (status === "paused") return "mist";
  return "neutral";
}

function translateOrRaw(t: (key: string) => string, key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

function formatDate(value: string | null, locale: "uk" | "en") {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function BillingPage() {
  const { locale, t } = useI18n();
  const [data, setData] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    void getBillingStatus()
      .then(setData)
      .catch((requestError) => setError(requestError instanceof ApiError ? requestError : new ApiError("Could not load billing status.", "unavailable")))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const statusLabel = data ? translateOrRaw(t, `billing.status.${data.subscriptionStatus}`, data.subscriptionStatus) : "";
  const periodEndLabel = data ? formatDate(data.currentPeriodEnd, locale) : null;
  const lastPaymentLabel = data ? formatDate(data.lastPaymentAt, locale) : null;
  const canOpenPortal = Boolean(data?.portalUrl && data?.hasStripeCustomer);

  function openPortal() {
    if (data?.portalUrl) window.open(data.portalUrl, "_blank", "noopener,noreferrer");
  }

  return <div className="min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8"><div className="mx-auto max-w-[1280px]">
    <header className="flex flex-col justify-between gap-5 border-b border-charcoal/[0.08] pb-6 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">Lucy Seller Copilot</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("billing.title")}</h1><p className="mt-2 max-w-2xl text-[12px] leading-5 text-charcoal/55">{t("billing.subtitle")}</p></div>
      <button type="button" onClick={load} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-charcoal/[0.1] bg-white px-3 text-[11px] font-semibold text-charcoal/65 disabled:opacity-50"><Icon name="refresh" size={14} />{t("common.refresh")}</button>
    </header>

    {error && <div role="alert" className="mt-6 rounded-xl border border-[#F74E03]/20 bg-[#F74E03]/5 px-4 py-3 text-xs text-charcoal/70">{t("billing.loadError")}</div>}

    {loading && !data && !error && <p className="mt-6 text-[11px] text-charcoal/45">{t("billing.loading")}</p>}

    {data && (
      <section className="mt-6 rounded-[20px] border border-terracotta/15 bg-white p-5 shadow-[0_14px_35px_rgba(51,51,51,0.035)]">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-charcoal/40">{t("billing.currentPlan")}</p>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-charcoal">PRO PLAN</h2>
              <Badge tone={statusTone(data.subscriptionStatus)}>{statusLabel}</Badge>
              {data.cancelAtPeriodEnd && <Badge tone="orange">{t("billing.willCancel")}</Badge>}
            </div>
            <p className="mt-2 text-lg font-semibold text-charcoal">$59 <span className="text-[11px] font-normal text-charcoal/45">/ {t("billing.month")}</span></p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[420px]">
            <div><p className="text-[9px] uppercase tracking-[0.08em] text-charcoal/35">{t("billing.periodEndLabel")}</p><p className="mt-1 text-[12px] font-semibold text-charcoal">{periodEndLabel ?? t("billing.noExpiration")}</p></div>
            <div><p className="text-[9px] uppercase tracking-[0.08em] text-charcoal/35">{t("billing.lastPaymentLabel")}</p><p className="mt-1 text-[12px] font-semibold text-charcoal">{lastPaymentLabel ?? t("billing.noPayment")}</p></div>
          </div>
        </div>

        <div className="mt-5 border-t border-charcoal/[0.07] pt-4">
          {canOpenPortal ? (
            <button type="button" onClick={openPortal} className="inline-flex items-center gap-2 rounded-[11px] bg-terracotta px-3.5 py-2.5 text-[10px] font-semibold text-white">
              {t("billing.openPortal")} <Icon name="arrow-up-right" size={12} />
            </button>
          ) : (
            <p className="text-[10px] leading-4 text-charcoal/50">{data.hasStripeCustomer ? t("billing.noPortalConfigured") : t("billing.noStripeAccount")}</p>
          )}
          <p className="mt-2 text-[9px] leading-4 text-charcoal/35">{t("billing.manage.subtitle")}</p>
        </div>
      </section>
    )}

    {data && (
      <section className="mt-7"><Heading title={t("billing.usage.title")} detail={t("billing.usage.subtitle")} />
        <div className="rounded-[18px] border border-charcoal/[0.07] bg-white p-4 max-w-md">
          <div className="flex items-center justify-between">
            <div><p className="text-[10px] text-charcoal/45">{t("billing.stores")}</p><p className="mt-1 text-xl font-semibold text-charcoal">{data.connectedShops} / {data.shopLimit}</p></div>
            {data.connectedShops >= data.shopLimit && <Badge tone="orange">{t("billing.usage.limitReached")}</Badge>}
          </div>
          <div className="mt-4 h-2 rounded-full bg-charcoal/[0.08]"><div className="h-full rounded-full bg-terracotta" style={{ width: `${Math.min(100, (data.connectedShops / Math.max(data.shopLimit, 1)) * 100)}%` }} /></div>
        </div>
      </section>
    )}

    <section className="mt-7"><Heading title={t("billing.choosePlan")} detail={t("billing.choosePlanSubtitle")} /><div className="grid items-stretch gap-4 lg:grid-cols-2">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} onClick={openPortal} disabled={!canOpenPortal} t={t} />)}</div><div className="mt-4 rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><p className="text-[10px] leading-4 text-charcoal/55">{t("billing.autoRenewNotice")}</p></div></section>

    <section className="mt-7 rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><p className="text-[10px] text-charcoal/55">{t("billing.refundPolicy")}</p><Link href="/legal/refund" className="mt-2 inline-block text-[10px] font-semibold text-terracotta">{t("billing.refundLink")}</Link></section>
  </div></div>;
}

function PlanCard({ plan, onClick, disabled, t }: { plan: typeof plans[number]; onClick: () => void; disabled: boolean; t: (key: string) => string }) {
  return <article className={`flex h-full flex-col rounded-[20px] border p-5 shadow-[0_14px_35px_rgba(51,51,51,0.035)] ${plan.id === "multi" ? "border-terracotta/25 bg-[#FFF9F5]" : "border-charcoal/[0.07] bg-white"}`}>
    <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold tracking-[-0.04em] text-charcoal">{plan.id === "pro" ? "PRO PLAN" : "MULTI STORE"}</h3><p className="mt-2 text-lg font-semibold text-charcoal">{plan.price} <span className="text-[10px] font-normal text-charcoal/45">/ {t("billing.month")}</span></p></div></div>
    <p className="mt-3 text-[11px] text-charcoal/55">{t(`billing.plan.${plan.description}`)}</p>
    <div className="my-5 h-px bg-charcoal/[0.07]" />
    <ul className="grid flex-1 gap-2 sm:grid-cols-2">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-[10px] text-charcoal/65"><Icon name="check" size={12} className="mt-0.5 shrink-0 text-[#2D8158]" />{t(`billing.feature.${feature}`)}</li>)}</ul>
    <button type="button" disabled={disabled} onClick={onClick} className="mt-6 w-full rounded-[11px] bg-terracotta py-2.5 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-charcoal/[0.08] disabled:text-charcoal/35">{t("billing.openPortal")}</button>
  </article>;
}
