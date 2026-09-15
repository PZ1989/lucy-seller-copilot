"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Sparkles, Trash2 } from "lucide-react";
import { createEtsyDraft, generateLucyListing, getEtsyListing, getEtsyReadinessProfiles, getEtsyShippingProfiles, optimizeLucyListing, searchEtsyTaxonomy, updateEtsyDraft, uploadEtsyDraftImage } from "@/lib/api/etsy";
import type { EtsyDraftInput, EtsyListing, EtsyProfile } from "@/lib/api/types";

type ImageItem = { id: string; file: File; url: string };
type Props = { mode: "manual" | "lucy" | "edit"; title: string; t: (key: string) => string; language?: "uk" | "en"; onBack: () => void; listingId?: string | number; initialListing?: EtsyListing; detailUnavailableMessage?: string; onUpgrade?: () => void; onChangeListing?: () => void; changeListingLabel?: string };
type Optimization = { improvedTitle: string; improvedDescription: string; improvedTags: string[]; improvedMaterials?: string[]; recommendations: string[] };
const stepKeys = ["basic", "seo", "images", "fulfillment", "category", "review"];

export function DraftWorkflow({ mode, title, t, language = "en", onBack, listingId, initialListing, onChangeListing, changeListingLabel }: Props) {
  const [form, setForm] = useState<EtsyDraftInput>({ title: initialListing?.title ?? "", description: "", price: initialListing?.price?.amount, quantity: initialListing?.quantity ?? 1, type: "physical", whoMade: "i_did", whenMade: "made_to_order", tags: [], materials: [] });
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<EtsyProfile[]>([]);
  const [readiness, setReadiness] = useState<EtsyProfile[]>([]);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Array<{ taxonomyId: string | number; name: string; path: string }>>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [optimization, setOptimization] = useState<Optimization | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([getEtsyShippingProfiles(), getEtsyReadinessProfiles(language)]).then(([a, b]) => { if (active) { setShipping(a.profiles); setReadiness(b.profiles); } }).catch(() => undefined);
    if (mode !== "edit" || listingId == null) { setLoading(false); return () => { active = false; }; }
    void getEtsyListing(listingId).then((detail) => {
      if (!active) return;
      setForm((current) => ({ ...current, title: detail.title, description: detail.description ?? "", price: detail.price?.amount, quantity: detail.quantity ?? 1, tags: detail.tags ?? [], materials: detail.materials ?? [], taxonomyId: detail.taxonomyId ?? undefined }));
      setImages((detail.images ?? []).map((image, index) => ({ id: `remote-${index}`, file: new File([], "listing-image"), url: image.url })));
    }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [language, listingId, mode]);

  function update<K extends keyof EtsyDraftInput>(key: K, value: EtsyDraftInput[K]) { setForm((current) => ({ ...current, [key]: value })); setError(""); }
  function updateList(key: "tags" | "materials", value: string) { update(key, value.split(",").map((item) => item.trim()).filter(Boolean)); }
  function addImages(event: React.ChangeEvent<HTMLInputElement>) { const files = Array.from(event.target.files ?? []); setImages((current) => [...current, ...files.map((file) => ({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file) }))]); event.target.value = ""; }
  function removeImage(id: string) { setImages((current) => current.filter((image) => image.id !== id)); }
  function moveImage(index: number, direction: -1 | 1) { setImages((current) => { const next = [...current]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; }); }
  async function findCategory(value: string) { setQuery(value); if (value.trim().length < 2) { setCategories([]); return; } try { setCategories((await searchEtsyTaxonomy(value)).map((item) => ({ ...item, path: Array.isArray(item.path) ? item.path.join(" / ") : item.path }))); } catch { setCategories([]); } }
  async function generate() {
    if (prompt.trim().length < 10) { setError(t("listings.validation.prompt")); return; }
    setGenerating(true); setError("");
    try {
      const result = await generateLucyListing(prompt, language, form.type === "download" ? "download" : "physical");
      setForm((current) => ({ ...current, title: result.title, description: result.description, tags: result.tags, materials: result.materials, price: result.suggestedPrice ?? current.price, quantity: result.quantity, whoMade: result.whoMade, whenMade: result.whenMade, type: result.productType }));
      setSuggestion(typeof result.categorySuggestion === "string" ? result.categorySuggestion : null);
      setGenerated(true);
    } catch { setError(t("listings.generation.error")); } finally { setGenerating(false); }
  }
  async function optimize() {
    if (!form.title?.trim() || !form.description?.trim()) { setError(t("listings.validation.optimizeContent")); return; }
    setOptimizing(true); setError("");
    try { setOptimization(await optimizeLucyListing({ title: form.title, description: form.description, tags: form.tags ?? [], materials: form.materials ?? [], productType: form.type === "download" ? "digital" : "physical", language })); } catch { setError(t("listings.generation.error")); } finally { setOptimizing(false); }
  }
  function stepError(index: number) {
    if (index === 0) {
      if (!form.title?.trim()) return t("listings.validation.title");
      if (!form.description?.trim()) return t("listings.validation.description");
      if (!Number.isFinite(form.price) || Number(form.price) <= 0) return t("listings.validation.price");
      if (!Number.isInteger(form.quantity) || Number(form.quantity) <= 0) return t("listings.validation.quantity");
    }
    if (index === 3 && form.type === "physical" && (!form.shippingProfileId || !form.readinessStateId)) return t("listings.validation.shipping");
    if (index === 4 && !form.taxonomyId) return t("listings.validation.category");
    return "";
  }
  function go(next: number) { if (next > step) { for (let index = step; index < next; index += 1) { const issue = stepError(index); if (issue) { setError(issue); setStep(index); return; } } } setError(""); setStep(Math.max(0, Math.min(5, next))); }
  async function save() {
    const issue = [0, 3, 4].map(stepError).find(Boolean);
    if (issue) { setError(issue); return; }
    setSaving(true); setError("");
    try {
      const result = mode === "edit" && initialListing?.state.toLowerCase() === "draft" && listingId != null ? await updateEtsyDraft(listingId, form) : await createEtsyDraft(form);
      const createdId = result.listingId;
      if (createdId != null) {
        for (const [index, image] of images.entries()) {
          if (image.file.size > 0) await uploadEtsyDraftImage(createdId, image.file);
          if (index === 0) setMessage(t("listings.images.mainSelected"));
        }
      }
      setMessage("updated" in result ? t("listings.draft.updated") : t("listings.draft.created"));
    } catch { setError(t("listings.draft.error")); } finally { setSaving(false); }
  }

  if (loading) return <div className="mt-6 rounded-[20px] border border-charcoal/[0.07] bg-white p-8 text-sm text-charcoal/55">{t("listings.loading")}</div>;
  if (mode === "lucy" && !generated) return <LucyStart t={t} prompt={prompt} setPrompt={setPrompt} generating={generating} error={error} onBack={onBack} onGenerate={() => void generate()} />;
  const completed = stepKeys.map((_, index) => index < step && !stepError(index));
  const applyOptimization = () => { if (!optimization) return; setForm((current) => ({ ...current, title: optimization.improvedTitle, description: optimization.improvedDescription, tags: optimization.improvedTags, materials: optimization.improvedMaterials ?? current.materials })); setOptimization(null); };
  return <section className="mt-6">
    <header className="flex items-center justify-between gap-3"><h2 className="text-2xl font-semibold tracking-[-0.05em] text-charcoal">{title}</h2><div className="flex gap-3">{mode === "edit" && onChangeListing && <button type="button" onClick={onChangeListing} className="text-[10px] font-semibold text-terracotta">{changeListingLabel}</button>}<button type="button" onClick={onBack} className="text-[10px] font-semibold text-terracotta">{t("listings.workspace.back")}</button></div></header>
    <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">{stepKeys.map((key, index) => <button key={key} type="button" onClick={() => go(index)} className={`shrink-0 rounded-[9px] px-3 py-2 text-[10px] font-semibold ${index === step ? "bg-terracotta text-white" : completed[index] ? "bg-[#F3E9DF] text-terracotta" : "bg-[#FCFAF8] text-charcoal/50"}`}>{index + 1}. {t(`listings.steps.${key}`)}</button>)}</nav>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px]"><main className="rounded-[20px] border border-charcoal/[0.07] bg-white p-5 sm:p-6">
      {step === 0 && <Basic form={form} t={t} update={update}/>} {step === 1 && <Seo form={form} t={t} updateList={updateList} onOptimize={() => void optimize()} optimizing={optimizing} optimization={optimization} onApply={applyOptimization}/>} {step === 2 && <Images images={images} t={t} add={addImages} remove={removeImage} move={moveImage}/>} {step === 3 && <Fulfillment form={form} t={t} shipping={shipping} readiness={readiness} update={update}/>} {step === 4 && <Category form={form} t={t} query={query} results={categories} suggestion={suggestion} find={findCategory} update={update}/>} {step === 5 && <Review form={form} images={images} t={t}/>} 
      {error && <p role="alert" className="mt-4 text-[11px] text-[#B34A35]">{error}</p>}{message && <p role="status" className="mt-4 text-[11px] text-[#2B7655]">{message}</p>}
      <footer className="mt-6 flex flex-wrap justify-between gap-2 border-t border-charcoal/[0.07] pt-4"><button type="button" onClick={() => step === 0 ? onBack() : go(step - 1)} className="inline-flex items-center gap-1.5 rounded-[10px] border border-charcoal/[0.1] px-3 py-2 text-[11px] font-semibold text-charcoal/60"><ArrowLeft size={14}/>{t("listings.workspace.back")}</button>{step < 5 ? <button type="button" onClick={() => go(step + 1)} className="inline-flex items-center gap-1.5 rounded-[10px] bg-terracotta px-4 py-2 text-[11px] font-semibold text-white">{t("listings.wizard.next")}<ArrowRight size={14}/></button> : <div className="flex gap-2"><button type="button" onClick={() => void save()} disabled={saving} className="rounded-[10px] border border-charcoal/[0.1] px-3 py-2 text-[11px] font-semibold text-charcoal/65">{t("listings.wizard.saveLucy")}</button><button type="button" onClick={() => void save()} disabled={saving} className="rounded-[10px] bg-terracotta px-4 py-2 text-[11px] font-semibold text-white">{t("listings.wizard.createDraft")}</button></div>}</footer>
    </main><aside className="rounded-[16px] border border-charcoal/[0.07] bg-[#FCFAF8] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/40">{t("listings.wizard.summary")}</p><p className="mt-3 text-[12px] font-semibold text-charcoal">{form.title || t("listings.validation.title")}</p><p className="mt-2 text-[11px] text-charcoal/55">{form.tags?.length ?? 0}/13 {t("listings.fields.tags")} · {images.length} {t("listings.fields.images")}</p><p className="mt-2 text-[11px] text-charcoal/55">{form.taxonomyId ? t("listings.wizard.categorySelected") : t("listings.validation.category")}</p></aside></div>
  </section>;
}

function LucyStart({ t, prompt, setPrompt, generating, error, onBack, onGenerate }: { t: (key: string) => string; prompt: string; setPrompt: (value: string) => void; generating: boolean; error: string; onBack: () => void; onGenerate: () => void }) { return <section className="mt-6 rounded-[20px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold text-charcoal">{t("listings.lucy.title")}</h2><button type="button" onClick={onBack} className="text-[10px] font-semibold text-terracotta">{t("listings.workspace.back")}</button></div><p className="mt-2 text-[13px] text-charcoal/55">{t("listings.lucy.description")}</p><label className="mt-5 block text-[11px] font-semibold text-charcoal/65">{t("listings.lucy.promptLabel")}<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} placeholder={t("listings.lucy.placeholder")} className="mt-1.5 w-full rounded-[12px] border border-charcoal/[0.1] p-3 text-[13px] font-normal"/></label><button type="button" disabled={generating} onClick={onGenerate} className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-terracotta px-4 py-2.5 text-[11px] font-semibold text-white"><Sparkles size={14}/>{generating ? t("listings.generation.generating") : t("listings.lucy.generate")}</button>{error && <p role="alert" className="mt-3 text-[11px] text-[#B34A35]">{error}</p>}</section>; }
function Basic({ form, t, update }: { form: EtsyDraftInput; t: (key: string) => string; update: <K extends keyof EtsyDraftInput>(key: K, value: EtsyDraftInput[K]) => void }) { return <div className="grid gap-4 sm:grid-cols-2"><Input label={t("listings.workspace.titleField")} value={form.title} onChange={(value) => update("title", value)} wide/><label className="block text-[11px] font-semibold text-charcoal/65 sm:col-span-2">{t("listings.workspace.descriptionField")}<textarea value={form.description ?? ""} onChange={(event) => update("description", event.target.value)} rows={6} className="mt-1.5 w-full rounded-[10px] border border-charcoal/[0.1] p-3 text-xs"/></label><Input label={t("listings.fields.price")} type="number" value={form.price ?? ""} onChange={(value) => update("price", value ? Number(value) : undefined)}/><Input label={t("listings.fields.quantity")} type="number" value={form.quantity ?? ""} onChange={(value) => update("quantity", value ? Number(value) : undefined)}/><Select label={t("listings.fields.type")} value={form.type ?? "physical"} onChange={(value) => update("type", value as EtsyDraftInput["type"])} options={[["physical", t("listings.options.physical")], ["download", t("listings.options.digital")]]}/><Select label={t("listings.fields.whoMade")} value={form.whoMade ?? "i_did"} onChange={(value) => update("whoMade", value as EtsyDraftInput["whoMade"])} options={[["i_did", t("listings.options.iDid")], ["someone_else", t("listings.options.someoneElse")], ["collective", t("listings.options.collective")]]}/><Select label={t("listings.fields.whenMade")} value={form.whenMade ?? "made_to_order"} onChange={(value) => update("whenMade", value as EtsyDraftInput["whenMade"])} options={[["made_to_order", t("listings.options.madeToOrder")], ["2020_2026", "2020–2026"], ["before_2007", "Before 2007"]]}/></div>; }
function Seo({ form, t, updateList, onOptimize, optimizing, optimization, onApply }: { form: EtsyDraftInput; t: (key: string) => string; updateList: (key: "tags" | "materials", value: string) => void; onOptimize: () => void; optimizing: boolean; optimization: Optimization | null; onApply: () => void }) { return <div className="space-y-4"><Input label={t("listings.fields.tags")} value={(form.tags ?? []).join(", ")} onChange={(value) => updateList("tags", value)} wide/><Input label={t("listings.fields.materials")} value={(form.materials ?? []).join(", ")} onChange={(value) => updateList("materials", value)} wide/><button type="button" onClick={onOptimize} disabled={optimizing} className="inline-flex items-center gap-2 rounded-[10px] bg-charcoal px-3 py-2 text-[11px] font-semibold text-white"><Sparkles size={14}/>{optimizing ? t("listings.lucy.optimizing") : t("listings.lucy.improveSeo")}</button>{optimization && <div className="rounded-[12px] bg-[#FFF8F3] p-3 text-[11px] text-charcoal/65"><p>{optimization.recommendations.join(" ")}</p><button type="button" onClick={onApply} className="mt-3 font-semibold text-terracotta">{t("listings.lucy.applyChanges")}</button></div>}</div>; }
function Images({ images, t, add, remove, move }: { images: ImageItem[]; t: (key: string) => string; add: (event: React.ChangeEvent<HTMLInputElement>) => void; remove: (id: string) => void; move: (index: number, direction: -1 | 1) => void }) { return <div><label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-charcoal/[0.15] bg-[#FCFAF8] text-[11px] text-charcoal/55"><ImagePlus size={20} className="mb-2 text-terracotta"/>{t("listings.actions.addImages")}<input type="file" accept="image/*" multiple onChange={add} className="sr-only"/></label><div className="mt-4 grid gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={image.id} className="overflow-hidden rounded-[12px] border border-charcoal/[0.08] bg-white"><img src={image.url} alt="" className="aspect-square w-full object-cover"/><div className="flex justify-between p-2"><button type="button" onClick={() => move(index, -1)} aria-label="Move image left">←</button><button type="button" onClick={() => move(index, 1)} aria-label="Move image right">→</button><button type="button" onClick={() => remove(image.id)} aria-label={t("listings.actions.removeImage")}><Trash2 size={13}/></button></div></div>)}</div></div>; }
function Fulfillment({ form, t, shipping, readiness, update }: { form: EtsyDraftInput; t: (key: string) => string; shipping: EtsyProfile[]; readiness: EtsyProfile[]; update: <K extends keyof EtsyDraftInput>(key: K, value: EtsyDraftInput[K]) => void }) { if (form.type !== "physical") return <p className="rounded-[12px] bg-[#FCFAF8] p-4 text-[12px] text-charcoal/55">{t("listings.digital.fulfillmentNote")}</p>; return <div className="grid gap-4"><Select label={t("listings.fields.shipping")} value={String(form.shippingProfileId ?? "")} onChange={(value) => update("shippingProfileId", value)} options={[["", t("listings.options.chooseProfile")], ...shipping.map((item) => [String(item.id), item.name])]}/><Select label={t("listings.fields.readiness")} value={String(form.readinessStateId ?? "")} onChange={(value) => update("readinessStateId", value)} options={[["", t("listings.options.chooseProfile")], ...readiness.map((item) => [String(item.id), item.name])]}/></div>; }
function Category({ form, t, query, results, suggestion, find, update }: { form: EtsyDraftInput; t: (key: string) => string; query: string; results: Array<{ taxonomyId: string | number; name: string; path: string }>; suggestion: string | null; find: (value: string) => void; update: <K extends keyof EtsyDraftInput>(key: K, value: EtsyDraftInput[K]) => void }) { return <div><Input label={t("listings.fields.category")} value={query} onChange={find} wide/>{suggestion && <p className="mt-3 text-[11px] text-charcoal/55">{t("listings.lucy.categorySuggestion")}: {suggestion}</p>}<div className="mt-3 space-y-2">{results.map((item) => <button key={String(item.taxonomyId)} type="button" onClick={() => update("taxonomyId", item.taxonomyId)} className={`block w-full rounded-[11px] border p-3 text-left ${String(form.taxonomyId) === String(item.taxonomyId) ? "border-terracotta bg-[#FFF8F3]" : "border-charcoal/[0.08]"}`}><span className="text-[12px] font-semibold">{item.name}</span><span className="mt-1 block text-[10px] text-charcoal/45">{item.path}</span></button>)}</div></div>; }
function Review({ form, images, t }: { form: EtsyDraftInput; images: ImageItem[]; t: (key: string) => string }) { return <div className="grid gap-3 text-[12px] text-charcoal/65"><Row label={t("listings.workspace.titleField")} value={form.title}/><Row label={t("listings.fields.price")} value={String(form.price ?? "—")}/><Row label={t("listings.fields.quantity")} value={String(form.quantity ?? "—")}/><Row label={t("listings.fields.type")} value={form.type === "download" ? t("listings.options.digital") : t("listings.options.physical")}/><Row label={t("listings.fields.tags")} value={(form.tags ?? []).join(", ") || "—"}/><Row label={t("listings.fields.category")} value={form.taxonomyId ? t("listings.wizard.categorySelected") : t("listings.validation.category")}/><Row label={t("listings.fields.images")} value={String(images.length)}/></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 border-b border-charcoal/[0.06] pb-2"><span>{label}</span><strong className="text-right text-charcoal">{value}</strong></div>; }
function Input({ label, value, onChange, type = "text", wide = false }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; wide?: boolean }) { return <label className={`block text-[11px] font-semibold text-charcoal/65 ${wide ? "sm:col-span-2" : ""}`}>{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] px-3 text-xs font-normal"/></label>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="block text-[11px] font-semibold text-charcoal/65">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-[10px] border border-charcoal/[0.1] bg-white px-3 text-xs font-normal">{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>; }
