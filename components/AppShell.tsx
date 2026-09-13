"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./dashboard/sidebar";
import { LanguageSwitcher } from "@/lib/i18n";
import { Icon } from "./dashboard/icons";
import { useSession } from "@/lib/session";
import { PaywallModal, PreviewBanner } from "./Paywall";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { status } = useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const publicRoutes = pathname === "/" || pathname === "/pricing" || pathname === "/login" || pathname.startsWith("/legal/");
  const privateRoute = pathname === "/dashboard" || pathname === "/chat" || pathname === "/listings" || pathname === "/image-studio" || pathname === "/research" || pathname === "/analytics" || pathname === "/monitoring" || pathname === "/reports" || pathname === "/automation" || pathname === "/policies" || pathname === "/connections" || pathname === "/billing" || pathname === "/settings";

  useEffect(() => {
    if (publicRoutes || !privateRoute) return;
    if (status === "loading") return;
    if (status !== "authenticated") {
      window.location.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [pathname, privateRoute, publicRoutes, status]);

  if (publicRoutes || !privateRoute) return <>{children}</>;
  if (status === "loading") return <div className="grid min-h-screen place-items-center bg-[#F7F4F1] text-sm text-[#333333]/55">Loading Lucy...</div>;
  if (status !== "authenticated") return <div className="grid min-h-screen place-items-center bg-[#F7F4F1] text-sm text-[#333333]/55">Redirecting to sign in...</div>;

  return (
    <div className="relative min-h-screen bg-[#F7F4F1] text-[#333333]">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#F7F4F1]">
          <div className="flex h-14 items-center justify-between border-b border-charcoal/[0.08] bg-[#F7F4F1] px-4 lg:hidden">
            <button type="button" onClick={() => setMobileNavOpen(true)} className="grid size-9 place-items-center rounded-[10px] border border-charcoal/[0.1] bg-white text-charcoal/65" aria-label="Open navigation"><Icon name="menu" size={17} /></button>
            <LanguageSwitcher />
            <span aria-hidden="true" />
          </div>
          <PreviewBanner />
          {children}
        </main>
      </div>

      <PaywallModal />
    </div>
  );
}