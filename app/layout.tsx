import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { I18nProvider } from "@/lib/i18n";
import { SessionProvider } from "@/lib/session";
import { SubscriptionProvider } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Lucy Seller Copilot",
  description: "AI operating system for marketplace sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider><SessionProvider><SubscriptionProvider><AppShell>{children}</AppShell></SubscriptionProvider></SessionProvider></I18nProvider>
      </body>
    </html>
  );
}