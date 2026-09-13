"use client";

import { useEffect, useState } from "react";
import { Copy, Upload } from "lucide-react";
import { getEtsyListing, getEtsyReadinessProfiles, getEtsyShippingProfiles } from "@/lib/api/etsy";
import type { EtsyDraftInput, EtsyListing, EtsyProfile } from "@/lib/api/types";

type DraftWorkflowProps = {
  mode: "manual" | "lucy" | "edit";
  title: string;
  t: (key: string) => string;
  onBack: () => void;
  onUpgrade?: () => void;
  listingId?: string | number;
  initialListing?: EtsyListing;
  detailUnavailableMessage?: string;
  onChangeListing?: () => void;
  changeListingLabel?: string;
};

export function DraftWorkflow({ mode, title, t, onBack, listingId, initialListing, detailUnavailableMessage, onChangeListing, changeListingLabel }: DraftWorkflowProps) {
  const [form, setForm] = useState<EtsyDraftInput>({ title: initialListing?.title ?? "", description: "", price: initialListing?.price == null ? undefined : Number(initialListing.price.amount), quantity: initialListing?.quantity ?? 1, type: "physical", whoMade: "i_did", whenMade: "made_to_order" });
  const [shippingProfiles, setShippingProfiles] = useState<EtsyProfile[]>([]);
  const [readinessProfiles, setReadinessProfiles] = useState<EtsyProfile[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [message, setMessage] = useState("");
  const [detailUnavailable, setDetailUnavailable] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    let active = true;
    void Promise.all([getEtsyShippingProfiles(), getEtsyReadinessProfiles()]).then(([shipping, readiness]) => {
      if (!active) return;
      setShippingProfiles(shipping.profiles);
      setReadinessProfiles(readiness.profiles);
    }).catch(() => undefined);
    if (mode !== "edit" || listingId == null) return () => { active = false; };
    void getEtsyListing(listingId).then((detail) => {
      if (!active) return;
      setForm((current) => ({ ...current, title: detail.title, description: detail.description ?? "", price: detail.price == null ? undefined : Number(detail.price.amount), quantity: detail.quantity ?? 1 }));
    }).catch(() => { if (active) setDetailUnavailable(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [listingId, mode]);

  function updateField<K extends keyof EtsyDraftInput>(key: K, value: EtsyDraftInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function prepareListing() {
    if (!form.title.trim()) return;
    setMessage(t("listings.workspace.preparedMessage"));
  }

  function addImage(file: File) {
    setImages((current) => [...current, file]);
    setMessage(t("listings.workspace.imageAdded"));
  }

  async function copyListing() {
    const content = [form.title, form.description ?? ""].filter(Boolean).join("\n\n");
    await navigator.clipboard.writeText(content);
    setMessage(t("listings.workspace.copiedMessage"));
  }

  if (loading) return <div className="mt-6 rounded-[20px] border border-charcoal/[0.07] bg-white p-8 text-sm text-charcoal/55">Loading listing...</div>;

  return <section className="mt-6">
    <div className="flex items-center justify-between gap-3"><div><h2 className="text-2xl font-semibold tracking-[-0.05em] text-charcoal">{title}</h2>{mode === "edit" && <p className="mt-1 text-[12px] text-charcoal/55">{form.title}</p>}</div><div className="flex items-center gap-3">{mode === "edit" && onChangeListing && <button type="button" onClick={onChangeListing} className="text-[10px] font-semibold text-terracotta">{changeListingLabel}</button>}<button type="button" onClick={onBack} className="text-[10px] font-semibold text-terracotta">{t("listings.workspace.back")}</button></div></div>
    <div className="mt-6 grid gap-5"><div className="rounded-[20px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-[11px] font-semibold text-charcoal/65">{t("listings.workspace.titleField")}<input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder={t("listings.workspace.titlePlaceholder")} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs font-normal outline-none focus:border-terracotta" /></label>
      <label className="block text-[11px] font-semibold text-charcoal/65">{t("listings.workspace.priceField")}<input type="number" value={form.price ?? ""} onChange={(event) => updateField("price", event.target.value ? Number(event.target.value) : undefined)} placeholder="$34.00" className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs font-normal outline-none focus:border-terracotta" /></label>
      <label className="text-[11px] font-semibold text-charcoal/65 sm:col-span-2">{t("listings.workspace.descriptionField")}<textarea value={form.description ?? ""} onChange={(event) => updateField("description", event.target.value)} rows={5} placeholder={t("listings.workspace.descriptionPlaceholder")} className="mt-1.5 w-full rounded-[10px] border border-charcoal/[0.1] p-3 text-xs outline-none focus:border-terracotta" /></label>
      <label className="block text-[11px] font-semibold text-charcoal/65">Type<select value={form.type} onChange={(event) => updateField("type", event.target.value as EtsyDraftInput["type"])} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs outline-none"><option value="physical">Physical</option><option value="download">Digital</option></select></label>
      <label className="block text-[11px] font-semibold text-charcoal/65">Who made<select value={form.whoMade} onChange={(event) => updateField("whoMade", event.target.value as EtsyDraftInput["whoMade"])} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs outline-none"><option value="i_did">I did</option><option value="someone_else">Someone else</option><option value="collective">A collective</option></select></label>
      <label className="block text-[11px] font-semibold text-charcoal/65">When made<select value={form.whenMade} onChange={(event) => updateField("whenMade", event.target.value as EtsyDraftInput["whenMade"])} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs outline-none"><option value="made_to_order">Made to order</option><option value="2020_2026">2020-2026</option><option value="2010_2019">2010-2019</option></select></label>
      {form.type === "physical" && <><label className="block text-[11px] font-semibold text-charcoal/65">Shipping profile<select value={form.shippingProfileId ?? ""} onChange={(event) => updateField("shippingProfileId", event.target.value || undefined)} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs outline-none"><option value="">Select a profile</option>{shippingProfiles.map((profile) => <option key={String(profile.id)} value={String(profile.id)}>{profile.name}</option>)}</select></label><label className="block text-[11px] font-semibold text-charcoal/65">Readiness profile<select value={form.readinessStateId ?? ""} onChange={(event) => updateField("readinessStateId", event.target.value || undefined)} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs outline-none"><option value="">Select a profile</option>{readinessProfiles.map((profile) => <option key={String(profile.id)} value={String(profile.id)}>{profile.name}</option>)}</select></label></>}
    </div><div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={prepareListing} className="rounded-[10px] bg-terracotta px-3 py-2 text-[10px] font-semibold text-white">{t("listings.workspace.prepareListing")}</button><button type="button" onClick={() => void copyListing()} className="inline-flex items-center gap-1.5 rounded-[10px] border border-charcoal/[0.1] px-3 py-2 text-[10px] font-semibold text-charcoal/65"><Copy size={13} />{t("listings.workspace.copyListing")}</button><label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-charcoal/[0.1] px-3 py-2 text-[10px] font-semibold text-charcoal/65"><Upload size={14} />Upload image<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) addImage(file); }} /></label></div>{images.length > 0 && <p className="mt-2 text-[10px] text-charcoal/50">{images.length} image{images.length === 1 ? "" : "s"} ready</p>}{detailUnavailable && <p className="mt-3 text-[11px] text-charcoal/55">{detailUnavailableMessage}</p>}{message && <p className="mt-3 text-[11px] text-charcoal/55">{message}</p>}<p className="mt-3 text-[11px] leading-5 text-charcoal/55">{t("listings.workspace.categoryManualHelper")}</p></div></div>
  </section>;
}
