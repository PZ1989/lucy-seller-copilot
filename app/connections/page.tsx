"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ApiError } from "@/lib/api/types";
import { getSession } from "@/lib/api/auth";
import { connectLucyProvider, disconnectEtsy, disconnectLucyProvider, etsyOAuthStartUrl, getEtsyConnection, getLucyConnections } from "@/lib/api/etsy";
import type { EtsyConnection, LucyConnections } from "@/lib/api/types";
import { Icon } from "@/components/dashboard/icons";

type Provider = "openai" | "anthropic";
type Tone = "green" | "orange" | "neutral";

function Badge({ label, tone }: { label: string; tone: Tone }) { const classes = { green: "bg-[#EAF6EF] text-[#2D8158]", orange: "bg-[#FFF1E9] text-[#F74E03]", neutral: "bg-[#F4F2F0] text-[#4D4D4D]" }; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${classes[tone]}`}>{label}</span>; }

export default function ConnectionsPage() {
  const { t } = useI18n();
  const [etsy, setEtsy] = useState<EtsyConnection | null>(null);
  const [ai, setAi] = useState<LucyConnections | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => { try { const [session, etsyConnection, aiConnections] = await Promise.all([getSession(), getEtsyConnection(), getLucyConnections()]); if (!session?.user) throw new ApiError("unauthenticated", "unauthenticated"); setEtsy(etsyConnection); setAi(aiConnections); setError(""); } catch { setError(t("connections.error.check")); } finally { setLoading(false); } }, [t]);
  useEffect(() => { void refresh(); }, [refresh]);

  async function saveProvider() { if (!activeProvider || !apiKey.trim()) return; setSaving(true); try { await connectLucyProvider(activeProvider, apiKey); setActiveProvider(null); setApiKey(""); await refresh(); } catch { setError(t("connections.error.aiSave")); } finally { setSaving(false); } }
  async function removeProvider(provider: Provider) { try { await disconnectLucyProvider(provider); await refresh(); } catch { setError(t("connections.error.aiRemove")); } }
  function connectEtsy() { try { window.location.assign(etsyOAuthStartUrl()); } catch { setError(t("connections.error.check")); } }
  async function removeEtsy() { if (!window.confirm(t("connections.confirm.disconnect"))) return; try { await disconnectEtsy(etsy?.shopId ?? undefined); await refresh(); } catch { setError(t("connections.error.disconnect")); } }

  if (loading) return <div className="min-h-screen px-4 pt-8"><div className="mx-auto max-w-[1120px]"><div className="h-24 animate-pulse rounded-[20px] bg-white/60"/></div></div>;
  const etsyConnected = etsy?.connected === true && etsy.connectionHealth !== "expired";
  const cards: Array<{ provider?: Provider; title: string; description: string; icon: "bot" | "sparkles" }> = [
    { provider: "openai", title: "OpenAI", description: t("connections.service.openaiDesc"), icon: "bot" },
    { provider: "anthropic", title: "Claude", description: t("connections.service.anthropicDesc"), icon: "sparkles" },
  ];
  return <div className="min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1120px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><h1 className="text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("connections.header.title")}</h1><p className="mt-2 max-w-xl text-[12px] leading-5 text-charcoal/55">{t("connections.header.subtitle")}</p></header>
    {error && <div role="alert" className="mt-6 rounded-[14px] border border-terracotta/20 bg-[#FFF8F3] px-4 py-3 text-[13px] text-charcoal/70">{error}</div>}
    <section className="mt-6 grid gap-4 md:grid-cols-2">
      <ConnectionCard title={t("connections.service.etsy")} description={t("connections.service.etsyDesc")} icon="shop" connected={etsyConnected} label={etsyConnected ? t("connections.status.connected") : t("connections.status.notConnected")} action={etsyConnected ? t("connections.actions.disconnect") : t("connections.actions.connectEtsy")} onAction={() => etsyConnected ? void removeEtsy() : connectEtsy()} detail={etsy?.shopName ?? undefined}/>
      <ConnectionCard title={t("connections.service.telegram")} description={t("connections.service.telegramDesc")} icon="send" connected={false} label={t("connections.status.notConnected")} action={t("connections.actions.setupTelegram")} onAction={() => undefined}/>
      {cards.map((card) => { const connection = ai?.[card.provider!]; return <ConnectionCard key={card.provider} title={card.title} description={card.description} icon={card.icon} connected={Boolean(connection?.connected)} label={connection?.connected ? t("connections.status.connected") : t("connections.status.notConnected")} action={connection?.connected ? t("connections.actions.disconnectAi") : card.provider === "openai" ? t("connections.actions.connectOpenai") : t("connections.actions.connectClaude")} onAction={() => connection?.connected ? void removeProvider(card.provider!) : setActiveProvider(card.provider!)} detail={connection?.fingerprint ?? undefined}/>; })}
    </section>
    {activeProvider && <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/30 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-[18px] bg-white p-5"><h2 className="text-lg font-semibold text-charcoal">{activeProvider === "openai" ? t("connections.fields.openaiKey") : t("connections.fields.anthropicKey")}</h2><input type="password" autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} className="mt-4 h-10 w-full rounded-[10px] border border-charcoal/[0.1] px-3 text-sm"/><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setActiveProvider(null)} className="border px-3 py-2 text-[11px]">{t("connections.actions.cancel")}</button><button type="button" disabled={saving || !apiKey.trim()} onClick={() => void saveProvider()} className="bg-terracotta px-3 py-2 text-[11px] font-semibold text-white">{saving ? t("connections.actions.saving") : t("connections.actions.connect")}</button></div></div></div>}
  </div></div>;
}

function ConnectionCard({ title, description, icon, connected, label, action, detail, onAction }: { title: string; description: string; icon: "shop" | "send" | "bot" | "sparkles"; connected: boolean; label: string; action: string; detail?: string; onAction: () => void }) { return <article className="flex min-h-[224px] flex-col rounded-[16px] border border-charcoal/[0.07] bg-white p-5 shadow-[0_14px_35px_rgba(51,51,51,0.035)]"><div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-[13px] bg-[#FFF1E9] text-terracotta"><Icon name={icon} size={20}/></span><Badge label={label} tone={connected ? "green" : "neutral"}/></div><h2 className="mt-5 text-[16px] font-semibold text-charcoal">{title}</h2><p className="mt-2 max-w-sm text-[11px] leading-5 text-charcoal/55">{description}</p>{detail && <p className="mt-3 text-[11px] font-semibold text-charcoal/55">{detail}</p>}<button type="button" onClick={onAction} className="mt-auto inline-flex h-9 w-fit items-center rounded-[10px] bg-terracotta px-3 text-[10px] font-semibold text-white">{action}</button></article>; }
