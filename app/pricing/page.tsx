"use client";

import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";

const plans = [
  { id: "pro", name: "PRO", price: "$59", detail: "1 Etsy shop", featured: false },
  { id: "multi", name: "MULTI STORE", price: "$99", detail: "Up to 5 Etsy shops", featured: true },
];

export default function PricingPage() {
  const { t } = useI18n();
  return <main className="min-h-screen bg-[#F7F4F1] px-5 py-8 text-[#333333] sm:px-8 lg:px-12"><div className="mx-auto max-w-[1060px]"><div className="flex items-center justify-between"><Link href="/" className="text-sm font-semibold">Lucy Seller Copilot</Link><LanguageSwitcher /></div><div className="mx-auto max-w-2xl py-20 text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F74E03]">{t("public.pricing.eyebrow")}</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.07em]">{t("public.pricing.heading")}</h1><p className="mt-5 text-lg leading-7 text-[#333333]/58">{t("public.pricing.description")}</p></div><div className="grid gap-5 md:grid-cols-2">{plans.map((plan) => <article key={plan.name} className={`rounded-[28px] border p-7 ${plan.featured ? "border-[#F74E03]/25 bg-[#FFF9F5]" : "border-[#333333]/8 bg-white"}`}><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F74E03]">{plan.name}</p><p className="mt-5 text-5xl font-semibold">{plan.price}<span className="text-sm font-normal text-[#333333]/45">{t("public.pricing.month")}</span></p><p className="mt-2 text-sm text-[#333333]/55">{t(plan.id === "pro" ? "public.pricing.oneShop" : "public.pricing.multiShop")}</p><ul className="mt-8 space-y-3 text-sm text-[#333333]/70"><li>{t("public.pricing.workflow")}</li><li>{t("public.pricing.recommendations")}</li><li>{t("public.pricing.safety")}</li></ul><Link href="/login" className={`mt-9 inline-flex rounded-xl px-4 py-3 text-sm font-semibold ${plan.featured ? "bg-[#F74E03] text-white" : "bg-[#333333] text-white"}`}>{t(plan.id === "pro" ? "public.pricing.pro" : "public.pricing.multi")}</Link></article>)}</div></div></main>;
}
