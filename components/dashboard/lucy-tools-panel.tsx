"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, ChartNoAxesCombined, FilePlus, FileText, Image, KeyRound, Layers, PlusCircle, Radar, RefreshCw, Search, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toolGroups } from "./data";
import { BrandMark } from "./brand-mark";
import { Icon } from "./icons";

type LucyToolsPanelProps = {
  expanded: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  onToolSelect: (tool: string) => void;
};

const toolIcons = {
  "Створити чернетку": FilePlus,
  "Мої чернетки": FileText,
  "Редагувати чернетку": RefreshCw,
  "Підготувати чернетку": CalendarClock,
  "Масове створення": Layers,
  "Завантажити фото": Image,
  "Аналіз конкурентів": Search,
  "Пошук ключових слів": KeyRound,
  "Аналіз ніші": Radar,
  "SEO-аналіз": Sparkles,
  "Генератор заголовків": FileText,
  "Генератор описів": FileText,
  "Щоденний звіт": ChartNoAxesCombined,
  "Тижневий звіт": ChartNoAxesCombined,
  "Звіт з доходу": ChartNoAxesCombined,
  Черга: RefreshCw,
  Правила: Sparkles,
  Розклад: CalendarClock,
  Etsy: Layers,
  "Lucy AI": Sparkles,
  Telegram: Layers,
} as const;

export function LucyToolsPanel({
  expanded,
  mobileOpen,
  onToggle,
  onCloseMobile,
  onToolSelect,
}: LucyToolsPanelProps) {
  const { locale, t } = useI18n();

  const localizedGroups = useMemo(
    () =>
      toolGroups.map((group) => ({
        ...group,
        key: group.titleKey.replace("tool.group.", ""),
        name: t(group.titleKey),
        items: group.items.map((item) => ({
          ...item,
          originalName: item.name,
          name: t(item.titleKey),
          description: t(item.descriptionKey),
        })),
      })),
    [t],
  );

  const [query, setQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    listings: true,
    research: true,
    seo: true,
    analytics: true,
    automation: true,
    integrations: true,
  });

  useEffect(() => {
    setExpandedGroups((current) => ({
      listings: current.listings ?? true,
      research: current.research ?? true,
      seo: current.seo ?? true,
      analytics: current.analytics ?? true,
      automation: current.automation ?? true,
      integrations: current.integrations ?? true,
    }));
  }, [locale]);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return localizedGroups;

    return localizedGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            group.name.toLowerCase().includes(normalizedQuery) ||
            item.name.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [localizedGroups, query]);

  const totalTools = localizedGroups.reduce((total, group) => total + group.items.length, 0);
  const visibleTools = filteredGroups.reduce((total, group) => total + group.items.length, 0);

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 h-dvh w-[calc(100vw-16px)] max-w-[356px] shrink-0 border-l border-charcoal/[0.08] bg-[#FBFAF8] shadow-[-20px_0_60px_rgba(51,51,51,0.12)] transition-[width,transform] duration-300 ease-out xl:sticky xl:top-0 xl:z-30 xl:max-w-none xl:translate-x-0 xl:shadow-none ${
        mobileOpen ? "translate-x-0" : "translate-x-full"
      } ${expanded ? "xl:w-[340px]" : "xl:w-[76px]"}`}
      aria-label="Функції Люсі"
    >
      <div className={`h-full flex-col ${expanded ? "flex xl:flex" : "flex xl:hidden"}`}>
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-charcoal/[0.07] px-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-terracotta">{t("tool.catalog")}</p>
            <h2 className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-charcoal">{t("tool.lucyTools")}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggle}
              className="hidden size-9 place-items-center rounded-xl text-charcoal/42 transition hover:bg-white hover:text-charcoal xl:grid"
              aria-label={t("tool.expand")}
            >
              <Icon name="chevron-right" size={17} />
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="grid size-9 place-items-center rounded-xl text-charcoal/42 transition hover:bg-white hover:text-charcoal xl:hidden"
              aria-label={t("tool.close")}
            >
              <Icon name="close" size={17} />
            </button>
          </div>
        </div>

        <div className="shrink-0 p-4 pb-2">
          <div className="relative">
            <Icon
              name="search"
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("tool.searchPlaceholder")}
              aria-label={t("tool.searchPlaceholder")}
              className="h-9 w-full rounded-[11px] border border-charcoal/[0.09] bg-white pl-9 pr-10 text-[11px] text-charcoal outline-none transition placeholder:text-charcoal/34 focus:border-terracotta/35 focus:ring-4 focus:ring-terracotta/[0.06]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-charcoal/30 hover:bg-linen/40 hover:text-charcoal"
                aria-label={t("tool.clearSearch")}
              >
                <Icon name="close" size={12} />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between px-1 text-[9px] text-charcoal/35">
            <span>{query ? `${visibleTools} ${t("tool.searchResults")}` : `${totalTools} ${t("tool.totalTools")}`}</span>
          </div>
        </div>

          <div className="dashboard-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {filteredGroups.length > 0 ? (
            <div className="space-y-3">
              {filteredGroups.map((group) => {
                const isOpen = expandedGroups[group.key] ?? true;
                const categoryStyles = {
                  listings: "bg-terracotta/[0.08] text-terracotta",
                  research: "bg-mist/20 text-[#52758C]",
                  seo: "bg-[#DCEFE4] text-[#2D8158]",
                  analytics: "bg-[#E9E0F1] text-[#806C9D]",
                  automation: "bg-terracotta/[0.08] text-terracotta",
                  integrations: "bg-mist/20 text-[#52758C]",
                };
                const categoryStyle = categoryStyles[group.key as keyof typeof categoryStyles] ?? "bg-linen/45 text-charcoal/55";
                return (
                  <section key={group.key} aria-labelledby={`tool-group-${group.key}`}>
                    <button
                      type="button"
                      onClick={() => setExpandedGroups((current) => ({ ...current, [group.key]: !current[group.key] }))}
                      className={`flex h-10 w-full items-center gap-2 rounded-[12px] px-3 text-left ${categoryStyle}`}
                    >
                      <span>
                        <Icon name={group.icon} size={13} />
                      </span>
                      <h3
                        id={`tool-group-${group.key}`}
                        className="text-[12px] font-bold uppercase tracking-[0.08em]"
                      >
                        {group.name}
                      </h3>
                      <span className="ml-auto text-[9px] tabular-nums text-charcoal/25">{group.items.length}</span>
                      <span className="text-[12px] text-charcoal/45">{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <div className="mt-1 space-y-0.5">
                        {group.items.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              onToolSelect(item.name);
                              onCloseMobile();
                            }}
                            className="group flex min-h-[52px] w-full items-center gap-2.5 rounded-[11px] border border-transparent px-2.5 py-2 text-left transition hover:border-charcoal/[0.06] hover:bg-white hover:shadow-[0_6px_18px_rgba(51,51,51,0.04)]"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-linen/45 text-charcoal/45 transition group-hover:bg-terracotta/10 group-hover:text-terracotta">
                              {(() => { const ToolIcon = toolIcons[(item.originalName ?? item.name) as keyof typeof toolIcons] ?? PlusCircle; return <ToolIcon size={15} strokeWidth={1.8} aria-hidden="true" />; })()}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12px] font-semibold text-charcoal/72 group-hover:text-charcoal">
                                {item.name}
                              </span>
                              <span className="mt-0.5 block truncate text-[10px] text-charcoal/35">
                                {item.description}
                              </span>
                            </span>
                            <Icon
                              name="chevron-right"
                              size={12}
                              className="text-charcoal/20 transition group-hover:translate-x-0.5 group-hover:text-terracotta"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="flex h-52 flex-col items-center justify-center px-6 text-center">
              <span className="grid size-11 place-items-center rounded-2xl bg-linen/50 text-charcoal/35">
                <Icon name="search" size={18} />
              </span>
              <p className="mt-3 text-xs font-semibold text-charcoal/65">{t("tool.emptyState")}</p>
              <p className="mt-1 text-[10px] leading-4 text-charcoal/38">{t("tool.emptyStateHint")}</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-3 text-[10px] font-semibold text-terracotta"
              >
                {t("tool.clearSearch")}
              </button>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-charcoal/[0.07] p-4">
          <button
            type="button"
            onClick={() => onToolSelect("Запитати функцію")}
            className="flex w-full items-center gap-3 rounded-[15px] bg-charcoal px-3.5 py-3 text-left text-white transition hover:bg-[#292929]"
          >
            <span className="grid size-8 place-items-center rounded-[10px] bg-white/10 text-linen">
              <Icon name="plus" size={14} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold">{t("tool.needOther")}</span>
              <span className="mt-0.5 block text-[9px] text-white/38">{t("tool.askLucy")}</span>
            </span>
            <Icon name="arrow-up-right" size={13} className="text-white/45" />
          </button>
        </div>
      </div>

      <div className={`hidden h-full flex-col items-center py-4 ${expanded ? "xl:hidden" : "xl:flex"}`}>
        <BrandMark compact />
        <button
          type="button"
          onClick={onToggle}
          className="mt-5 grid size-10 place-items-center rounded-[13px] border border-charcoal/[0.08] bg-white text-charcoal/45 transition hover:border-terracotta/25 hover:text-terracotta"
          aria-label={t("tool.expand")}
        >
          <Icon name="chevron-left" size={17} />
        </button>
        <div className="mt-6 h-px w-7 bg-charcoal/[0.08]" />
        <div className="mt-4 flex flex-col gap-2.5">
          {toolGroups.map((group) => (
            <button
              key={group.name}
              type="button"
              title={group.name}
              onClick={onToggle}
              className="grid size-10 place-items-center rounded-[13px] text-charcoal/35 transition hover:bg-white hover:text-terracotta"
              aria-label={`Розгорнути ${group.name}`}
            >
              <Icon name={group.icon} size={17} />
            </button>
          ))}
        </div>
        <span className="mt-auto rounded-full bg-terracotta px-2 py-1 text-[8px] font-semibold text-white">{totalTools}</span>
      </div>
    </aside>
  );
}
