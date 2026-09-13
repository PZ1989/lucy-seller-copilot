import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { I18nProvider } from "@/lib/i18n";
import { SessionProvider } from "@/lib/session";
import { SubscriptionProvider } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Lucy Seller Copilot",
  description: "AI operating system for marketplace sellers",
};

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const unbounded = Unbounded({
  weight: ["500", "600"],
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} ${manrope.variable} ${unbounded.variable}`}>
        <I18nProvider><SessionProvider><SubscriptionProvider><AppShell>{children}</AppShell></SubscriptionProvider></SessionProvider></I18nProvider>
      </body>
    </html>
  );
}