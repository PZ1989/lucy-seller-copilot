"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useSubscription } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";

export function PreviewBanner() {
  const { state } = useSubscription();
  const { openPaywall } = useSubscription();
  const { t } = useI18n();
  if (state === "paid") return null;
  return <div className="border-b border-[#F74E03]/15 bg-[#FFF8F3] px-4 py-3 sm:px-6"><div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><p className="text-[11px] font-semibold text-[#333333]">{t("previewBanner.title")}</p><p className="text-[10px] text-[#333333]/55">{t("previewBanner.subtitle")}</p></div><button type="button" onClick={openPaywall} className="w-fit rounded-[10px] bg-[#F74E03] px-3 py-2 text-[10px] font-semibold text-white">{t("previewBanner.cta")}</button></div></div>;
}

export function PaywallModal() {
  const { paywallOpen, closePaywall } = useSubscription();
  if (!paywallOpen) return null;
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#333333]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="paywall-title"><div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F74E03]">Preview mode</p><h2 id="paywall-title" className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#333333]">Unlock Lucy Seller Copilot</h2></div><button type="button" onClick={closePaywall} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-[#333333]/45 hover:bg-[#F7F4F1]"> <X size={17} /></button></div><p className="mt-4 text-sm leading-6 text-[#333333]/60">Choose a plan to connect your Etsy shop and start using Lucy&apos;s live tools.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/billing" onClick={closePaywall} className="rounded-[16px] border border-[#333333]/10 p-4 transition hover:border-[#F74E03]/35"><p className="text-xs font-semibold text-[#333333]/55">PRO</p><p className="mt-2 text-2xl font-semibold text-[#333333]">$59<span className="text-xs font-normal text-[#333333]/45">/month</span></p><p className="mt-1 text-[11px] text-[#333333]/55">1 Etsy shop</p><span className="mt-4 inline-block rounded-lg bg-[#333333] px-3 py-2 text-[10px] font-semibold text-white">Choose PRO</span></Link><Link href="/billing" onClick={closePaywall} className="rounded-[16px] border border-[#F74E03]/25 bg-[#FFF8F3] p-4 transition hover:border-[#F74E03]/50"><p className="text-xs font-semibold text-[#F74E03]">MULTI STORE</p><p className="mt-2 text-2xl font-semibold text-[#333333]">$99<span className="text-xs font-normal text-[#333333]/45">/month</span></p><p className="mt-1 text-[11px] text-[#333333]/55">Up to 5 Etsy shops</p><span className="mt-4 inline-block rounded-lg bg-[#F74E03] px-3 py-2 text-[10px] font-semibold text-white">Choose MULTI STORE</span></Link></div><button type="button" onClick={closePaywall} className="mt-5 text-[11px] font-semibold text-[#333333]/45 hover:text-[#333333]">Maybe later</button></div></div>;
}
