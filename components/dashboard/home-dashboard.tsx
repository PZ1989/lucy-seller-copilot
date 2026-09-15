"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/dashboard/icons";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { getEtsyListings, getEtsyStats, getLucyCredits } from "@/lib/api/etsy";
import type { EtsyListing, EtsyStats, LucyCreditStatus } from "@/lib/api/types";
import { useSession } from "@/lib/session";
import { useSubscription } from "@/lib/subscription";

const quickActions = [
  ["home.quickActions.createListing", "home.quickActions.createListingDesc", "plus", "/listings?create=1"],
  ["home.quickActions.generateImages", "home.quickActions.generateImagesDesc", "sparkles", "/image-studio"],
  ["home.quickActions.analyzeShop", "home.quickActions.analyzeShopDesc", "analytics", "/analytics"],
  ["home.quickActions.researchNiche", "home.quickActions.researchNicheDesc", "search", "/research"],
  ["home.quickActions.askLucy", "home.quickActions.askLucyDesc", "sparkles", "/chat"],
] as const;

export default function Home() {
  const { t } = useI18n();
  const { user, primaryShop, status, etsyConnection } = useSession();
  const { paid } = useSubscription();
  const [stats, setStats] = useState<EtsyStats | null>(null);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [credits, setCredits] = useState<LucyCreditStatus | null>(null);
  const [dataError, setDataError] = useState(false);
  const shopName = primaryShop?.name ?? t("home.simple.noShop");
  const displayName = user?.name && !/^(owner|admin|administrator|user|client)$/i.test(user.name.trim()) ? user.name.trim() : "";
  const etsyConnected = status === "authenticated" && etsyConnection?.connected === true && etsyConnection.connectionHealth !== "expired";
  const connected = paid && etsyConnected;
  const unavailable = !paid || !stats;

  useEffect(() => {
    let active = true;
    void getLucyCredits().then((balance) => { if (active) setCredits(balance); }).catch(() => undefined);
    if (!connected) { setStats(null); setListings([]); setDataError(false); return () => { active = false; }; }
    setDataError(false);
    void Promise.all([getEtsyStats(), getEtsyListings({ limit: 1 })]).then(([nextStats, response]) => { if (active) { setStats(nextStats); setListings(response.listings); } }).catch(() => { if (active) { setStats(null); setListings([]); setDataError(true); } });
    return () => { active = false; };
  }, [connected]);

  const recommendation = etsyConnected && listings.length > 0 ? { title: t("home.simple.recommend.reviewListings"), body: t("home.simple.recommend.reviewListingsDesc"), action: t("home.simple.recommend.open"), href: "/monitoring" } : { title: t("home.simple.connectTitle"), body: t("home.simple.connectBody"), action: t("home.simple.connect"), href: "/connections" };
  const accounts = [
    { name: "Etsy", icon: "shop", connected: etsyConnected },
    { name: "Telegram", icon: "send", connected: false },
  ];

  return <div className="dashboard-home min-h-screen bg-[#F7F4F1] px-4 pb-12 pt-5 sm:px-6 lg:px-8 lg:pt-7"><div className="mx-auto max-w-[1320px]">{credits && <div className="mb-4 flex items-center justify-between rounded-[14px] border border-[#333333]/8 bg-white px-4 py-3"><span className="text-[12px] font-semibold text-[#333333]">AI Credits</span><span className="text-[12px] text-[#333333]/55">{credits.totalAvailable.toLocaleString()} / {credits.monthlyAllowance.toLocaleString()}</span></div>}
    <header className="mb-7 flex items-center justify-between gap-4 border-b border-[#333333]/10 pb-5"><div><h1 className="text-[26px] font-semibold tracking-[-0.045em] text-[#333333]">{t("home.simple.welcome")}{displayName ? `, ${displayName}` : ""}!</h1><p className="mt-1 text-[14px] text-[#333333]/50">{t("home.simple.today")}</p></div><div className="flex items-center gap-2 sm:gap-3"><button type="button" aria-label={t("home.notifications")} className="relative grid size-10 place-items-center rounded-xl border border-[#333333]/10 bg-white text-[#333333]/55"><Bell size={17}/></button><LanguageSwitcher/><select aria-label={t("home.storePicker")} className="hidden h-10 min-w-[220px] rounded-xl border border-[#333333]/10 bg-white px-3 text-xs sm:block"><option>{shopName}</option></select></div></header>
    <section className="overflow-hidden rounded-[30px] border border-[#333333]/8 bg-gradient-to-br from-white via-[#FFFDFC] to-[#F4F7F8] p-6 shadow-[0_20px_60px_rgba(51,51,51,0.06)] sm:p-8 lg:p-10"><div className="grid items-center gap-8 lg:grid-cols-[34%_36%_30%]"><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F74E03]">{t("home.simple.referenceBadge")}</p><h2 className="mt-5 text-[clamp(2.8rem,4vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-[#333333]">{t("home.hero.greeting")}<br/><span className="text-[#F74E03]">{t("home.hero.name")}</span></h2><p className="mt-6 max-w-[390px] text-[16px] leading-7 text-[#333333]/65">{t("home.simple.referenceBody")}</p><Link href="/chat" className="mt-7 inline-flex rounded-[14px] bg-[#F74E03] px-5 py-3 text-[14px] font-semibold text-white">{t("home.simple.startChat")}</Link></div><div className="flex justify-center"><Image src="/lucy/lucy-updated.png" alt={t("home.hero.name")} width={1843} height={2139} preload className="h-[390px] w-[390px] object-contain lg:h-[510px] lg:w-[510px]"/></div><div className="rounded-[22px] border border-[#333333]/8 bg-white/80 p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#333333]/45">{t("home.simple.accountsLabel")}</p><h3 className="mt-2 text-[22px] font-semibold text-[#333333]">{t("home.simple.environment")}</h3><div className="mt-4 space-y-2">{accounts.map((account) => <div key={account.name} className="flex min-h-[50px] items-center gap-3 rounded-[14px] border border-[#333333]/8 px-3"><span className="grid size-9 place-items-center rounded-[11px] bg-[#F7F4F1] text-[#333333]/55"><Icon name={account.icon as IconName} size={16}/></span><span className="flex-1 text-[14px] font-semibold text-[#333333]">{account.name}</span><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${account.connected ? "bg-[#EAF6EF] text-[#2D8158]" : "bg-[#F4F2F0] text-[#4D4D4D]"}`}>{account.connected ? t("common.connected") : t("connections.status.notConnected")}</span></div>)}</div></div></div></section>
    <section className="mt-8 grid gap-5 md:grid-cols-3">{[[t("home.stats.title"), unavailable ? t("common.unavailable") : new Intl.NumberFormat().format(stats?.activeListings ?? 0)], [t("home.stats.views"), unavailable || stats?.views === null ? t("common.unavailable") : new Intl.NumberFormat().format(stats?.views ?? 0)], [t("home.stats.favorites"), unavailable || stats?.favorites === null ? t("common.unavailable") : new Intl.NumberFormat().format(stats?.favorites ?? 0)]].map(([label, value]) => <article key={label} className="rounded-[18px] border border-[#333333]/8 bg-white p-4"><p className="text-[14px] font-semibold text-[#333333]/55">{label}</p><p className="mt-1 text-[30px] font-semibold text-[#333333]">{value}</p></article>)}</section>
    <section className="mt-8 grid gap-5 xl:grid-cols-2"><div className="rounded-[20px] border border-[#333333]/8 bg-white p-5"><h2 className="text-[22px] font-semibold text-[#333333]">{t("home.needsAttention.title")}</h2><div className="mt-5 rounded-[15px] bg-[#FAF9F7] p-4 text-[14px] text-[#333333]/58">{dataError ? t("home.needsAttention.dataError") : connected ? t("home.needsAttention.empty") : t("home.simple.connectIssue")}</div></div><div className="rounded-[20px] border border-[#333333]/8 bg-white p-5"><h2 className="text-[22px] font-semibold text-[#333333]">{t("home.simple.recommends")}</h2><Link href={recommendation.href} className="mt-5 block rounded-[14px] border border-[#333333]/8 p-4"><span className="block text-[15px] font-semibold text-[#333333]">{recommendation.title}</span><span className="mt-1 block text-[13px] text-[#333333]/50">{recommendation.body}</span></Link></div></section>
    <section className="mt-8 rounded-[20px] border border-[#333333]/8 bg-white p-5"><h2 className="text-[22px] font-semibold text-[#333333]">{t("home.simple.quickActions")}</h2><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{quickActions.map(([titleKey, subtitleKey, icon, href]) => <Link key={titleKey} href={href} className="rounded-[16px] border border-[#333333]/8 p-4"><span className="grid size-10 place-items-center rounded-[11px] bg-[#F7F4F1] text-[#333333]/60"><Icon name={icon} size={18}/></span><span className="mt-4 block text-[14px] font-semibold text-[#333333]">{t(titleKey)}</span><span className="mt-1 block text-[13px] text-[#333333]/50">{t(subtitleKey)}</span></Link>)}</div></section>
  </div></div>;
}
