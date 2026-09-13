"use client";

import Link from "next/link";
import { BarChart3, FileText, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const types = [["reports.type.daily", "reports.type.dailyDesc", FileText], ["reports.type.weekly", "reports.type.weeklyDesc", BarChart3]] as const;

export default function ReportsPage() {
  const { t } = useI18n();
  return <main className="reports-page min-h-screen bg-[#F7F4F1] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1120px]"><header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("reports.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("reports.subtitle")}</p></header><section className="mt-6"><h2 className="text-[18px] font-semibold text-charcoal">{t("reports.types")}</h2><div className="mt-3 grid gap-3 md:grid-cols-2">{types.map(([title, description, Icon]) => <article key={title} className="rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><Icon size={17} className="text-terracotta"/><h3 className="mt-3 text-[15px] font-semibold text-charcoal">{t(title)}</h3><p className="mt-1.5 text-[12px] leading-5 text-charcoal/55">{t(description)}</p><button type="button" disabled className="mt-3 h-8 rounded-[9px] border border-charcoal/[0.1] px-3 text-[11px] font-semibold text-charcoal/40">{t("reports.unavailable")}</button></article>)}</div></section><section className="mt-6 rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><h2 className="text-[17px] font-semibold text-charcoal">{t("reports.latest")}</h2><p className="mt-3 rounded-[11px] bg-[#FCFAF8] p-4 text-[12px] text-charcoal/50">{t("reports.empty")}</p></section><section className="mt-6 rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><div className="flex items-center gap-2"><Send size={16} className="text-terracotta"/><h2 className="text-[17px] font-semibold text-charcoal">{t("reports.telegram")}</h2></div><p className="mt-3 text-[12px] text-charcoal/55">{t("reports.telegramUnavailable")}</p><Link href="/connections" className="mt-3 inline-flex h-8 items-center rounded-[9px] border border-charcoal/[0.1] px-3 text-[11px] font-semibold text-charcoal/65">{t("reports.connections")}</Link></section></div></main>;
}
