"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { getBillingStatus } from "@/lib/api/billing";
import type { BillingStatus } from "@/lib/api/types";
import { BrandMark } from "./brand-mark";
import { Icon, type IconName } from "./icons";

const navItems: Array<{ labelKey?: string; label?: string; href: string; icon: string; lower?: boolean }> = [
  { labelKey: "nav.home", href: "/dashboard", icon: "home" },
  { labelKey: "nav.chat", href: "/chat", icon: "message" },
  { labelKey: "nav.listings", href: "/listings", icon: "tag" },
  { labelKey: "nav.imageStudio", href: "/image-studio", icon: "sparkles" },
  { labelKey: "nav.research", href: "/research", icon: "search" },
  { labelKey: "nav.analytics", href: "/analytics", icon: "analytics" },
  { labelKey: "nav.monitoring", href: "/monitoring", icon: "analytics" },
  { labelKey: "nav.reports", href: "/reports", icon: "file-chart" },
  { labelKey: "nav.automation", href: "/automation", icon: "bot" },
  { labelKey: "nav.policies", href: "/policies", icon: "shield-check" },
  { labelKey: "nav.connections", href: "/connections", icon: "plug", lower: true },
  { labelKey: "nav.billing", href: "/billing", icon: "credit-card", lower: true },
  { labelKey: "nav.settings", href: "/settings", icon: "settings", lower: true },
];

type SidebarProps = {
  mobileOpen?: boolean;
  activeItem?: string;
  onClose?: () => void;
  onSelect?: (value: string) => void;
  onPlanAction?: () => void;
};

export function Sidebar({
  mobileOpen = false,
  activeItem = "Dashboard",
  onClose,
  onSelect,
  onPlanAction,
}: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, status } = useSession();
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const planPriceSuffix = t("plan.month");

  useEffect(() => {
    if (status !== "authenticated") { setBilling(null); return; }
    let live = true;
    void getBillingStatus().then((value) => { if (live) setBilling(value); }).catch(() => { if (live) setBilling(null); });
    return () => { live = false; };
  }, [status]);

  const planLabel = billing ? (billing.shopLimit > 1 ? "MULTI STORE" : "PRO PLAN") : t("common.unavailable");
  const planPrice = billing ? (billing.shopLimit > 1 ? "$99" : "$59") : "—";
  const storeCount = billing ? `${billing.connectedShops} / ${billing.shopLimit}` : "—";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 h-[100dvh] w-[238px] overflow-hidden bg-[#222222] p-4 pb-[14px] text-white shadow-[20px_0_60px_rgba(0,0,0,0.13)] transition-transform duration-300 lg:sticky lg:top-0 lg:z-40 lg:shrink-0 max-[850px]:p-3 max-[850px]:pb-[12px] ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="sidebar-logo shrink-0 mb-4 max-[850px]:mb-3">
          <div className="flex items-center justify-between gap-3 px-1 max-[850px]:gap-2">
            <BrandMark compact />
            <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-[9px] text-white/60 hover:bg-white/10 lg:hidden" aria-label={t("tool.close")}><Icon name="close" size={16} /></button>
          </div>
        </div>

        <nav className="sidebar-nav mt-0 min-h-0 flex-1 overflow-y-auto space-y-1 pr-1 pb-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.labelKey ? activeItem === t(item.labelKey) : activeItem === item.label);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`sidebar-nav-item flex min-h-[44px] items-center justify-between rounded-[14px] px-3 py-2 text-sm transition max-[850px]:px-2.5 ${item.lower && item.href === "/connections" ? "mt-4 border-t border-white/10 pt-4" : ""} ${
                  isActive
                    ? "border-r-2 border-[#F74E03] bg-white/[0.08] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                    : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3 max-[850px]:gap-2.5">
                  <Icon name={item.icon as IconName} size={18} className={isActive ? "text-[#F74E03]" : "text-white/48"} />
                  <span className="text-[13px] leading-none max-[850px]:text-[12px]">{item.label ?? t(item.labelKey ?? "")}</span>
                </span>
                {isActive && <span className="h-2 w-2 rounded-full bg-[#F74E03]" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom mt-3 shrink-0 space-y-3">
          <div className="sidebar-plan rounded-[16px] border border-white/10 bg-white/[0.06] p-3 text-white max-[850px]:p-2.5">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 max-[850px]:tracking-[0.16em]">{t("plan.label")}</div>
            <div className="mt-1.5 flex items-center gap-2 text-[17px] font-bold tracking-[-0.04em] max-[850px]:mt-1 max-[850px]:text-[15px]"><Icon name="sparkles" size={15} className="text-[#F74E03]" />{planLabel}</div>
            <div className="mt-2 flex items-end gap-1 max-[850px]:mt-1.5">
              <span className="text-[24px] font-bold leading-none max-[850px]:text-[22px]">{planPrice}</span>
              <span className="pb-0.5 text-[10px] font-medium text-white/55 max-[850px]:text-[9px]">/ {planPriceSuffix}</span>
            </div>
            <div className="mt-2 text-[10px] font-medium text-white/55 max-[850px]:mt-1.5 max-[850px]:text-[9px]">{storeCount}</div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10 max-[850px]:mt-2"><div className="h-full w-full rounded-full bg-[#F74E03]" /></div>

            <Link
              href="/billing"
              onClick={() => { onClose?.(); onSelect?.("Subscription"); onPlanAction?.(); }}
              className="mt-3 block w-full rounded-[10px] border border-[#F74E03]/60 px-3 py-2 text-center text-[10px] font-semibold text-[#F74E03] transition hover:bg-[#F74E03] hover:text-white max-[850px]:mt-2 max-[850px]:py-1.5"
            >
              {t("plan.manageSubscription")}
            </Link>
          </div>

          <div className="sidebar-profile">
            <div className="flex w-full items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.06] p-3 max-[850px]:gap-2.5 max-[850px]:p-2.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-white/15 text-sm font-semibold text-white/85 max-[850px]:size-9">N</div>
              <div className="min-w-0 flex-1"><div className="text-xs font-semibold text-white">{user?.name ?? "-"}</div><div className="mt-0.5 truncate text-[10px] text-white/45">{user?.email ?? "-"}</div></div>
              <Icon name="chevron-right" size={14} className="text-white/35" />
            </div>
            <Link href="/legal/privacy" className="mt-2 block px-1 text-[9px] text-white/35 transition hover:text-white/70">{t("sidebar.legal")}</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
