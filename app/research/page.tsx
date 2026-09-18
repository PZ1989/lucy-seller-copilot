"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, Loader2, Search } from "lucide-react";
import { runMarketResearch } from "@/lib/api/research";
import type { MarketResearchProvider, MarketResearchResponse } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";

const modes = ["niche", "competitors", "keywords", "trends", "reviews"];
const sourceNames = { everbee: "EverBee", dataforseo: "DataForSEO", similarweb: "Similarweb" } as const;

function formatNumber(value: number | null | undefined, locale: string) {
  return typeof value === "number" ? new Intl.NumberFormat(locale).format(value) : "—";
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-[10px] bg-[#FCFAF8] p-3"><dt className="text-[9px] uppercase tracking-wide text-charcoal/40">{label}</dt><dd className="mt-1 text-[17px] font-semibold text-charcoal">{value}</dd></div>;
}

function SourceCard({ source, locale }: { source: MarketResearchProvider; locale: "uk" | "en" }) {
  const uk = locale === "uk";
  const statusLabel = source.status === "ok" ? (uk ? "Дані отримано" : "Live data") : source.status === "no_data" ? (uk ? "Немає даних" : "No data") : (uk ? "Не підключено" : "Not connected");
  const description = source.provider === "everbee" ? (uk ? "Оцінки ринку Etsy від EverBee" : "EverBee Etsy market estimates") : source.provider === "dataforseo" ? (uk ? "Попит у Google та зовнішньому пошуку" : "Google and external search demand") : (uk ? "Зовнішній пошуковий трафік на Etsy.com" : "External search traffic to Etsy.com");
  return <article className="rounded-[14px] border border-charcoal/[0.08] bg-white p-4">
    <div className="flex items-start justify-between gap-3"><div><h3 className="text-[14px] font-semibold text-charcoal">{sourceNames[source.provider]}</h3><p className="mt-1 text-[11px] leading-4 text-charcoal/50">{description}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${source.status === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{statusLabel}</span></div>
    {source.provider === "dataforseo" && source.status === "ok" ? <dl className="mt-4 grid grid-cols-2 gap-3"><Metric label={uk ? "Пошуків / міс." : "Searches / mo."} value={formatNumber(source.searchVolume, locale)}/><Metric label={uk ? "Конкуренція" : "Competition"} value={source.competition ?? "—"}/><Metric label="CPC" value={typeof source.cpc === "number" ? `$${source.cpc.toFixed(2)}` : "—"}/><Metric label={uk ? "Індекс конкуренції" : "Competition index"} value={formatNumber(source.competitionIndex, locale)}/></dl> : null}
    {source.status !== "ok" ? <p className="mt-4 rounded-[10px] bg-[#FCFAF8] p-3 text-[11px] leading-4 text-charcoal/60">{source.reason || (uk ? "Постачальник не повернув дані для цього запиту." : "The provider returned no data for this query.")}</p> : null}
    {source.status === "ok" && source.provider !== "dataforseo" ? <p className="mt-4 text-[11px] leading-5 text-charcoal/65">{source.text || (uk ? "Дані отримано та збережено для аналізу." : "Data received and saved for analysis.")}</p> : null}
    <div className="mt-4 flex items-center justify-between border-t border-charcoal/[0.06] pt-3 text-[9px] uppercase tracking-wide text-charcoal/35"><span>{uk ? "Точність" : "Accuracy"}: {source.accuracy}</span><time>{new Date(source.fetchedAt).toLocaleString(locale)}</time></div>
  </article>;
}

export default function ResearchPage() {
  const { t, locale } = useI18n();
  const uk = locale === "uk";
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("niche");
  const [country, setCountry] = useState("US");
  const [result, setResult] = useState<MarketResearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError("");
    try { setResult(await runMarketResearch({ query: query.trim(), mode, country })); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : (uk ? "Не вдалося виконати дослідження." : "Research failed.")); }
    finally { setLoading(false); }
  }

  return <main className="research-page min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1120px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("research.simple.title")}</h1><p className="mt-2 max-w-2xl text-[12px] leading-5 text-charcoal/55">{uk ? "Перевіряйте нішу за реальними даними трьох незалежних постачальників. Кожне число показується разом із джерелом і датою оновлення." : "Validate a niche with live data from three independent providers. Every number includes its source and fetch time."}</p></header>
    <nav className="mt-5 flex gap-1 overflow-x-auto rounded-[12px] border border-charcoal/[0.08] bg-white p-1" aria-label={t("research.simple.tabs")}>{modes.map(item => <button key={item} type="button" onClick={() => setMode(item)} className={`whitespace-nowrap rounded-[9px] px-3 py-2.5 text-[11px] font-semibold ${mode === item ? "bg-charcoal text-white" : "text-charcoal/50"}`}>{t(`research.workspace.mode.${item}`)}</button>)}</nav>
    <form onSubmit={submit} className="mt-5 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><div className="grid gap-3 sm:grid-cols-[1fr_110px_auto]"><label className="block"><span className="sr-only">{t("research.input.label")}</span><div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder={uk ? "Наприклад: wedding invitation template" : "Example: wedding invitation template"} className="h-11 w-full rounded-[10px] border border-charcoal/[0.1] bg-[#FCFAF8] pl-10 pr-3 text-[13px] outline-none focus:border-terracotta/40"/></div></label><select value={country} onChange={event => setCountry(event.target.value)} aria-label={uk ? "Країна" : "Country"} className="h-11 rounded-[10px] border border-charcoal/[0.1] bg-[#FCFAF8] px-3 text-[12px] text-charcoal"><option value="US">US</option><option value="GB">UK</option><option value="CA">Canada</option><option value="AU">Australia</option></select><button type="submit" disabled={!query.trim() || loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-terracotta px-4 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{loading ? <Loader2 size={15} className="animate-spin"/> : <BarChart3 size={15}/>} {loading ? (uk ? "Збираємо…" : "Researching…") : t("research.simple.start")}</button></div></form>
    <aside className="mt-4 flex gap-2 rounded-[12px] border border-sky-100 bg-sky-50/60 p-3 text-[11px] leading-5 text-sky-900"><AlertCircle size={16} className="mt-0.5 shrink-0"/><p>{uk ? "Дані не змішуються: EverBee показує оцінки Etsy, DataForSEO — зовнішній пошуковий попит, Similarweb — зовнішній трафік на Etsy. Google-пошуки не видаються за внутрішні пошуки Etsy." : "Sources stay separate: EverBee provides Etsy estimates, DataForSEO external search demand, and Similarweb external traffic to Etsy. Google searches are never presented as Etsy internal searches."}</p></aside>
    {error ? <div role="alert" className="mt-5 rounded-[14px] border border-red-100 bg-red-50 p-4 text-[12px] text-red-700">{error}</div> : null}
    {result ? <section className="mt-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600"/><h2 className="text-[16px] font-semibold text-charcoal">{uk ? `Аналіз: ${result.query}` : `Analysis: ${result.query}`}</h2></div><time className="text-[10px] text-charcoal/40">{new Date(result.generatedAt).toLocaleString(locale)}</time></div><div className="grid gap-4 lg:grid-cols-3">{result.sources.map(source => <SourceCard key={source.provider} source={source} locale={locale}/>)}</div><p className="mt-3 text-[10px] leading-4 text-charcoal/40">{result.disclosure}</p></section> : !loading ? <section className="mt-5 rounded-[16px] border border-dashed border-charcoal/[0.12] bg-[#FCFAF8] p-8 text-center"><h2 className="text-[16px] font-semibold text-charcoal">{t("research.empty.title")}</h2><p className="mt-2 text-[12px] text-charcoal/50">{uk ? "Введіть ключове слово — Lucy звернеться до доступних джерел і покаже, звідки взята кожна цифра." : "Enter a keyword. Lucy will query available sources and show where every figure comes from."}</p></section> : null}
  </div></main>;
}
