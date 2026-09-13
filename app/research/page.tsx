"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const modes = ["niche", "competitors", "keywords", "trends", "reviews"];

export default function ResearchPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("niche");
  return <main className="research-page min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1120px]"><header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("research.simple.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("research.simple.subtitle")}</p></header><nav className="mt-5 flex gap-1 overflow-x-auto rounded-[12px] border border-charcoal/[0.08] bg-white p-1" aria-label={t("research.simple.tabs")}>{modes.map(item => <button key={item} type="button" onClick={() => setMode(item)} className={`whitespace-nowrap rounded-[9px] px-3 py-2.5 text-[11px] font-semibold ${mode === item ? "bg-charcoal text-white" : "text-charcoal/50"}`}>{t(`research.workspace.mode.${item}`)}</button>)}</nav><section className="mt-5 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><label className="block text-[11px] font-semibold text-charcoal/60"><span className="sr-only">{t("research.input.label")}</span><div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t("research.input.placeholder")} className="h-11 w-full rounded-[10px] border border-charcoal/[0.1] bg-[#FCFAF8] pl-10 pr-3 text-[13px] font-normal outline-none focus:border-terracotta/40"/></div></label><button type="button" disabled={!query.trim()} className="mt-3 inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{t("research.simple.start")}</button></section><section className="mt-5 rounded-[16px] border border-dashed border-charcoal/[0.12] bg-[#FCFAF8] p-8 text-center"><h2 className="text-[16px] font-semibold text-charcoal">{t("research.empty.title")}</h2><p className="mt-2 text-[12px] text-charcoal/50">{t("research.empty.description")}</p></section></div></main>;
}
