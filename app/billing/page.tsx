"use client";

import { useEffect, useState } from "react";
import { getBillingStatus } from "@/lib/api/billing";
import { getLucyCredits } from "@/lib/api/etsy";
import { ApiError, type BillingStatus, type LucyCreditStatus } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";

type PlanId = "pro" | "multi";
type FeatureId = "shops" | "seo" | "imageStudio" | "research" | "analytics" | "monitoring" | "reports" | "automation";

const planDetails: Record<PlanId, { name: string; price: string; limit: string; credits: number }> = {
  pro: { name: "PRO", price: "$59", limit: "1", credits: 2500 },
  multi: { name: "MULTI STORE", price: "$99", limit: "5", credits: 5000 },
};
const comparisonRows: FeatureId[] = ["shops", "seo", "imageStudio", "research", "analytics", "monitoring", "reports", "automation"];

function isPaid(status: string) { return status === "active" || status === "trialing"; }
function getCurrentPlan(data: BillingStatus): PlanId | null {
  if (!isPaid(data.subscriptionStatus)) return null;
  return data.shopLimit > 1 ? "multi" : data.shopLimit === 1 ? "pro" : null;
}

export default function BillingPage() {
  const { t } = useI18n();
  const [data, setData] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [credits, setCredits] = useState<LucyCreditStatus | null>(null);

  function load() {
    setLoading(true); setError(null);
    void Promise.all([getBillingStatus(), getLucyCredits()]).then(([billing, balance]) => { setData(billing); setCredits(balance); }).catch((requestError) => setError(requestError instanceof ApiError ? requestError : new ApiError("Could not load billing status.", "unavailable"))).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  const currentPlan = data ? getCurrentPlan(data) : null;
  const canOpenPortal = Boolean(data?.portalUrl && data.hasStripeCustomer);
  function openPortal() { if (data?.portalUrl) window.open(data.portalUrl, "_blank", "noopener,noreferrer"); }

  return <main className="min-h-screen w-full px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto w-full max-w-[1120px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("billing.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("billing.subtitle")}</p></header>
    {error && <div role="alert" className="mt-6 rounded-[14px] border border-terracotta/20 bg-[#FFF8F3] px-4 py-3 text-[13px] text-charcoal/70">{t("billing.loadError")}</div>}
    {loading && !data && !error && <p className="mt-6 text-[13px] text-charcoal/45">{t("billing.loading")}</p>}
    {data && <>
      <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-5 shadow-[0_14px_35px_rgba(51,51,51,0.035)]"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">{t("billing.currentPlan")}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-charcoal">{currentPlan ? planDetails[currentPlan].name : t("billing.unavailable")}</h2>{currentPlan && <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal">{planDetails[currentPlan].price} <span className="text-[12px] font-normal text-charcoal/45">/ {t("billing.month")}</span></p>}</div><div className="min-w-[150px]"><p className="text-[11px] font-semibold text-charcoal/45">{t("billing.shopUsage")}</p><p className="mt-2 text-[18px] font-semibold text-charcoal">{typeof data.connectedShops === "number" && typeof data.shopLimit === "number" ? `${t("billing.shops")}: ${data.connectedShops} ${t("billing.of")} ${data.shopLimit}` : t("billing.unavailable")}</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/[0.07] pt-4"><p className="text-[11px] text-charcoal/45">{data.currentPeriodEnd || data.lastPaymentAt ? t("billing.realStatusAvailable") : t("billing.renewalUnavailable")}</p><button type="button" onClick={openPortal} disabled={!canOpenPortal} className="inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-charcoal/10 disabled:text-charcoal/35">{t("billing.manageSubscription")}</button></div></section>
      {credits && <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-terracotta">AI Credits</p><p className="mt-2 text-2xl font-semibold text-charcoal">{credits.totalAvailable.toLocaleString()} / {credits.monthlyAllowance.toLocaleString()}</p></div><div className="text-right text-[11px] text-charcoal/50"><p>{credits.purchasedRemaining.toLocaleString()} purchased</p><p>{credits.billingCycleEndsAt ? new Intl.DateTimeFormat().format(new Date(credits.billingCycleEndsAt)) : ""}</p></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F4F2F0]"><div className="h-full rounded-full bg-terracotta" style={{ width: `${Math.max(0, Math.min(100, 100 - credits.usagePercent))}%` }}/></div></section>}
      <section className="mt-7"><h2 className="text-[18px] font-semibold text-charcoal">{t("billing.planOptions")}</h2><div className="mt-3 grid items-stretch gap-4 md:grid-cols-2">{(["pro", "multi"] as PlanId[]).map((plan) => <PlanCard key={plan} plan={plan} current={currentPlan === plan} canOpenPortal={canOpenPortal} onClick={openPortal} t={t} />)}</div></section>
      <section className="mt-7 overflow-hidden rounded-[14px] border border-charcoal/[0.07] bg-white"><div className="border-b border-charcoal/[0.07] bg-[#FCFAF8] px-4 py-3 text-[12px] font-semibold text-charcoal">{t("billing.comparison")}</div><div className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-charcoal/[0.07] px-4 py-2.5 text-[10px] font-semibold text-charcoal/45"><span>{t("billing.feature")}</span><span>PRO</span><span>MULTI STORE</span></div>{comparisonRows.map((row) => <div key={row} className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-charcoal/[0.06] px-4 py-2.5 text-[11px] last:border-0"><span className="text-charcoal/65">{t(`billing.feature.${row}`)}</span><span>{t("billing.included")}</span><span>{t("billing.included")}</span></div>)}</section>
      <section className="mt-7 grid gap-4 md:grid-cols-2"><InfoBlock title={t("billing.paymentMethod")} body={t("billing.paymentDetailsUnavailable")} /><InfoBlock title={t("billing.billingHistory")} body={t("billing.paymentHistoryUnavailable")} /></section>
    </>}
  </div></main>;
}

function PlanCard({ plan, current, canOpenPortal, onClick, t }: { plan: PlanId; current: boolean; canOpenPortal: boolean; onClick: () => void; t: (key: string) => string }) {
  const details = planDetails[plan];
  return <article className="flex min-h-[190px] flex-col rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-[16px] font-bold tracking-[-0.03em] text-charcoal">{details.name}</h3>{current && <span className="rounded-full bg-[#EAF6EF] px-2 py-1 text-[9px] font-semibold text-[#2D8158]">{t("billing.current")}</span>}</div><p className="mt-3 text-xl font-semibold text-charcoal">{details.price} <span className="text-[11px] font-normal text-charcoal/45">/ {t("billing.month")}</span></p><p className="mt-2 text-[11px] text-charcoal/55">{t("billing.shops")}: {plan === "pro" ? details.limit : `${t("billing.upTo")} ${details.limit}`}</p><p className="mt-2 text-[11px] text-charcoal/55">{details.credits.toLocaleString()} AI credits / month</p><p className="mt-2 text-[11px] text-charcoal/55">{t(`billing.planSummary.${plan}`)}</p><button type="button" disabled={current || !canOpenPortal} onClick={onClick} className="mt-auto inline-flex h-8 items-center justify-center rounded-[9px] bg-terracotta px-3 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-charcoal/10 disabled:text-charcoal/35">{current ? t("billing.current") : t(`billing.planCta.${plan}`)}</button></article>;
}

function InfoBlock({ title, body }: { title: string; body: string }) { return <section className="rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><h2 className="text-[13px] font-semibold text-charcoal">{title}</h2><p className="mt-2 text-[11px] leading-5 text-charcoal/55">{body}</p></section>; }
