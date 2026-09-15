"use client";

import { useCallback, useEffect, useState } from "react";
import { getEtsyConnection, etsyOAuthStartUrl, disconnectEtsy } from "@/lib/api/etsy";
import type { EtsyConnection } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/dashboard/icons";

export default function ConnectionsPage() {
  const { t } = useI18n();
  const [etsy, setEtsy] = useState<EtsyConnection | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => { try { setEtsy(await getEtsyConnection()); setError(""); } catch { if (!etsy) setError(t("connections.error.check")); } }, [etsy, t]);
  useEffect(() => { void refresh(); }, [refresh]);
  const connected = Boolean(etsy?.connected && etsy.connectionHealth !== "expired");
  const connect = () => { try { window.location.assign(etsyOAuthStartUrl()); } catch { setError(t("connections.error.check")); } };
  const disconnect = async () => { if (!window.confirm(t("connections.confirm.disconnect"))) return; try { await disconnectEtsy(etsy?.shopId ?? undefined); await refresh(); } catch { setError(t("connections.error.disconnect")); } };
  return <div className="min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1120px]"><header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold text-charcoal">{t("connections.header.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("connections.header.subtitle")}</p></header>{error && <p role="alert" className="mt-5 rounded-[14px] bg-[#FFF8F3] p-4 text-[12px] text-[#B34A35]">{error}</p>}<div className="mt-6 grid gap-4 md:grid-cols-2"><Card title="Etsy" description={t("connections.service.etsyDesc")} icon="shop" status={connected ? t("connections.status.connected") : t("connections.status.notConnected")} action={connected ? t("connections.actions.disconnect") : t("connections.actions.connectEtsy")} onAction={() => connected ? void disconnect() : connect()} detail={etsy?.shopName ?? undefined}/><Card title="Telegram" description={t("connections.service.telegramDesc")} icon="send" status={t("connections.status.notConnected")} action={t("connections.actions.setupTelegram")} onAction={() => undefined}/><InfoCard title="Lucy AI" description={t("connections.service.lucyAiDesc")} detail="OpenAI + Claude"/></div></div></div>;
}

function Card({ title, description, icon, status, action, detail, onAction }: { title: string; description: string; icon: "shop" | "send"; status: string; action: string; detail?: string; onAction: () => void }) { return <article className="flex min-h-[220px] flex-col rounded-[16px] border border-charcoal/[0.07] bg-white p-5"><div className="grid size-11 place-items-center rounded-[13px] bg-[#FFF1E9] text-terracotta"><Icon name={icon} size={20}/></div><h2 className="mt-5 text-[16px] font-semibold text-charcoal">{title}</h2><p className="mt-2 text-[11px] leading-5 text-charcoal/55">{description}</p>{detail && <p className="mt-3 text-[11px] font-semibold text-charcoal/55">{detail}</p>}<div className="mt-auto flex items-center justify-between gap-3 pt-5"><span className="text-[10px] font-semibold text-charcoal/50">{status}</span><button type="button" onClick={onAction} className="inline-flex h-9 items-center rounded-[10px] bg-terracotta px-3 text-[10px] font-semibold text-white">{action}</button></div></article>; }
function InfoCard({ title, description, detail }: { title: string; description: string; detail: string }) { return <article className="flex min-h-[220px] flex-col rounded-[16px] border border-charcoal/[0.07] bg-white p-5"><div className="grid size-11 place-items-center rounded-[13px] bg-[#FFF1E9] text-terracotta"><Icon name="sparkles" size={20}/></div><h2 className="mt-5 text-[16px] font-semibold text-charcoal">{title}</h2><p className="mt-2 text-[11px] leading-5 text-charcoal/55">{description}</p><p className="mt-auto pt-5 text-[11px] font-semibold text-charcoal/55">{detail}</p></article>; }
