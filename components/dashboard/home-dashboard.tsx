"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/dashboard/icons";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { getEtsyListings, getEtsyStats } from "@/lib/api/etsy";
import type { EtsyListing, EtsyStats } from "@/lib/api/types";
import { useSession } from "@/lib/session";
import { useSubscription } from "@/lib/subscription";

const quickActions = [
  { titleKey: "home.quickActions.createListing", subtitleKey: "home.quickActions.createListingDesc", icon: "plus" as IconName, href: "/listings?create=1" },
  { titleKey: "home.quickActions.generateImages", subtitleKey: "home.quickActions.generateImagesDesc", icon: "sparkles" as IconName, href: "/image-studio" },
  { titleKey: "home.quickActions.analyzeShop", subtitleKey: "home.quickActions.analyzeShopDesc", icon: "analytics" as IconName, href: "/analytics" },
  { titleKey: "home.quickActions.researchNiche", subtitleKey: "home.quickActions.researchNicheDesc", icon: "search" as IconName, href: "/research" },
  { titleKey: "home.quickActions.askLucy", subtitleKey: "home.quickActions.askLucyDesc", icon: "sparkles" as IconName, href: "/chat" },
];

export default function Home() {
  const { t } = useI18n();
  const { user, primaryShop, status, etsyConnection } = useSession();
  const { paid } = useSubscription();
  const [stats, setStats] = useState<EtsyStats | null>(null);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [dataError, setDataError] = useState(false);
  const shopName = primaryShop?.name ?? t("home.simple.noShop");
  const displayName = user?.name && !/^(owner|admin|administrator|user|client)$/i.test(user.name.trim()) ? user.name.trim() : "";
  const etsyConnected = status === "authenticated" && etsyConnection?.connected === true && etsyConnection.connectionHealth !== "expired";
  const connected = paid && etsyConnected;
  const unavailable = !paid || !stats;

  useEffect(() => {
    if (!connected) { setStats(null); setListings([]); setDataError(false); return; }
    let active = true;
    setDataError(false);
    void Promise.all([getEtsyStats(), getEtsyListings({ limit: 1 })]).then(([nextStats, response]) => {
      if (active) { setStats(nextStats); setListings(response.listings); }
    }).catch(() => { if (active) { setStats(null); setListings([]); setDataError(true); } });
    return () => { active = false; };
  }, [connected]);

  const recommendation = etsyConnected && listings.length > 0
    ? { title: t("home.simple.recommend.reviewListings"), body: t("home.simple.recommend.reviewListingsDesc"), action: t("home.simple.recommend.open"), href: "/monitoring" }
    : { title: t("home.simple.connectTitle"), body: t("home.simple.connectBody"), action: t("home.simple.connect"), href: "/connections" };

  return <div className="dashboard-home min-h-screen bg-[#F7F4F1] px-4 pb-12 pt-5 sm:px-6 lg:px-8 lg:pt-7"><div className="mx-auto max-w-[1320px]">
    <header className="mb-7 flex items-center justify-between gap-4 border-b border-[#333333]/10 pb-5"><div><h1 className="text-[26px] font-semibold tracking-[-0.045em] text-[#333333]">{t("home.simple.welcome")}{displayName ? `, ${displayName}` : ""}! 👋</h1><p className="mt-1 text-[14px] text-[#333333]/50">{t("home.simple.today")}</p></div><div className="flex items-center gap-2 sm:gap-3"><button type="button" aria-label={t("home.notifications")} className="relative grid size-10 place-items-center rounded-xl border border-[#333333]/10 bg-white text-[#333333]/55"><Bell size={17}/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#F74E03]"/></button><LanguageSwitcher/><select aria-label={t("home.storePicker")} className="hidden h-10 min-w-[220px] max-w-[260px] rounded-xl border border-[#333333]/10 bg-white px-3 text-xs text-[#333333] outline-none sm:block"><option>{shopName}</option></select></div></header>

    <section className="overflow-hidden rounded-[30px] border border-[#333333]/8 bg-gradient-to-br from-white via-[#FFFDFC] to-[#F4F7F8] p-6 shadow-[0_20px_60px_rgba(51,51,51,0.06)] sm:p-8 lg:min-h-[500px] lg:p-10"><div className="grid min-h-[440px] items-center gap-8 lg:grid-cols-[34%_36%_30%]"><div className="flex flex-col justify-center"><div className="mb-5 inline-flex w-fit flex-col text-[11px] font-semibold uppercase leading-5 tracking-[0.16em] text-[#F74E03]"><span>{t("home.simple.referenceBadge")}</span><span className="text-[#333333]/45">{t("home.simple.referenceBadgeSub")}</span></div><h2 className="max-w-[390px] text-[clamp(2.8rem,4vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-[#333333]">{t("home.hero.greeting")}<br/><span className="text-[#F74E03]">{t("home.hero.name")}</span></h2><p className="mt-6 max-w-[390px] text-[16px] leading-7 text-[#333333]/65">{t("home.simple.referenceBody")}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/chat" className="rounded-[14px] bg-[#F74E03] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(247,78,3,0.2)]">{t("home.simple.startChat")}</Link><Link href="/chat" className="rounded-[14px] border border-[#333333]/12 bg-white px-5 py-3 text-[14px] font-semibold text-[#333333]/75">{t("home.simple.promptExamples")}</Link></div><div className="mt-6 flex items-center gap-3 text-[13px] text-[#333333]/50"><span className="flex -space-x-2"><span className="size-7 rounded-full border-2 border-white bg-[#AAC1D1]"/><span className="size-7 rounded-full border-2 border-white bg-[#E7E0DA]"/><span className="size-7 rounded-full border-2 border-white bg-[#F74E03]/60"/></span><span><strong className="text-[#333333]">+2.5K</strong><br/>{t("home.simple.socialProof")}</span></div></div>

      <div className="flex h-[390px] items-center justify-center lg:h-full"><Image src="/lucy/lucy-updated.png" alt={t("home.hero.name")} width={1843} height={2139} preload className="h-[390px] w-[390px] object-contain drop-shadow-[0_24px_30px_rgba(247,78,3,0.16)] sm:h-[460px] sm:w-[460px] lg:h-[510px] lg:w-[510px]"/></div>

      <div className="flex flex-col justify-center rounded-[22px] border border-[#333333]/8 bg-white/80 p-4 shadow-[0_12px_30px_rgba(51,51,51,0.04)]"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#333333]/45">{t("home.simple.accountsLabel")}</p><h3 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-[#333333]">{t("home.simple.environment")}</h3><div className="mt-4 space-y-2">{[{name:"Etsy",icon:"shop",status:etsyConnected?t("common.connected"):t("connections.status.notConnected"),tone:etsyConnected?"green":"red"},{name:"ChatGPT",icon:"bot",status:t("common.unavailable"),tone:"neutral"},{name:"Claude",icon:"sparkles",status:t("common.unavailable"),tone:"neutral"}].map(item=><div key={item.name} className="flex min-h-[50px] items-center gap-3 rounded-[14px] border border-[#333333]/8 px-3"><span className="grid size-9 place-items-center rounded-[11px] bg-[#F7F4F1] text-[#333333]/55"><Icon name={item.icon as IconName} size={16}/></span><span className="flex-1 text-[14px] font-semibold text-[#333333]">{item.name}</span><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${item.tone === "red" ? "bg-[#FFF0EC] text-[#B34A35]" : item.tone === "neutral" ? "bg-[#F4F2F0] text-[#4D4D4D]" : "bg-[#EAF6EF] text-[#2D8158]"}`}>{item.status}</span><Icon name="chevron-right" size={14} className="text-[#333333]/30"/></div>)}</div><div className="mt-4 flex gap-2 border-t border-[#333333]/8 pt-3 text-[13px] leading-5 text-[#333333]/55"><span className="text-[#F74E03]">✦</span>{t("home.simple.connectionHelper")}</div></div>
    </div></section>

    <section className="mt-8 grid gap-5 md:grid-cols-3">{[[t("home.stats.title"), unavailable ? t("common.unavailable") : new Intl.NumberFormat().format(stats?.activeListings ?? 0), "tag"], [t("home.stats.views"), unavailable || stats?.views === null ? t("common.unavailable") : new Intl.NumberFormat().format(stats?.views ?? 0), "eye"], [t("home.stats.favorites"), unavailable || stats?.favorites === null ? t("common.unavailable") : new Intl.NumberFormat().format(stats?.favorites ?? 0), "sparkles"]].map(([label,value,icon])=><article key={label} className="flex items-center gap-4 rounded-[18px] border border-[#333333]/8 bg-white p-4"><span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-[#F7F4F1] text-[#F74E03]"><Icon name={icon as IconName} size={18}/></span><div><p className="text-[14px] font-semibold text-[#333333]/55">{label}</p><p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#333333]">{value}</p></div></article>)}</section>

    <section className="mt-8 grid gap-5 xl:grid-cols-2"><div className="rounded-[20px] border border-[#333333]/8 bg-white p-5 sm:p-6"><h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#333333]">{t("home.needsAttention.title")}</h2><p className="mt-2 text-[14px] text-[#333333]/50">{t("home.needsAttention.subtitle")}</p><div className="mt-5 rounded-[15px] bg-[#FAF9F7] p-4 text-[14px] leading-6 text-[#333333]/58">{dataError ? t("home.needsAttention.dataError") : connected ? t("home.needsAttention.empty") : t("home.simple.connectIssue")}</div></div><div className="rounded-[20px] border border-[#333333]/8 bg-white p-5 sm:p-6"><h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#333333]">{t("home.simple.recommends")}</h2><div className="mt-5"><Link href={recommendation.href} className="flex items-center justify-between gap-3 rounded-[14px] border border-[#333333]/8 p-4"><span><span className="block text-[15px] font-semibold text-[#333333]">{recommendation.title}</span><span className="mt-1 block text-[13px] leading-5 text-[#333333]/50">{recommendation.body}</span></span><span className="shrink-0 text-[13px] font-semibold text-[#F74E03]">{recommendation.action}</span></Link></div></div></section>

    <section className="mt-8 rounded-[20px] border border-[#333333]/8 bg-white p-5 sm:p-6"><h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#333333]">{t("home.simple.quickActions")}</h2><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{quickActions.map((item,index)=><Link key={item.titleKey} href={item.href} className={`rounded-[16px] border p-4 transition hover:-translate-y-0.5 hover:border-[#F74E03]/30 ${index===0||index===4?"border-[#F74E03]/20 bg-[#FFF8F3]":"border-[#333333]/8 bg-white"}`}><span className={`grid size-10 place-items-center rounded-[11px] ${index===0||index===4?"bg-[#F74E03] text-white":"bg-[#F7F4F1] text-[#333333]/60"}`}><Icon name={item.icon} size={18}/></span><span className="mt-4 block text-[14px] font-semibold text-[#333333]">{t(item.titleKey)}</span><span className="mt-1 block text-[13px] leading-5 text-[#333333]/50">{t(item.subtitleKey)}</span></Link>)}</div></section>

    <section className="mt-8 rounded-[18px] border border-[#333333]/8 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-[20px] font-semibold text-[#333333]">{t("home.simple.connections")}</h2><p className="mt-1 text-[13px] text-[#333333]/50">{t("home.simple.connectionsDesc")}</p></div><Link href="/connections" className="text-[13px] font-semibold text-[#F74E03]">{t("home.simple.manageConnections")}</Link></div><div className="mt-4 flex flex-wrap gap-5 text-[13px] text-[#333333]/65">{[{name:"Etsy",ok:etsyConnected},{name:"Telegram",ok:false},{name:"AI",ok:true}].map(item=><span key={item.name} className="inline-flex items-center gap-2"><span className={`size-2 rounded-full ${item.ok?"bg-[#2B8A5C]":"bg-[#333333]/20"}`}/>{item.name}<span className="text-[12px] text-[#333333]/40">{item.ok?t("common.connected"):t("connections.status.notConnected")}</span></span>)}</div></section>
  </div></div>;
}
