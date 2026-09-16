"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenText, Plus, Search, Send, Sparkles, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getEtsyConnection, getEtsyListings, getLucyCredits, sendLucyChatMessage } from "@/lib/api/etsy";
import { ApiError, type EtsyListing, type LucyCreditStatus } from "@/lib/api/types";

type Context = "shop" | "listing" | "none";
type Message = { id: number; role: "user" | "lucy"; text: string };
const commands = [["chat.command.shop", "chat.command.shopPrompt", 1], ["chat.command.listing", "chat.command.listingPrompt", 3], ["chat.command.competitor", "chat.command.competitorPrompt", 8], ["chat.command.niches", "chat.command.nichesPrompt", 10], ["chat.command.keywords", "chat.command.keywordsPrompt", 1], ["chat.command.seoListing", "chat.command.seoListingPrompt", 2], ["chat.command.optimize", "chat.command.optimizePrompt", 2], ["chat.command.reviews", "chat.command.reviewsPrompt", 5], ["chat.command.strategy", "chat.command.strategyPrompt", 15], ["chat.command.deep", "chat.command.deepPrompt", 12]] as const;
const primaryCommands = commands.slice(0, 4);
const secondaryCommands = [commands[5], commands[4], commands[6]] as const;

export default function ChatPage() {
  const { t, locale } = useI18n();
  const [draft, setDraft] = useState("");
  const [context, setContext] = useState<Context>("shop");
  const [shopName, setShopName] = useState("");
  const [listing, setListing] = useState<EtsyListing | null>(null);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [listingOpen, setListingOpen] = useState(false);
  const [listingSearch, setListingSearch] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [credits, setCredits] = useState<LucyCreditStatus | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [commandsOpen, setCommandsOpen] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    void Promise.all([getEtsyConnection(), getLucyCredits()]).then(([connection, balance]) => {
      setShopName(connection.shopName || "");
      setCredits(balance);
    }).catch(() => undefined);
  }, []);

  async function openListings() {
    setListingOpen(true);
    if (listings.length) return;
    try { setListings((await getEtsyListings({ limit: 100, state: "active" })).listings); }
    catch { setError(t("chat.error.failed")); }
  }

  function commandAction(command: typeof commands[number]) {
    setDraft(t(command[1]));
    setCommandsOpen(false);
    if (command[0] === "chat.command.listing" || command[0] === "chat.command.optimize") {
      if (listing) setContext("listing"); else void openListings();
    }
  }

  function friendlyError(value: unknown) {
    const code = value instanceof ApiError ? value.code : value instanceof Error ? value.message : "";
    if (code.includes("insufficient_ai_credits")) return t("chat.error.insufficient");
    if (code.includes("ai_usage_temporarily_limited")) return t("chat.error.limited");
    if (code.includes("ai_rate_limited")) return t("chat.error.rateLimited");
    if (code.includes("ai_provider_unavailable")) return t("chat.error.providerUnavailable");
    return t("chat.error.failed");
  }

  async function send() {
    const message = draft.trim();
    if (!message || sending) return;
    setSending(true); setError(""); setDraft("");
    setMessages((current) => [...current, { id: nextId.current++, role: "user", text: message }]);
    try {
      const result = await sendLucyChatMessage({ message, language: locale, contextType: context, listingId: listing?.listingId == null ? undefined : String(listing.listingId) });
      setMessages((current) => [...current, { id: nextId.current++, role: "lucy", text: result.response }]);
      void getLucyCredits().then(setCredits).catch(() => undefined);
    } catch (requestError) { setDraft(message); setError(friendlyError(requestError)); }
    finally { setSending(false); }
  }

  function keyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); }
  }

  const filteredListings = listings.filter((item) => item.title.toLowerCase().includes(listingSearch.toLowerCase()));
  const contextLabel = context === "shop" ? shopName || t("chat.simple.noShop") : context === "listing" ? listing?.title || t("chat.simple.noListing") : t("chat.simple.noContext");

  return <main className="min-h-screen bg-[#F7F4F1] px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
    <div className="mx-auto max-w-[1120px]">
      <header className="flex flex-col justify-between gap-4 border-b border-[#333333]/8 pb-6 sm:flex-row sm:items-end">
        <div><h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#333333]">{t("chat.simple.title")}</h1><p className="mt-2 text-[12px] text-[#333333]/50">{t("chat.simple.subtitle")}</p></div>
        <div className="flex gap-2"><button type="button" onClick={() => { setMessages([]); setDraft(""); }} className="inline-flex h-9 items-center gap-2 rounded-[12px] bg-[#F74E03] px-3 text-[11px] font-semibold text-white"><Plus size={14}/>{t("chat.simple.new")}</button><button type="button" onClick={() => setCommandsOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-[12px] border border-[#333333]/8 bg-white px-3 text-[11px] font-semibold text-[#333333]/65"><BookOpenText size={14}/>{t("chat.commands.all")}</button></div>
      </header>

      <section className="mt-6 rounded-[22px] border border-[#333333]/7 bg-white shadow-[0_18px_50px_rgba(51,51,51,0.05)]">
        <div className="rounded-t-[22px] bg-[#FBFAF8] p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#333333]/40">{t("chat.context.title")}</p><div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E9] px-3 py-1.5 text-[11px] font-semibold text-[#F74E03]"><Sparkles size={13}/>{credits?.totalAvailable.toLocaleString() ?? "—"}</div></div><div className="mt-3 grid gap-3 sm:grid-cols-3"><ContextCard label={t("chat.context.shop")} value={shopName || t("chat.simple.noShop")} action={t("chat.context.change")} onClick={() => setContext("shop")}/><ContextCard label={t("chat.context.listing")} value={listing?.title || t("chat.simple.noListing")} action={listing ? t("chat.context.change") : t("chat.context.choose")} onClick={() => void openListings()} selected={Boolean(listing)}/><ContextCard label={t("chat.context.competitor")} value={t("chat.context.noCompetitor")} action={t("chat.context.add")} onClick={() => setDraft(t("chat.command.competitorPrompt"))}/></div></div>

        <div className="min-h-[310px] space-y-3 p-5 sm:p-8">{messages.length === 0 ? <div className="rounded-[24px] bg-[#FCFAF8] px-5 py-8 text-center"><div className="mx-auto grid size-11 place-items-center rounded-[15px] bg-[#FFF1E9] text-[#F74E03]"><Sparkles size={19}/></div><p className="mt-4 text-[17px] font-semibold text-[#333333]">{t("chat.empty.commandTitle")}</p><p className="mt-2 text-[12px] text-[#333333]/50">{t("chat.empty.description")}</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{primaryCommands.map((command) => <CommandButton key={command[0]} command={command} label={t(command[0])} onClick={() => commandAction(command)}/>)}</div></div> : messages.map((message) => <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[min(85%,620px)] rounded-[18px] px-4 py-3 text-[13px] leading-6 ${message.role === "user" ? "bg-[#F3EEE9] text-[#333333]" : "border border-[#F74E03]/10 bg-white text-[#333333]/75 shadow-[0_8px_24px_rgba(51,51,51,0.04)]"}`}>{message.role === "lucy" && <Sparkles size={14} className="mr-2 inline text-[#F74E03]"/>}{message.text}</div></div>)}{sending && <div className="w-fit rounded-[18px] bg-[#FCFAF8] px-4 py-3 text-[12px] text-[#333333]/50">{t("chat.simple.typing")}</div>}</div>

        <div className="border-t border-[#333333]/7 bg-[#FBFAF8] p-4 sm:p-5">{error && <div role="alert" className="mb-3 rounded-[12px] bg-[#FFF0EC] px-3 py-2 text-[11px] text-[#B34A35]">{error}</div>}<div className="mb-3 flex flex-wrap gap-2">{secondaryCommands.map((command) => <button key={command[0]} type="button" onClick={() => commandAction(command)} className="rounded-full border border-[#333333]/8 bg-white px-3 py-1.5 text-[10px] font-semibold text-[#333333]/60">{t(command[0])}</button>)}<button type="button" onClick={() => setCommandsOpen(true)} className="rounded-full border border-[#F74E03]/20 bg-[#FFF8F3] px-3 py-1.5 text-[10px] font-semibold text-[#F74E03]">{t("chat.commands.all")}</button></div><div className="flex items-end gap-2 rounded-[20px] border border-[#333333]/8 bg-white p-2 shadow-[0_8px_24px_rgba(51,51,51,0.04)]"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={keyDown} rows={1} placeholder={t("chat.simple.placeholder")} className="min-h-[42px] min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-[13px] outline-none"/><button type="button" disabled={!draft.trim() || sending} onClick={() => void send()} className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-[#F74E03] text-white shadow-[0_8px_18px_rgba(247,78,3,0.18)] disabled:bg-[#D9D4D0] disabled:shadow-none"><Send size={16}/></button></div><div className="mt-2 text-right text-[10px] text-[#333333]/35">{contextLabel}</div></div>
      </section>
    </div>

    {listingOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#333333]/30 p-4"><div className="w-full max-w-2xl rounded-[22px] bg-white p-5 shadow-[0_24px_70px_rgba(51,51,51,0.18)]"><div className="flex justify-between"><h2 className="text-lg font-semibold text-[#333333]">{t("chat.context.choose")}</h2><button type="button" onClick={() => setListingOpen(false)}><X size={17}/></button></div><div className="relative mt-4"><Search size={14} className="absolute left-3 top-3 text-[#333333]/35"/><input value={listingSearch} onChange={(event) => setListingSearch(event.target.value)} placeholder={t("chat.context.searchListings")} className="h-10 w-full rounded-[12px] border border-[#333333]/8 pl-9 text-sm"/></div><div className="mt-4 max-h-[55vh] space-y-2 overflow-y-auto">{filteredListings.map((item) => <button type="button" key={String(item.listingId)} onClick={() => { setListing(item); setContext("listing"); setListingOpen(false); }} className="flex w-full justify-between rounded-[14px] border border-[#333333]/8 p-3 text-left"><span><span className="block text-[12px] font-semibold">{item.title}</span><span className="text-[10px] text-[#333333]/45">{item.state} · {item.price?.amount ?? "—"}</span></span><span className="text-[10px] text-[#F74E03]">{t("chat.context.choose")}</span></button>)}</div></div></div>}
    {commandsOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#333333]/30 p-4"><div className="w-full max-w-lg rounded-[22px] bg-white p-5 shadow-[0_24px_70px_rgba(51,51,51,0.18)]"><div className="flex justify-between"><h2 className="text-lg font-semibold text-[#333333]">{t("chat.commands.all")}</h2><button type="button" onClick={() => setCommandsOpen(false)}><X size={17}/></button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{commands.map((command) => <button type="button" key={command[0]} onClick={() => commandAction(command)} className="rounded-[13px] border border-[#333333]/8 p-3 text-left text-[11px] font-semibold">{t(command[0])}<span className="mt-1 block text-[10px] font-normal text-[#333333]/45">{command[2]} AI credits</span></button>)}</div></div></div>}
  </main>;
}

function ContextCard({ label, value, action, onClick, selected = false }: { label: string; value: string; action: string; onClick: () => void; selected?: boolean }) { return <div className={`rounded-[18px] border p-3 ${selected ? "border-[#F74E03]/20 bg-[#FFF8F3]" : "border-[#333333]/7 bg-white"}`}><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#333333]/40">{label}</p><p className="mt-1 truncate text-[11px] font-semibold text-[#333333]">{value}</p><button type="button" onClick={onClick} className="mt-2 text-[10px] font-semibold text-[#F74E03]">{action}</button></div>; }
function CommandButton({ command, label, onClick }: { command: typeof commands[number]; label: string; onClick: () => void }) { return <button type="button" onClick={onClick} className="group flex items-center gap-3 rounded-[15px] border border-[#333333]/7 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#F74E03]/30 hover:shadow-[0_10px_26px_rgba(247,78,3,0.08)]"><span className="grid size-9 place-items-center rounded-[11px] bg-[#F7F4F1] text-[#F74E03] group-hover:bg-[#FFF1E9]"><Sparkles size={15}/></span><span className="min-w-0 flex-1 text-[11px] font-semibold text-[#333333]">{label}</span><span className="whitespace-nowrap text-[10px] text-[#333333]/40">{command[2]}</span></button>; }
