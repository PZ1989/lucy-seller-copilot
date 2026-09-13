"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown, FileSpreadsheet, Image as ImageIcon, LayoutGrid, List, Pencil, Plus, Search, Sparkles, Upload } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { useSubscription } from "@/lib/subscription";
import { getEtsyListings } from "@/lib/api/etsy";
import type { EtsyListing } from "@/lib/api/types";
import { DraftWorkflow } from "@/components/listings/DraftWorkflow";

const tabs = ["My Listings", "Drafts", "Active"];
const featureCards = [
  ["listings.workspace.manual", "listings.workspace.manualDesc", "plus", "manual"],
  ["listings.workspace.withLucy", "listings.workspace.withLucyDesc", "sparkles", "lucy"],
  ["listings.workspace.editExisting", "listings.workspace.editExistingDesc", "pencil", "edit"],
  ["listings.workspace.bulk", "listings.workspace.bulkDesc", "sheet", "bulk"],
] as const;

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return <label className="block text-[11px] font-semibold text-charcoal/65">{label}<input placeholder={placeholder} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs font-normal outline-none focus:border-terracotta" /></label>;
}

export default function ListingsPage() {
  const { t, locale } = useI18n();
  const selectionLabels = locale === "uk" ? { title: "Оберіть лістинг для редагування", search: "Пошук лістингів", all: "Усі", active: "Активні", draft: "Чернетки", loading: "Завантаження лістингів...", unavailable: "Лістинги зараз недоступні.", detailUnavailable: "Частина даних недоступна для автоматичного завантаження.", change: "Змінити лістинг" } : { title: "Select a listing to edit", search: "Search listings", all: "All", active: "Active", draft: "Drafts", loading: "Loading listings...", unavailable: "Listings are unavailable right now.", detailUnavailable: "Some listing details could not be loaded automatically.", change: "Change Listing" };
  const { etsyConnection } = useSession();
  const { paid, openPaywall } = useSubscription();
  const [activeTab, setActiveTab] = useState("My Listings");
  const [mode, setMode] = useState<"overview" | "manual" | "lucy" | "edit-select" | "edit" | "bulk" | "planned">("overview");
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedListingId, setSelectedListingId] = useState<string | number>();
  const [liveListings, setLiveListings] = useState<EtsyListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState(false);
  const connected = Boolean(etsyConnection?.connected && etsyConnection.connectionHealth !== "expired");
  const listingStatusLabel = listingsLoading ? "Loading listings..." : listingsError ? "Unable to load listings." : connected ? t("listings.workspace.liveConnection") : t("listings.workspace.noConnection");
  const displayTabs = [t("listings.workspace.my"), t("listings.workspace.drafts"), t("listings.workspace.active")];
  const listingState = activeTab === "Drafts" ? "draft" : "active";
  const displayListings = liveListings.filter((listing) => activeTab === "My Listings" || listing.state.toLowerCase() === listingState).map((listing) => ({ id: listing.listingId, title: listing.title, status: listing.state, price: listing.price ? `${listing.price.amount} ${listing.price.currency ?? ""}` : "—", views: listing.views == null ? "—" : String(listing.views), favorites: listing.favorites == null ? "—" : String(listing.favorites), updated: listing.updatedAt ? new Intl.DateTimeFormat().format(new Date(listing.updatedAt)) : "—" }));

  useEffect(() => {
    if (!connected) { setLiveListings([]); return; }
    let live = true;
    setListingsLoading(true); setListingsError(false);
    void getEtsyListings({ limit: 100, state: listingState }).then((response) => { if (live) setLiveListings(response.listings); }).catch(() => { if (live) { setLiveListings([]); setListingsError(true); } }).finally(() => { if (live) setListingsLoading(false); });
    return () => { live = false; };
  }, [connected, listingState]);

  useEffect(() => {
    if (mode !== "overview" || !connected) return;
    const rows = document.querySelectorAll<HTMLTableRowElement>("table tbody tr");
    const cleanups: Array<() => void> = [];
    rows.forEach((row, index) => {
      const listingId = displayListings[index]?.id;
      if (listingId == null) return;
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      row.classList.add("cursor-pointer", "outline-none", "transition-colors", "hover:bg-[#FFF8F3]", "focus-visible:bg-[#FFF8F3]", "focus-visible:ring-2", "focus-visible:ring-inset", "focus-visible:ring-terracotta/40");
      const open = () => selectListing(listingId);
      const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } };
      row.addEventListener("click", open);
      row.addEventListener("keydown", onKeyDown);
      cleanups.push(() => { row.removeEventListener("click", open); row.removeEventListener("keydown", onKeyDown); });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [connected, displayListings, mode]);

  function choose(modeName: typeof mode, listingId?: string | number) {
    if ((modeName === "edit" || modeName === "edit-select") && !connected) return;
    setSelectedListingId(listingId);
    setMode(modeName === "edit" ? "edit-select" : modeName);
  }

  function selectListing(listingId: string | number) {
    setSelectedListingId(listingId);
    setMode("edit");
  }

  return <div className="min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1480px]">
    <header className="border-b border-charcoal/[0.08] pb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">Lucy Seller Copilot</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-charcoal">{t("listings.workspace.title")}</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-charcoal/55">{t("listings.workspace.subtitle")}</p></header>

    {mode === "overview" ? <>
      <section className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">{featureCards.map(([titleKey, descriptionKey, icon, target]) => <button key={titleKey} type="button" onClick={() => choose(target as typeof mode)} className={`flex min-h-[190px] flex-col rounded-[18px] border p-5 text-left transition hover:-translate-y-0.5 hover:border-terracotta/25 hover:shadow-[0_12px_28px_rgba(51,51,51,0.05)] ${target === "lucy" ? "border-terracotta/20 bg-[#FFF8F3]" : "border-charcoal/[0.07] bg-white"}`}><span className="grid size-10 place-items-center rounded-[11px] bg-linen/45 text-terracotta">{icon === "plus" ? <Plus size={18} /> : icon === "sparkles" ? <Sparkles size={18} /> : icon === "pencil" ? <Pencil size={18} /> : <FileSpreadsheet size={18} />}</span><h2 className="mt-5 text-[17px] font-semibold text-charcoal">{t(titleKey)}</h2><p className="mt-2 text-[14px] leading-5 text-charcoal/55">{t(descriptionKey)}</p><span className="mt-auto pt-5 text-[13px] font-semibold text-terracotta">{t("listings.workspace.openFlow")}</span></button>)}</section>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><div className="inline-flex overflow-hidden rounded-[11px] border border-charcoal/[0.1] bg-white">{displayTabs.map((tab, index) => <button key={tab} type="button" onClick={() => { setActiveTab(tabs[index]); if (tabs[index] === "Planned") setMode("planned"); }} className={`px-3.5 py-2.5 text-[10px] font-semibold ${activeTab === tabs[index] ? "bg-charcoal text-white" : "text-charcoal/45 hover:text-charcoal"}`}>{tab}</button>)}</div><div className="flex items-center gap-2"><div className="relative"><Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" /><input placeholder={t("listings.workspace.search")} className="h-9 w-48 rounded-[10px] border border-charcoal/[0.1] bg-white pl-9 pr-3 text-[10px] outline-none focus:border-terracotta" /></div><button type="button" className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-[10px] font-semibold text-charcoal/55"><ChevronDown size={13} />{t("listings.workspace.filter")}</button><button type="button" onClick={() => setView(view === "list" ? "grid" : "list")} className="grid size-9 place-items-center rounded-[10px] border border-charcoal/[0.1] bg-white text-charcoal/50" aria-label="Toggle view">{view === "list" ? <LayoutGrid size={14} /> : <List size={14} />}</button></div></div>
      <section className="mt-4 overflow-hidden rounded-[18px] border border-charcoal/[0.07] bg-white shadow-[0_14px_35px_rgba(51,51,51,0.03)]"><div className="flex items-center justify-between border-b border-charcoal/[0.07] px-4 py-3"><div><h2 className="text-[14px] font-semibold text-charcoal">{t("listings.workspace.myListings")}</h2></div><span className="text-[10px] text-charcoal/40">{listingStatusLabel}</span></div>{connected ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-charcoal/[0.06] text-[9px] uppercase tracking-[0.08em] text-charcoal/35"><th className="px-4 py-3">{t("listings.workspace.product")}</th><th>{t("listings.workspace.status")}</th><th>{t("listings.workspace.price")}</th><th>{t("listings.workspace.views")}</th><th>{t("listings.workspace.favorites")}</th><th>{t("listings.workspace.updated")}</th><th /></tr></thead><tbody>{displayListings.map((listing) => <tr key={listing.title} className="border-b border-charcoal/[0.06] last:border-0"><td className="px-4 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[11px] bg-linen/45 text-charcoal/40"><ImageIcon size={16} /></span><span className="text-[11px] font-semibold text-charcoal">{listing.title}</span></div></td><td><span className="rounded-full bg-mist/20 px-2.5 py-1 text-[9px] font-semibold text-charcoal/55">{listing.status}</span></td><td className="text-[11px] text-charcoal/60">{listing.price}</td><td className="text-[11px] text-charcoal/45">{listing.views}</td><td className="text-[11px] text-charcoal/45">{listing.favorites}</td><td className="text-[10px] text-charcoal/40">{listing.updated}</td><td /></tr>)}</tbody></table></div> : <div className="p-8 text-center"><div className="mx-auto grid size-11 place-items-center rounded-2xl bg-linen/45 text-charcoal/35"><Search size={18} /></div><h3 className="mt-3 text-sm font-semibold text-charcoal">{connected ? t("listings.workspace.noListings") : t("listings.workspace.connectToView")}</h3><p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-charcoal/45">{connected ? t("listings.workspace.noListingsDesc") : t("listings.workspace.connectToViewDesc")}</p>{!connected && <button type="button" onClick={openPaywall} className="mt-4 rounded-[10px] bg-terracotta px-3 py-2 text-[10px] font-semibold text-white">{t("listings.workspace.connectEtsy")}</button>}</div>}</section>
    </> : mode === "edit-select" ? <ListingSelection listings={liveListings} loading={listingsLoading} error={listingsError} t={t} labels={selectionLabels} onBack={() => setMode("overview")} onSelect={selectListing} /> : mode === "bulk" || mode === "planned" ? <Workflow mode={mode} onBack={() => setMode("overview")} t={t} onUpgrade={!paid ? openPaywall : undefined} /> : <DraftWorkflow mode={mode} listingId={selectedListingId} initialListing={liveListings.find((listing) => listing.listingId === selectedListingId)} detailUnavailableMessage={selectionLabels.detailUnavailable} changeListingLabel={selectionLabels.change} onChangeListing={() => setMode("edit-select")} title={{ manual: t("listings.workspace.manualTitle"), lucy: t("listings.workspace.lucyTitle"), edit: t("listings.workspace.editTitle") }[mode]} onBack={() => setMode(mode === "edit" ? "edit-select" : "overview")} t={t} onUpgrade={!paid ? openPaywall : undefined} />}
    <p className="mt-6 text-[10px] leading-5 text-charcoal/42">{t("listings.workspace.draftOnly")}</p>
  </div></div>;
}

function ListingSelection({ listings, loading, error, t, labels, onBack, onSelect }: { listings: EtsyListing[]; loading: boolean; error: boolean; t: (key: string) => string; labels: { title: string; search: string; all: string; active: string; draft: string; loading: string; unavailable: string }; onBack: () => void; onSelect: (listingId: string | number) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const statuses = Array.from(new Set(listings.map((listing) => listing.state.toLowerCase()))).filter((value) => value === "active" || value === "draft");
  const filtered = listings.filter((listing) => (status === "all" || listing.state.toLowerCase() === status) && listing.title.toLowerCase().includes(search.toLowerCase()));
  const statusLabels: Record<string, string> = { all: labels.all, active: labels.active, draft: labels.draft };

  return <section className="mt-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-2xl font-semibold tracking-[-0.05em] text-charcoal">{labels.title}</h2></div><button type="button" onClick={onBack} className="text-[10px] font-semibold text-terracotta">{t("listings.workspace.back")}</button></div><div className="mt-5 rounded-[18px] border border-charcoal/[0.07] bg-white p-4"><div className="relative"><Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={labels.search} className="h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-[#FCFAF8] pl-9 pr-3 text-xs outline-none focus:border-terracotta" /></div><div className="mt-3 flex flex-wrap gap-1.5"><button type="button" onClick={() => setStatus("all")} className={`rounded-[9px] px-3 py-2 text-[10px] font-semibold ${status === "all" ? "bg-charcoal text-white" : "border border-charcoal/[0.1] text-charcoal/55"}`}>{statusLabels.all}</button>{statuses.map((item) => <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded-[9px] px-3 py-2 text-[10px] font-semibold ${status === item ? "bg-charcoal text-white" : "border border-charcoal/[0.1] text-charcoal/55"}`}>{statusLabels[item]}</button>)}</div></div>{loading ? <p className="mt-5 text-sm text-charcoal/50">{labels.loading}</p> : error ? <p className="mt-5 text-sm text-charcoal/50">{labels.unavailable}</p> : filtered.length === 0 ? <p className="mt-5 text-sm text-charcoal/50">{t("listings.workspace.noListings")}</p> : <div className="mt-5 grid gap-3 md:grid-cols-2">{filtered.map((listing) => <button key={String(listing.listingId)} type="button" onClick={() => onSelect(listing.listingId)} className="flex gap-3 rounded-[14px] border border-charcoal/[0.08] bg-white p-3 text-left transition hover:border-terracotta/30 hover:shadow-[0_8px_24px_rgba(51,51,51,0.05)]"><span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-linen/45 text-charcoal/35">{listing.thumbnailUrl ? <Image src={listing.thumbnailUrl} alt="" width={64} height={64} unoptimized className="size-full object-cover" /> : <ImageIcon size={18} />}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[12px] font-semibold text-charcoal">{listing.title}</strong><span className="mt-1 block text-[10px] text-charcoal/50">{listing.state} · {listing.price ? `${listing.price.amount} ${listing.price.currency ?? ""}` : "—"}</span><span className="mt-1 block text-[10px] text-charcoal/45">{t("listings.workspace.views")}: {listing.views ?? "—"} · {t("listings.workspace.favorites")}: {listing.favorites ?? "—"}</span>{listing.updatedAt && <span className="mt-1 block text-[10px] text-charcoal/40">{new Intl.DateTimeFormat().format(new Date(listing.updatedAt))}</span>}</span></button>)}</div>}</section>;
}

function Workflow({ mode, onBack, t, onUpgrade }: { mode: "manual" | "lucy" | "edit" | "bulk" | "planned"; onBack: () => void; t: (key: string) => string; onUpgrade?: () => void }) {
  const titles = { manual: t("listings.workspace.manualTitle"), lucy: t("listings.workspace.lucyTitle"), edit: t("listings.workspace.editTitle"), bulk: t("listings.workspace.bulkTitle"), planned: t("listings.workspace.plannedTitle") };
  return <section className="mt-6"><div className="flex items-center justify-between gap-3"><div><h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-charcoal">{titles[mode]}</h2></div><button type="button" onClick={onBack} className="text-[10px] font-semibold text-terracotta">{t("listings.workspace.back")}</button></div>{mode === "planned" ? <PlannedView t={t} /> : mode === "bulk" ? <BulkView t={t} /> : <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_300px]"><div className="rounded-[20px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label={t("listings.workspace.titleField")} placeholder={t("listings.workspace.titlePlaceholder")} /><Field label={t("listings.workspace.priceField")} placeholder="$34.00" /><label className="text-[11px] font-semibold text-charcoal/65 sm:col-span-2">{t("listings.workspace.descriptionField")}<textarea rows={5} placeholder={t("listings.workspace.descriptionPlaceholder")} className="mt-1.5 w-full rounded-[10px] border border-charcoal/[0.1] p-3 text-xs outline-none focus:border-terracotta" /></label><Field label={t("listings.workspace.tagsField")} placeholder={t("listings.workspace.tagsPlaceholder")} /><Field label={t("listings.workspace.quantityField")} placeholder="10" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[t("listings.workspace.stepBasic"), t("listings.workspace.stepDetails"), t("listings.workspace.stepShipping"), t("listings.workspace.stepImages"), t("listings.workspace.stepPreview")].map((step, index) => <div key={step} className={`rounded-[12px] border p-3 text-[10px] font-semibold ${index === 0 ? "border-terracotta/25 bg-[#FFF8F3] text-terracotta" : "border-charcoal/[0.08] text-charcoal/50"}`}><span className="mr-2 text-charcoal/30">0{index + 1}</span>{step}</div>)}</div><div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={onUpgrade} className="rounded-[11px] bg-terracotta px-4 py-2.5 text-[10px] font-semibold text-white">{t("listings.workspace.prepareListing")}</button><button type="button" className="rounded-[11px] border border-charcoal/[0.1] px-4 py-2.5 text-[10px] font-semibold text-charcoal/60"><Upload size={13} className="mr-1 inline" />{t("listings.workspace.uploadPhotos")}</button></div><p className="mt-3 text-[11px] leading-5 text-charcoal/55">{t("listings.workspace.categoryManualHelper")}</p></div><aside className="rounded-[20px] border border-charcoal/[0.07] bg-[#FCFAF8] p-5"><h3 className="text-sm font-semibold text-charcoal">{mode === "lucy" ? t("listings.workspace.seoPreview") : t("listings.workspace.images")}</h3><div className="mt-4 space-y-2">{(mode === "lucy" ? ["SEO Title", "Description", "13 Tags", "Keywords", "Materials"] : ["Upload Photos", "Generate Images", "Use Image Template", "Reorder Images", "Review Images"]).map((item) => <div key={item} className="flex items-center gap-2 rounded-xl border border-charcoal/[0.08] bg-white px-3 py-3 text-[10px] text-charcoal/60"><Check size={13} className="text-[#2D8158]" />{item}</div>)}</div><Link href="/image-studio" className="mt-4 inline-flex text-[10px] font-semibold text-terracotta">{t("listings.workspace.openImageStudio")}</Link></aside></div>}</section>;
}

function BulkView({ t }: { t: (key: string) => string }) {
  return <div className="mt-6 rounded-[20px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"><div className="flex flex-wrap gap-2"><button type="button" className="rounded-[10px] border border-charcoal/[0.1] px-3 py-2 text-[10px] font-semibold text-charcoal/65"><FileSpreadsheet size={14} className="mr-1 inline" />{t("listings.workspace.downloadTemplate")}</button><button type="button" disabled className="rounded-[10px] bg-terracotta px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-50">{t("listings.workspace.prepareMultiple")}</button></div><p className="mt-5 text-[11px] leading-5 text-charcoal/55">{t("listings.workspace.bulkUnavailable")}</p></div>;
}

function PlannedView({ t }: { t: (key: string) => string }) {
  return <div className="mt-6 rounded-[20px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"><div className="rounded-[14px] border border-terracotta/15 bg-[#FFF8F3] p-4 text-[11px] leading-5 text-charcoal/62">{t("listings.workspace.draftOnly")}</div><div className="mt-5 rounded-[14px] border border-charcoal/[0.08] bg-[#FCFAF8] p-8 text-center text-[11px] text-charcoal/45">{t("listings.workspace.planningEmpty")}</div></div>;
}
