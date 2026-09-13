"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, Eye, Heart, Lightbulb, RefreshCw, Tag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { getEtsyListings, getEtsyStats } from "@/lib/api/etsy";
import type { EtsyListing, EtsyStats } from "@/lib/api/types";

const periods = ["7d", "30d", "90d"] as const;
type Period = (typeof periods)[number];
type Labels = { title: string; subtitle: string; period: Record<Period, string>; active: string; views: string; favorites: string; growth: string; noSeries: string; top: string; weak: string; analyze: string; recommends: string; noRecommendations: string; changes: string; noChanges: string; unavailable: string; noListings: string; connection: string; connect: string; retry: string; loading: string };

function labelsFor(locale: string): Labels {
  return locale === "uk" ? { title: "Аналітика", subtitle: "Слідкуйте за результатами магазину та знаходьте лістинги, які потребують уваги.", period: { "7d": "7 днів", "30d": "30 днів", "90d": "90 днів" }, active: "Активні лістинги", views: "Перегляди", favorites: "Вподобання", growth: "Динаміка магазину", noSeries: "Дані динаміки з’являться після підключення часового ряду.", top: "Найкращі лістинги", weak: "Слабкі лістинги", analyze: "Проаналізувати", recommends: "Lucy рекомендує", noRecommendations: "Змістовних рекомендацій поки немає.", changes: "Останні зміни", noChanges: "Змін ще немає.", unavailable: "Недоступно", noListings: "Лістингів ще немає.", connection: "Підключіть Etsy, щоб переглядати актуальні показники магазину.", connect: "Підключити Etsy", retry: "Спробувати ще раз", loading: "Завантаження…" } : { title: "Analytics", subtitle: "Track shop results and find listings that need attention.", period: { "7d": "7 days", "30d": "30 days", "90d": "90 days" }, active: "Active Listings", views: "Views", favorites: "Favorites", growth: "Shop Growth", noSeries: "Growth data will appear when a real time series is available.", top: "Top Listings", weak: "Weak Listings", analyze: "Analyze", recommends: "Lucy Recommends", noRecommendations: "No meaningful recommendations yet.", changes: "Recent Changes", noChanges: "No changes yet.", unavailable: "Unavailable", noListings: "No listings yet.", connection: "Connect Etsy to view current shop metrics.", connect: "Connect Etsy", retry: "Try again", loading: "Loading…" };
}

export default function AnalyticsPage() {
  const { locale } = useI18n();
  const { etsyConnection } = useSession();
  const labels = labelsFor(locale);
  const [period, setPeriod] = useState<Period>("30d");
  const [stats, setStats] = useState<EtsyStats | null>(null);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const connected = Boolean(etsyConnection?.connected && etsyConnection.connectionHealth !== "expired");

  const loadAnalytics = useCallback(() => {
    if (!connected) { setStats(null); setListings([]); setLoading(false); setError(false); return; }
    setLoading(true);
    setError(false);
    void Promise.all([getEtsyStats(), getEtsyListings({ limit: 100 })]).then(([nextStats, nextListings]) => { setStats(nextStats); setListings(nextListings.listings); }).catch(() => { setStats(null); setListings([]); setError(true); }).finally(() => setLoading(false));
  }, [connected]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics, reload]);

  const topListings = [...listings].sort((left, right) => (right.views ?? -1) - (left.views ?? -1)).slice(0, 5);
  const weakListings = [...listings].sort((left, right) => (left.views ?? Number.MAX_SAFE_INTEGER) - (right.views ?? Number.MAX_SAFE_INTEGER)).slice(0, 5);

  return <div className="min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1280px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-terracotta">Lucy Seller Copilot</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-charcoal">{labels.title}</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-charcoal/55">{labels.subtitle}</p></header>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><div className="inline-flex rounded-[10px] border border-charcoal/[0.1] bg-white p-1">{periods.map(item => <button key={item} type="button" onClick={() => setPeriod(item)} className={`rounded-[8px] px-3 py-2 text-[12px] font-semibold ${period === item ? "bg-charcoal text-white" : "text-charcoal/50"}`}>{labels.period[item]}</button>)}</div>{connected && <button type="button" onClick={() => setReload(value => value + 1)} className="inline-flex items-center gap-2 rounded-[10px] border border-charcoal/[0.1] bg-white px-3 py-2 text-[12px] font-semibold text-charcoal/60"><RefreshCw size={14}/>{labels.retry}</button>}</div>
    {!connected ? <section className="mt-6 flex flex-col justify-between gap-3 rounded-[14px] border border-terracotta/15 bg-[#FFF8F3] p-4 sm:flex-row sm:items-center"><p className="text-[13px] text-charcoal/60">{labels.connection}</p><Link href="/connections" className="inline-flex h-9 items-center justify-center rounded-[9px] bg-terracotta px-3 text-[12px] font-semibold text-white">{labels.connect}</Link></section> : error ? <section className="mt-6 flex items-center justify-between gap-3 rounded-[14px] border border-charcoal/[0.08] bg-white p-4"><p className="text-[13px] text-charcoal/60">{labels.unavailable}</p><button type="button" onClick={() => setReload(value => value + 1)} className="rounded-[9px] bg-terracotta px-3 py-2 text-[12px] font-semibold text-white">{labels.retry}</button></section> : null}
    <section className="mt-6 grid gap-4 md:grid-cols-3">{[[labels.active, <Tag key="active" size={17}/>, stats?.activeListings], [labels.views, <Eye key="views" size={17}/>, stats?.views], [labels.favorites, <Heart key="favorites" size={17}/>, stats?.favorites]].map(([label, icon, value]) => <article key={label as string} className="rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><span className="grid size-9 place-items-center rounded-[10px] bg-[#F7F4F1] text-charcoal/55">{icon}</span><p className="mt-3 text-[13px] font-semibold text-charcoal/60">{label}</p>{loading ? <div className="mt-2 h-7 w-20 animate-pulse rounded bg-charcoal/[0.08]" /> : <p className="mt-1 text-2xl font-semibold text-charcoal">{connected && !error && value != null ? value : labels.unavailable}</p>}</article>)}</section>
    <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><div className="flex items-center gap-2"><BarChart3 size={17} className="text-terracotta"/><h2 className="text-[17px] font-semibold text-charcoal">{labels.growth}</h2></div><div className="mt-4 grid min-h-[150px] place-items-center rounded-[12px] bg-[#FCFAF8] text-center"><div><BarChart3 size={25} className="mx-auto text-charcoal/25"/><p className="mt-2 text-[13px] font-semibold text-charcoal/65">{labels.noSeries}</p><p className="mt-1 text-[11px] text-charcoal/40">{labels.views} · {labels.favorites} · {labels.period[period]}</p></div></div></section>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><ListingGroup title={labels.top} listings={topListings} labels={labels} loading={loading} weak={false}/><ListingGroup title={labels.weak} listings={weakListings} labels={labels} loading={loading} weak/></div>
    <section className="mt-6 rounded-[16px] border border-terracotta/15 bg-[#FFF8F3] p-4"><div className="flex items-center gap-2"><Lightbulb size={17} className="text-terracotta"/><h2 className="text-[17px] font-semibold text-charcoal">{labels.recommends}</h2></div><p className="mt-3 text-[12px] text-charcoal/50">{labels.noRecommendations}</p></section>
    <section className="mt-6 rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><h2 className="text-[17px] font-semibold text-charcoal">{labels.changes}</h2><p className="mt-3 text-[12px] text-charcoal/50">{labels.noChanges}</p></section>
  </div></div>;
}

function ListingGroup({ title, listings, labels, loading, weak }: { title: string; listings: EtsyListing[]; labels: Labels; loading: boolean; weak: boolean }) {
  return <section className="rounded-[16px] border border-charcoal/[0.07] bg-white p-4"><h2 className="text-[17px] font-semibold text-charcoal">{title}</h2>{loading ? <div className="mt-4 space-y-2">{[1, 2, 3].map(item => <div key={item} className="h-14 animate-pulse rounded-[10px] bg-charcoal/[0.06]" />)}</div> : listings.length === 0 ? <p className="mt-3 text-[12px] text-charcoal/50">{labels.noListings}</p> : <div className="mt-3 space-y-2">{listings.map(listing => <div key={String(listing.listingId)} className="flex items-center gap-3 rounded-[10px] bg-[#FCFAF8] p-2.5"><span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-linen/45 text-charcoal/35">{listing.thumbnailUrl ? <Image src={listing.thumbnailUrl} alt="" width={40} height={40} unoptimized className="size-full object-cover"/> : <BarChart3 size={15}/>}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[12px] font-semibold text-charcoal">{listing.title}</strong><span className="mt-1 block text-[10px] text-charcoal/45">{labels.views}: {listing.views ?? "—"} · {labels.favorites}: {listing.favorites ?? "—"}</span></span>{weak && <Link href="/research" className="shrink-0 rounded-[8px] bg-terracotta px-2.5 py-1.5 text-[10px] font-semibold text-white">{labels.analyze}</Link>}</div>)}</div>}</section>;
}
