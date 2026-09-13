"use client";

import { useI18n } from "@/lib/i18n";
import { Icon } from "./icons";

type TopBarProps = {
  onMenu: () => void;
  onSearch: (query: string) => void;
};

export function TopBar({ onMenu, onSearch }: TopBarProps) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 border-b border-charcoal/[0.06] bg-[#F7F4F1]/85 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1480px] items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="grid size-10 place-items-center rounded-[12px] border border-charcoal/[0.08] bg-white text-charcoal/60 transition hover:border-terracotta/25 hover:text-terracotta lg:hidden"
          aria-label={t("topbar.openNavigation")}
        >
          <Icon name="plus" size={16} />
        </button>

        <label className="relative flex-1">
          <span className="sr-only">{t("topbar.search")}</span>
          <Icon
            name="search"
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
          />
          <input
            type="search"
            placeholder={t("topbar.searchPlaceholder")}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 w-full rounded-[14px] border border-charcoal/[0.08] bg-white pl-10 pr-4 text-[11px] text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-terracotta/35 focus:ring-4 focus:ring-terracotta/[0.06]"
          />
        </label>

        <div className="hidden items-center gap-3 rounded-[14px] border border-charcoal/[0.07] bg-white px-3 py-2.5 sm:flex">
          <div className="grid size-8 place-items-center rounded-[10px] bg-[#F7F4F1] text-[10px] font-bold text-charcoal">
            NL
          </div>
          <div className="text-left">
            <div className="text-[11px] font-semibold tracking-[-0.02em] text-charcoal">Natalia Lozova</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-terracotta">PRO PLAN</div>
          </div>
        </div>
      </div>
    </header>
  );
}
