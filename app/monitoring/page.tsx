"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, RefreshCw, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { getEtsyListings } from "@/lib/api/etsy";
import type { EtsyListing } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

type Filter = "all" | "growing" | "stable" | "declining" | "watchlist";
type Labels = { title: string; subtitle: string; periods: Record<string, string>; growing: string; stable: string; declining: string; watchlist: string; all: string; monitoring: string; views: string; favorites: string; status: string; change: string; action: string; changes: string; noChanges: string; noListings: string; connect: string; unavailable: string; retry: string; loading: string; detail: string; prepare: string };

function labelsFor(locale: string): Labels {
  return locale === "uk" ? { title: "Моніторинг", subtitle: "Відстежуйте зміни у лістингах і швидко знаходьте ті, що потребують уваги.", periods: { "7d": "7 днів", "30d": "30 днів", "90d": "90 днів" }, growing: "Зростають", stable: "Стабільні", declining: "Падають", watchlist: "Watchlist", all: "Усі", monitoring: "Моніторинг лістингів", views: "Перегляди", favorites: "Вподобання", status: "Статус", change: "Остання зміна", action: "Переглянути", changes: "Останні зміни", noChanges: "Змін ще немає.", noListings: "Лістингів ще немає.", connect: "Підключіть Etsy, щоб бачити лістинги.", unavailable: "Дані моніторингу недоступні.", retry: "Спробувати ще раз", loading: "Завантаження…", detail: "Деталі лістингу", prepare: "Підготувати покращену версію" } : { title: "Monitoring", subtitle: "Track listing changes and quickly find the ones that need attention.", periods: { "7d": "7 days", "30d": "30 days", "90d": "90 days" }, growing: "Growing", stable: "Stable", declining: "Declining", watchlist: "Watchlist", all: "All", monitoring: "Listing Monitoring", views: "Views", favorites: "Favorites", status: "Status", change: "Last meaningful change", action: "View", changes: "Recent Changes", noChanges: "No changes yet.", noListings: "No listings yet.", connect: "Connect Etsy to see listings.", unavailable: "Monitoring data is unavailable.", retry: "Try again", loading: "Loading…", detail: "Listing Detail", prepare: "Prepare Improved Version" };
}

export default function MonitoringPage() {
  const { locale } = useI18n();
  const { etsyConnection } = useSession();
  const labels = labelsFor(locale);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [period, setPeriod] = useState("30d");
  const [selected, setSelected] = useState<EtsyListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const connected = Boolean(etsyConnection?.connected && etsyConnection.connectionHealth !== "expired");

  const loadListings = useCallback(() => {
    if (!connected) { setListings([]); setLoading(false); setError(false); return; }
    setLoading(true);
    setError(false);
    void getEtsyListings({ limit: 100 }).then(response => setListings(response.listings)).catch(() => { setListings([]); setError(true); }).finally(() => setLoading(false));
  }, [connected]);

  useEffect(() => { loadListings(); }, [loadListings, reload]);

  const counts = useMemo(() => ({ growing: "—", stable: "—", declining: "—" }), []);
  const visible = filter === "all" ? listings : [];
  const filters: Array<[Filter, string]> = [["all", labels.all], ["growing", labels.growing], ["stable", labels.stable], ["declining", labels.declining], ["watchlist", labels.watchlist]];

  return <div className="min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1280px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-terracotta">Lucy Seller Copilot</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-charcoal">{labels.title}</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-charcoal/55">{labels.subtitle}</p></header>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><div className="inline-flex rounded-[10px] border border-charcoal/[0.1] bg-white p-1">{["7d", "30d", "90d"].map(item => <button key={item} type="button" onClick={() => setPeriod(item)} className={`rounded-[8px] px-3 py-2 text-[12px] font-semibold ${period === item ? "bg-charcoal text-white" : "text-charcoal/50"}`}>{labels.periods[item]}</button>)}</div>{connected && <button type="button" onClick={() => setReload(value => value + 1)} className="inline-flex items-center gap-2 rounded-[10px] border border-charcoal/[0.1] bg-white px-3 py-2 text-[12px] font-semibold text-charcoal/60"><RefreshCw size={14}/>{labels.retry}</button>}</div>
    {!connected ? <p className="mt-6 rounded-[14px] border border-terracotta/15 bg-[#FFF8F3] p-4 text-[13px] text-charcoal/60">{labels.connect}</p> : error ? <div className="mt-6 flex items-center justify-between gap-3 rounded-[14px] border border-charcoal/[0.08] bg-white p-4"><p className="text-[13px] text-charcoal/60">{labels.unavailable}</p><button type="button" onClick={() => setReload(value => value + 1)} className="rounded-[9px] bg-terracotta px-3 py-2 text-[12px] font-semibold text-white">{labels.retry}</button></div> : null}
    <section className="mt-6 grid gap-4 md:grid-cols-3">{[[labels.growing, counts.growing, <TrendingUp key="growing" size={17}/>], [labels.stable, counts.stable, <ShieldCheck key="stable" size={17}/>], [labels.declining, counts.declining, <TrendingDown key="declining" size={17}/>]].map(([label, value, icon]) => <article key={label as string} className="rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><span className="grid size-9 place-items-center rounded-[10px] bg-[#F7F4F1] text-charcoal/55">{icon}</span><p className="mt-3 text-[13px] font-semibold text-charcoal/60">{label}</p>{loading ? <div className="mt-2 h-7 w-12 animate-pulse rounded bg-charcoal/[0.08]"/> : <p className="mt-1 text-2xl font-semibold text-charcoal">{connected && !error ? value : "—"}</p>}</article>)}</section>
    <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-[17px] font-semibold text-charcoal">{labels.monitoring}</h2><div className="flex flex-wrap gap-1.5">{filters.map(([key, text]) => <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-[9px] px-3 py-2 text-[10px] font-semibold ${filter === key ? "bg-charcoal text-white" : "border border-charcoal/[0.1] text-charcoal/55"}`}>{text}</button>)}</div></div><div className="mt-4 overflow-x-auto">{loading ? <div className="space-y-2">{[1, 2, 3].map(item => <div key={item} className="h-14 animate-pulse rounded-[10px] bg-charcoal/[0.06]"/>)}</div> : visible.length === 0 ? <p className="rounded-[12px] bg-[#FCFAF8] p-4 text-[12px] text-charcoal/50">{connected && !error ? labels.noListings : labels.unavailable}</p> : <table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-charcoal/[0.07] text-[10px] uppercase tracking-[0.08em] text-charcoal/35"><th className="px-2 py-3">{labels.monitoring}</th><th>{labels.status}</th><th>{labels.views}</th><th>{labels.favorites}</th><th>{labels.change}</th><th/></tr></thead><tbody>{visible.map(listing => <tr key={String(listing.listingId)} className="border-b border-charcoal/[0.06] last:border-0"><td className="px-2 py-3"><div className="flex items-center gap-2"><span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-linen/45 text-charcoal/35">{listing.thumbnailUrl ? <Image src={listing.thumbnailUrl} alt="" width={36} height={36} unoptimized className="size-full object-cover"/> : <ImageIcon size={15}/>}</span><span className="max-w-[240px] truncate text-[11px] font-semibold text-charcoal">{listing.title}</span></div></td><td className="text-[11px] text-charcoal/55">{listing.state}</td><td className="text-[11px] text-charcoal/55">{listing.views ?? "—"}</td><td className="text-[11px] text-charcoal/55">{listing.favorites ?? "—"}</td><td className="text-[10px] text-charcoal/45">{listing.updatedAt ? new Intl.DateTimeFormat().format(new Date(listing.updatedAt)) : "—"}</td><td><button type="button" onClick={() => setSelected(listing)} className="rounded-[8px] bg-terracotta px-2.5 py-1.5 text-[10px] font-semibold text-white">{labels.action}</button></td></tr>)}</tbody></table>}</div></section>
    <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><h2 className="text-[17px] font-semibold text-charcoal">{labels.changes}</h2><p className="mt-3 text-[12px] text-charcoal/50">{labels.noChanges}</p></section>
    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/25 p-4"><div className="w-full max-w-lg rounded-[18px] bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] uppercase tracking-[0.14em] text-terracotta">{labels.detail}</p><h2 className="mt-2 text-xl font-semibold text-charcoal">{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} className="text-[11px] text-charcoal/50">×</button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-[11px] bg-[#FCFAF8] p-3"><p className="text-[11px] text-charcoal/45">{labels.views}</p><p className="mt-1 font-semibold text-charcoal">{selected.views ?? "—"}</p></div><div className="rounded-[11px] bg-[#FCFAF8] p-3"><p className="text-[11px] text-charcoal/45">{labels.favorites}</p><p className="mt-1 font-semibold text-charcoal">{selected.favorites ?? "—"}</p></div></div><button type="button" className="mt-5 rounded-[9px] bg-terracotta px-3 py-2 text-[11px] font-semibold text-white">{labels.prepare}</button></div></div>}
  </div></div>;
}
