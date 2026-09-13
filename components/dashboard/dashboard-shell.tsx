"use client";

import { useEffect, useState } from "react";
import { AskLucy } from "./ask-lucy";
import { HeroCard } from "./hero-card";
import { Icon } from "./icons";
import { InsightsPanel } from "./insights-panel";
import { QuickTools } from "./quick-tools";
import { Sidebar } from "./sidebar";
import { StatsGrid } from "./stats-grid";
import { SubscriptionPlans } from "./subscription-plans";
import { TopBar } from "./top-bar";
import Link from "next/link";

export function DashboardShell() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState("Dashboard");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function openChat() {
    document.getElementById("ask-lucy")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => document.getElementById("ask-lucy-input")?.focus(), 500);
  }

  function openPlans() {
    document.getElementById("subscription")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveNavigation("Subscription");
  }

  function selectTool(tool: string) {
    setNotice(`${tool} selected — ready for API wiring.`);
  }

  return (
    <div className="min-h-screen bg-[#F7F4F1] text-charcoal">
      <a
        href="#main-dashboard"
        className="fixed left-4 top-3 z-[80] -translate-y-20 rounded-xl bg-charcoal px-4 py-2 text-xs font-semibold text-white transition focus:translate-y-0"
      >
        Skip to dashboard
      </a>

      <div className="flex min-h-screen">
        <Sidebar
          mobileOpen={mobileNavigationOpen}
          activeItem={activeNavigation}
          onClose={() => setMobileNavigationOpen(false)}
          onSelect={setActiveNavigation}
          onPlanAction={openPlans}
        />

        {mobileNavigationOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-charcoal/35 backdrop-blur-sm lg:hidden"
            aria-label="Close navigation overlay"
            onClick={() => setMobileNavigationOpen(false)}
          />
        )}

        <div className="min-w-0 flex-1">
          <TopBar
            onMenu={() => setMobileNavigationOpen(true)}
            onSearch={(query) => setNotice(`Searching the mock workspace for “${query}”.`)}
          />

          <main id="main-dashboard" className="px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-12">
            <div className="mx-auto max-w-[1480px] space-y-6">
              <HeroCard
                onChat={openChat}
                onConnections={() => {
                  setNotice("Connection settings selected — using mock account data.");
                }}
              />

              <StatsGrid />

              <QuickTools
                onToolSelect={selectTool}
                onViewAll={() => {
                }}
              />

              <div className="grid gap-6 2xl:grid-cols-[0.92fr_1.08fr]">
                <InsightsPanel onSelect={selectTool} />
                <AskLucy />
              </div>

              <SubscriptionPlans onAction={selectTool} />

              <footer
                id="settings"
                className="flex flex-col justify-between gap-2 border-t border-charcoal/[0.08] px-1 pt-5 text-[9px] text-charcoal/32 sm:flex-row sm:items-center"
              >
                <p>Lucy Seller Copilot · eNJoy Agency</p>
                <div className="flex flex-wrap gap-3"><Link href="/legal/terms" className="hover:text-terracotta">Terms</Link><Link href="/legal/privacy" className="hover:text-terracotta">Privacy</Link><Link href="/legal/refund" className="hover:text-terracotta">Refunds</Link><Link href="/legal/cookies" className="hover:text-terracotta">Cookies</Link><Link href="/legal/ai-disclaimer" className="hover:text-terracotta">AI Disclaimer</Link></div>
              </footer>
            </div>
          </main>
        </div>

      </div>

      {notice && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-[70] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-3 rounded-[16px] border border-white/10 bg-charcoal px-4 py-3 text-[10px] font-medium text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:left-auto sm:right-5 sm:translate-x-0"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-terracotta text-white">
            <Icon name="sparkles" size={12} />
          </span>
          <span className="leading-4 text-white/80">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="ml-1 text-white/35 transition hover:text-white"
          >
            <Icon name="close" size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
