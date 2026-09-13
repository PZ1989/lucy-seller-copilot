"use client";

import { useState } from "react";
import { FileText, ShieldCheck, Tag } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Status = "complete" | "needs-attention" | "missing";
type Filter = "all" | Status;
type DetailTab = "current" | "review" | "rewrite";
type SecondaryTab = "checklist" | "drafts" | "templates";

const sections = [
  ["returns", "policies.sections.returns", "policies.sections.returns.desc"],
  ["cancellations", "policies.sections.cancellations", "policies.sections.cancellations.desc"],
  ["shipping", "policies.sections.shipping", "policies.sections.shipping.desc"],
  ["processingTime", "policies.sections.processingTime", "policies.sections.processingTime.desc"],
  ["taxes", "policies.sections.customsTaxes", "policies.sections.customsTaxes.desc"],
  ["digital", "policies.sections.digitalProducts", "policies.sections.digitalProducts.desc"],
  ["personalized", "policies.sections.personalized", "policies.sections.personalized.desc"],
  ["privacy", "policies.sections.privacy", "policies.sections.privacy.desc"],
  ["payment", "policies.sections.payment", "policies.sections.payment.desc"],
  ["contact", "policies.sections.contact", "policies.sections.contact.desc"],
] as const;

type PolicySection = readonly [string, string, string];

export default function PoliciesPage() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<PolicySection | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("current");
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>("checklist");
  const unavailable = locale === "uk" ? "Недоступно" : "Unavailable";
  const labels = locale === "uk" ? {
    title: "Політики магазину",
    subtitle: "Перевіряйте ключові політики Etsy-магазину та знаходьте, що потребує уваги.",
    complete: "Заповнено",
    attention: "Потребує уваги",
    missing: "Відсутнє",
    sections: "Розділи політик",
    sectionsDesc: "Переглядайте політики після підключення реальних даних магазину.",
    all: "Усі",
    open: "Відкрити",
    review: "Перевірити",
    needsAttention: "Потребує уваги",
    everythingGood: "Наразі все гаразд.",
    unavailableText: "Дані політики недоступні.",
    current: "Поточна політика",
    lucy: "Перевірка Lucy",
    rewrite: "Переписати",
    detail: "Деталі політики",
    close: "Закрити",
    emptyTab: "Дані з’являться після підключення політик магазину.",
    checklist: "Чекліст",
    drafts: "Чернетки",
    templates: "Шаблони",
  } : {
    title: "Shop Policies",
    subtitle: "Review key Etsy shop policies and find what needs attention.",
    complete: "Complete",
    attention: "Needs Attention",
    missing: "Missing",
    sections: "Policy Sections",
    sectionsDesc: "Review policies after real shop policy data is connected.",
    all: "All",
    open: "Open",
    review: "Review",
    needsAttention: "Needs Attention",
    everythingGood: "Everything looks good right now.",
    unavailableText: "Policy data is unavailable.",
    current: "Current Policy",
    lucy: "Lucy Review",
    rewrite: "Rewrite",
    detail: "Policy Detail",
    close: "Close",
    emptyTab: "Data will appear when shop policies are connected.",
    checklist: "Checklist",
    drafts: "Drafts",
    templates: "Templates",
  };
  const visible = filter === "all" ? sections : [];
  const detailLabels: Record<DetailTab, string> = { current: labels.current, review: labels.lucy, rewrite: labels.rewrite };
  const secondaryLabels: Record<SecondaryTab, string> = { checklist: labels.checklist, drafts: labels.drafts, templates: labels.templates };

  return <div className="min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1280px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-terracotta">Lucy Seller Copilot</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-charcoal">{labels.title}</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-charcoal/55">{labels.subtitle}</p></header>
    <section className="mt-6 grid gap-4 md:grid-cols-3">{[[labels.complete, "text-[#2D8158] bg-[#EAF6EF]"], [labels.attention, "text-terracotta bg-[#FFF1E9]"], [labels.missing, "text-[#806C9D] bg-[#F3EFF8]"]].map(([label, tone]) => <article key={label} className="rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><span className={`grid size-9 place-items-center rounded-[10px] ${tone}`}><FileText size={17}/></span><p className="mt-3 text-2xl font-semibold text-charcoal">{unavailable}</p><p className="mt-1 text-[13px] font-semibold text-charcoal/60">{label}</p></article>)}</section>
    <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-[18px] font-semibold text-charcoal">{labels.sections}</h2><p className="mt-1 text-[13px] text-charcoal/50">{labels.sectionsDesc}</p></div><div className="flex flex-wrap gap-1.5">{([["all", labels.all], ["complete", labels.complete], ["needs-attention", labels.attention], ["missing", labels.missing]] as [Filter, string][]).map(([key, text]) => <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-[9px] px-3 py-2 text-[10px] font-semibold ${filter === key ? "bg-charcoal text-white" : "border border-charcoal/[0.1] text-charcoal/55"}`}>{text}</button>)}</div></div><div className="mt-4 grid gap-2 md:grid-cols-2">{visible.map(([key, title, description]) => <button key={key} type="button" onClick={() => { setSelected([key, title, description]); setDetailTab("current"); }} className="flex items-start gap-3 rounded-[11px] bg-[#FCFAF8] p-3 text-left transition hover:bg-[#F8F4F1]"><span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-white text-charcoal/50"><Tag size={15}/></span><span className="min-w-0 flex-1"><strong className="block text-[13px] font-semibold text-charcoal">{t(title)}</strong><span className="mt-1 block text-[11px] leading-5 text-charcoal/50">{labels.unavailableText}</span></span><span className="shrink-0 rounded-[8px] border border-charcoal/[0.1] px-2 py-1 text-[10px] font-semibold text-charcoal/55">{labels.open}</span></button>)}</div>{visible.length === 0 && <p className="mt-4 rounded-[11px] bg-[#FCFAF8] p-3 text-[12px] text-charcoal/50">{labels.unavailableText}</p>}</section>
    <section className="mt-6 rounded-[14px] border border-charcoal/[0.07] bg-white p-4"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-terracotta"/><h2 className="text-[17px] font-semibold text-charcoal">{labels.needsAttention}</h2></div><p className="mt-3 text-[12px] text-charcoal/50">{labels.everythingGood}</p></section>
    <section className="mt-6"><div className="flex gap-1 border-b border-charcoal/[0.08]">{(Object.keys(secondaryLabels) as SecondaryTab[]).map(tab => <button key={tab} type="button" onClick={() => setSecondaryTab(tab)} className={`border-b-2 px-3 py-2.5 text-[12px] font-semibold ${secondaryTab === tab ? "border-terracotta text-terracotta" : "border-transparent text-charcoal/50"}`}>{secondaryLabels[tab]}</button>)}</div><div className="mt-3 rounded-[12px] bg-[#FCFAF8] p-3 text-[12px] text-charcoal/50">{labels.emptyTab}</div></section>
  </div>
  {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/25 p-4"><button type="button" className="absolute inset-0" aria-label={labels.close} onClick={() => setSelected(null)}/><aside className="relative w-full max-w-lg rounded-[18px] bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] uppercase tracking-[0.14em] text-terracotta">{labels.detail}</p><h2 className="mt-2 text-xl font-semibold text-charcoal">{t(selected[1])}</h2></div><button type="button" onClick={() => setSelected(null)} className="text-[12px] text-charcoal/50">{labels.close}</button></div><div className="mt-4 flex gap-1 border-b border-charcoal/[0.08]">{(Object.keys(detailLabels) as DetailTab[]).map(tab => <button key={tab} type="button" onClick={() => setDetailTab(tab)} className={`border-b-2 px-3 py-2.5 text-[11px] font-semibold ${detailTab === tab ? "border-terracotta text-terracotta" : "border-transparent text-charcoal/50"}`}>{detailLabels[tab]}</button>)}</div><div className="mt-4 rounded-[12px] bg-[#FCFAF8] p-4"><p className="text-[12px] leading-5 text-charcoal/55">{detailTab === "rewrite" ? labels.unavailableText : labels.emptyTab}</p>{detailTab === "rewrite" && <div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-[9px] border border-charcoal/[0.08] p-3 text-[11px] text-charcoal/45">{labels.current}</div><div className="rounded-[9px] border border-charcoal/[0.08] p-3 text-[11px] text-charcoal/45">{labels.rewrite}</div></div>}</div></aside></div>}
  </div>;
}
