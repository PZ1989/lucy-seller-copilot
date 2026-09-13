"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api/types";
import { getSession } from "@/lib/api/auth";
import { disconnectEtsy, etsyOAuthStartUrl, getEtsyConnection, getLucyProviderStatus } from "@/lib/api/etsy";
import type { EtsyConnection } from "@/lib/api/types";
import { Icon } from "@/components/dashboard/icons";
import { useI18n } from "@/lib/i18n";

type StatusTone = "green" | "orange" | "blue" | "neutral";
type ServiceId = "etsy" | "telegram" | "chatgpt" | "claude";
type LoadState = "loading" | "authenticated" | "unauthenticated" | "error";

type ServiceItem = {
  id: ServiceId;
  titleKey: string;
  descriptionKey: string;
  icon: "shop" | "send" | "bot" | "sparkles";
};

const services: ServiceItem[] = [
  { id: "etsy", titleKey: "connections.service.etsy", descriptionKey: "connections.service.etsyDesc", icon: "shop" },
  { id: "telegram", titleKey: "connections.service.telegram", descriptionKey: "connections.service.telegramDesc", icon: "send" },
  { id: "chatgpt", titleKey: "connections.service.chatgpt", descriptionKey: "connections.service.chatgptDesc", icon: "bot" },
  { id: "claude", titleKey: "connections.service.claude", descriptionKey: "connections.service.claudeDesc", icon: "sparkles" },
];

function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const statusClasses: Record<StatusTone, string> = {
    green: "bg-[#EAF6EF] text-[#2D8158]",
    orange: "bg-[#FFF1E9] text-[#F74E03]",
    blue: "bg-[#EEF5F8] text-[#52758C]",
    neutral: "bg-[#F4F2F0] text-[#4D4D4D]",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusClasses[tone]}`}>{label}</span>;
}

export default function ConnectionsPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const etsyCallback = searchParams?.get("etsy") ?? "";
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [connection, setConnection] = useState<EtsyConnection | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [disconnecting, setDisconnecting] = useState(false);
  const [providers, setProviders] = useState({ openai: false, claude: false });

  const refreshConnection = useCallback(async () => {
    try {
      const [session, etsy, providerStatus] = await Promise.all([getSession(), getEtsyConnection(), getLucyProviderStatus()]);
      if (!session?.user) throw new ApiError("Your session has expired.", "unauthenticated");
      setConnection(etsy);
      setProviders(providerStatus);
      setLoadState("authenticated");
      setErrorMessage("");
    } catch (requestError) {
      const apiError = requestError instanceof ApiError ? requestError : new ApiError("The API is unavailable.", "unavailable");
      setConnection(null);
      setLoadState(apiError.code === "unauthenticated" ? "unauthenticated" : "error");
      setErrorMessage(t("connections.error.check"));
    }
  }, [t]);

  useEffect(() => {
    void refreshConnection();
  }, [etsyCallback, pathname, refreshConnection]);

  function connectEtsy() {
    try {
      window.location.assign(etsyOAuthStartUrl());
    } catch {
      setErrorMessage(t("connections.error.check"));
    }
  }

  async function handleDisconnect() {
    if (!window.confirm(t("connections.confirm.disconnect"))) return;
    setDisconnecting(true);
    try {
      await disconnectEtsy(connection?.shopId ?? undefined);
      await refreshConnection();
    } catch {
      setErrorMessage(t("connections.error.disconnect"));
    } finally {
      setDisconnecting(false);
    }
  }

  const etsyConnected = connection?.connected === true && connection.connectionHealth !== "expired";
  const statusFor = (id: ServiceId): { label: string; tone: StatusTone } => {
    if (id === "etsy") return etsyConnected ? { label: t("connections.status.connected"), tone: "green" } : { label: t("connections.status.notConnected"), tone: "neutral" };
    if (id === "chatgpt") return providers.openai ? { label: t("connections.status.connected"), tone: "green" } : { label: t("connections.status.availableInLucy"), tone: "blue" };
    if (id === "claude") return providers.claude ? { label: t("connections.status.availableInLucy"), tone: "blue" } : { label: t("connections.status.unavailable"), tone: "neutral" };
    return { label: t("connections.status.notConnected"), tone: "neutral" };
  };

  if (loadState === "loading") {
    return <div className="min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto w-full max-w-[1120px]"><div className="h-24 animate-pulse rounded-[20px] bg-white/60"/><div className="mt-6 grid gap-4 md:grid-cols-2">{services.map((service) => <div key={service.id} className="h-[248px] animate-pulse rounded-[20px] bg-white/60"/>)}</div></div></div>;
  }

  return <div className="connections-page min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8"><div className="mx-auto w-full max-w-[1120px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("connections.header.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("connections.header.subtitle")}</p></header>
    {loadState === "unauthenticated" && <div role="alert" className="mt-6 rounded-[14px] border border-charcoal/[0.1] bg-white px-4 py-3 text-[13px] text-charcoal/65">{t("connections.error.unauthenticated")}</div>}
    {errorMessage && <div role="alert" className="mt-6 flex items-center justify-between gap-3 rounded-[14px] border border-terracotta/20 bg-[#FFF8F3] px-4 py-3 text-[13px] text-charcoal/70"><span>{errorMessage}</span><button type="button" onClick={() => void refreshConnection()} className="font-semibold text-terracotta">{t("connections.error.retry")}</button></div>}
    <section aria-label={t("connections.services.title")} className="mt-6 grid items-stretch gap-4 md:grid-cols-2">{services.map((service) => { const status = statusFor(service.id); return <article key={service.id} className="flex min-h-[224px] flex-col rounded-[16px] border border-charcoal/[0.07] bg-white p-5 shadow-[0_14px_35px_rgba(51,51,51,0.035)]"><div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-[13px] bg-[#FFF1E9] text-terracotta"><Icon name={service.icon} size={20}/></span><StatusBadge label={status.label} tone={status.tone}/></div><h2 className="mt-5 text-[16px] font-semibold text-charcoal">{t(service.titleKey)}</h2><p className="mt-2 max-w-sm text-[11px] leading-5 text-charcoal/55">{t(service.descriptionKey)}</p>{service.id === "etsy" && etsyConnected && connection?.shopName && <p className="mt-3 text-[12px] font-semibold text-charcoal">{connection.shopName}</p>}<div className="mt-auto pt-6">{service.id === "etsy" ? <button type="button" onClick={() => etsyConnected ? void handleDisconnect() : connectEtsy()} className="inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[10px] font-semibold text-white">{disconnecting ? t("connections.actions.disconnecting") : etsyConnected ? t("connections.actions.disconnect") : t("connections.actions.connectEtsy")}</button> : service.id === "telegram" ? <Link href="/settings" className="inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[10px] font-semibold text-white">{t("connections.actions.setupTelegram")}</Link> : service.id === "chatgpt" ? <Link href="/settings" className="inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[10px] font-semibold text-white">{t("connections.actions.settings")}</Link> : <button type="button" disabled className="inline-flex h-9 items-center rounded-[10px] bg-charcoal/10 px-3 text-[10px] font-semibold text-charcoal/45">{t("connections.status.unavailable")}</button>}</div></article>; })}</section>
  </div>
  </div>;
}
