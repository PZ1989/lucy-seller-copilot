"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n";
import { useSession } from "@/lib/session";

const tabs = ["profile", "shop", "ai", "notifications", "more"] as const;
type Tab = (typeof tabs)[number];
type MoreView = "reports" | "language" | "security" | "legal" | "privacy";

const links: Array<{ label: string; href: string }> = [
  { label: "settings.more.reports", href: "/reports" },
  { label: "settings.more.security", href: "/settings" },
  { label: "settings.more.privacy", href: "/settings" },
  { label: "settings.more.connections", href: "/connections" },
  { label: "settings.more.billing", href: "/billing" },
];

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="rounded-[16px] border border-charcoal/[0.07] bg-white p-5 shadow-[0_12px_30px_rgba(51,51,51,0.035)]">{children}</section>;
}
function Heading({ title, detail }: { title: string; detail?: string }) {
  return <div className="mb-4"><h2 className="text-[17px] font-semibold tracking-[-0.03em] text-charcoal">{title}</h2>{detail && <p className="mt-1 text-[11px] leading-5 text-charcoal/45">{detail}</p>}</div>;
}
function State({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[11px] bg-[#FCFAF8] px-3 py-3 text-[12px] leading-5 text-charcoal/55">{children}</p>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-charcoal/[0.06] py-3 last:border-0"><span className="text-[12px] text-charcoal/55">{label}</span><span className="text-right text-[12px] font-semibold text-charcoal">{value}</span></div>;
}

export default function SettingsPage() {
  const { locale, setLocale, t } = useI18n();
  const { user, primaryShop, status } = useSession();
  const [active, setActive] = useState<Tab>("profile");
  const [moreView, setMoreView] = useState<MoreView | null>(null);

  function selectTab(tab: Tab) {
    setActive(tab);
    setMoreView(null);
  }

  return <main className="settings-page min-h-screen px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto w-full max-w-[1040px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("settings.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("settings.subtitle")}</p></header>
    <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-charcoal/[0.08] pb-1" role="tablist">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={active === tab} onClick={() => selectTab(tab)} className={`whitespace-nowrap rounded-[10px] px-3 py-2.5 text-[11px] font-semibold ${active === tab ? "bg-terracotta/10 text-terracotta" : "text-charcoal/45 hover:bg-white"}`}>{t(`settings.tab.${tab}`)}</button>)}</nav>

    {active === "profile" && <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><Panel><Heading title={t("settings.profile.title")} detail={t("settings.profile.subtitle")} /><div className="space-y-1"><Row label={t("settings.name")} value={user?.name || t("settings.unavailable")} /><Row label={t("settings.email")} value={user?.email || t("settings.unavailable")} /><Row label={t("settings.preferredLanguage")} value={locale === "uk" ? t("settings.language.ukrainian") : t("settings.language.english")} /></div><label className="mt-5 block text-[11px] font-semibold text-charcoal/55">{t("settings.preferredLanguage")}<select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-[12px] font-normal text-charcoal outline-none focus:border-terracotta/40"><option value="uk">{t("settings.language.ukrainian")}</option><option value="en">{t("settings.language.english")}</option></select></label></Panel><Panel><Heading title={t("settings.workspace.title")} detail={t("settings.workspace.subtitle")} /><Row label={t("settings.workspace.account")} value={status === "authenticated" ? t("settings.available") : t("settings.unavailable")} /><State>{t("settings.profile.noEditableSettings")}</State></Panel></div>}

    {active === "shop" && <div className="mt-6"><Panel><Heading title={t("settings.shop.title")} detail={t("settings.shop.subtitle")} />{primaryShop ? <div className="space-y-1"><Row label={t("settings.shop.selected")} value={primaryShop.name} /><Row label={t("settings.shop.marketplace")} value="Etsy" /></div> : <State>{t("settings.shop.unavailable")}</State>}<Link href="/connections" className="mt-5 inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[11px] font-semibold text-white">{t("settings.shop.connections")}</Link></Panel></div>}

    {active === "ai" && <div className="mt-6"><Panel><Heading title={t("settings.ai.title")} detail={t("settings.ai.subtitle")} /><State>{t("settings.ai.preferencesUnavailable")}</State></Panel></div>}

    {active === "notifications" && <div className="mt-6"><Panel><Heading title={t("settings.notifications.title")} detail={t("settings.notifications.subtitle")} /><State>{t("settings.notifications.unavailable")}</State></Panel></div>}

    {active === "more" && <div className="mt-6"><Panel><Heading title={t("settings.tab.more")} detail={t("settings.more.subtitle")} />{moreView === null ? <div className="grid gap-2 sm:grid-cols-2">{links.map((item) => <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-[11px] border border-charcoal/[0.08] bg-[#FCFAF8] px-4 py-3 text-[12px] font-semibold text-charcoal/70 hover:text-terracotta">{t(item.label)}<span aria-hidden="true">›</span></Link>)}{(["language", "legal"] as MoreView[]).map((view) => <button key={view} type="button" onClick={() => setMoreView(view)} className="flex items-center justify-between rounded-[11px] border border-charcoal/[0.08] bg-[#FCFAF8] px-4 py-3 text-left text-[12px] font-semibold text-charcoal/70 hover:text-terracotta">{t(`settings.more.${view}`)}<span aria-hidden="true">›</span></button>)}</div> : <MoreContent view={moreView} locale={locale} setLocale={setLocale} onBack={() => setMoreView(null)} t={t} />}</Panel></div>}
  </div></main>;
}

function MoreContent({ view, locale, setLocale, onBack, t }: { view: MoreView; locale: Locale; setLocale: (locale: Locale) => void; onBack: () => void; t: (key: string) => string }) {
  return <div><button type="button" onClick={onBack} className="mb-4 text-[11px] font-semibold text-terracotta">{t("settings.more.back")}</button>{view === "language" && <><Heading title={t("settings.more.language")} /><label className="block max-w-sm text-[11px] font-semibold text-charcoal/55">{t("settings.preferredLanguage")}<select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-[12px] font-normal text-charcoal"><option value="uk">{t("settings.language.ukrainian")}</option><option value="en">{t("settings.language.english")}</option></select></label></>}{view === "legal" && <><Heading title={t("settings.more.legal")} /><div className="grid gap-2 sm:grid-cols-2">{["/legal/privacy", "/legal/terms", "/legal/subscription"].map((href) => <Link key={href} href={href} className="rounded-[10px] border border-charcoal/[0.08] px-3 py-3 text-[11px] font-semibold text-charcoal/70 hover:text-terracotta">{href.split("/").pop()}</Link>)}</div></>}{(view === "reports" || view === "security" || view === "privacy") && <State>{t(`settings.more.${view}Unavailable`)}</State>}</div>;
}
