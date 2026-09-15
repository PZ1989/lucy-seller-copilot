"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const menu = [
  { nameKey: "nav.home", href: "/", icon: "⌂" },
  { nameKey: "nav.chat", href: "/chat", icon: "◎" },
  { nameKey: "nav.analytics", href: "/analytics", icon: "▣" },
  { nameKey: "nav.listings", href: "/listings", icon: "▤" },
  { nameKey: "nav.research", href: "/research", icon: "⌕" },
  { nameKey: "nav.automation", href: "/automation", icon: "⚙" },
  { nameKey: "nav.reports", href: "/reports", icon: "◫" },
  { nameKey: "nav.connections", href: "/connections", icon: "⎇" },
  { nameKey: "nav.subscription", href: "/billing", icon: "◍" },
  { nameKey: "nav.settings", href: "/settings", icon: "☰" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="flex w-64 min-h-screen flex-col justify-between bg-[#222222] p-5 text-white">
      <div>
        <div className="mb-8 flex items-center gap-3 px-1">
          <Image src="/brand/lucy-logo.png" alt="Lucy Seller Copilot logo" width={165} height={67} className="h-8 w-auto object-contain opacity-95" />
        </div>

        <nav className="space-y-1.5">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                  active ? "border-l-2 border-[#F74E03] bg-white/8 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base text-current">{item.icon}</span>
                <span>{t(item.nameKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="rounded-[22px] bg-gradient-to-br from-[#AAC1D1] via-[#E7E0DA] to-[#F74E03]/90 p-4 text-[#1F1F1F] shadow-[0_18px_40px_rgba(247,78,3,0.18)]">
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1F1F1F]/65">{t("plan.label")}</div>
          <div className="mt-2 text-[20px] font-bold tracking-[-0.04em]">PRO PLAN</div>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-[30px] font-bold leading-none">$59</span>
            <span className="pb-1 text-[10px] font-medium text-[#1F1F1F]/65">/ {t("plan.month")}</span>
          </div>

          <div className="mt-4 space-y-1 text-[11px]">
            <div>• {t("plan.storeUsage")}</div>
            <div>• {t("common.catalog")}</div>
            <div>• AI 2500 / month</div>
            <div>• {t("nav.analytics")}</div>
          </div>

          <Link href="/billing" className="mt-4 block rounded-xl bg-[#222222] py-2.5 text-center text-sm font-medium text-white">
            {t("plan.manageSubscription")}
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-3 py-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 text-[10px] font-bold text-white/90">NL</div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white">Наталія</div>
            <div className="text-[10px] text-white/55">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}