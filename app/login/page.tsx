"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { apiBaseUrl } from "@/lib/api/client";

export default function LoginPage() {
  const { status, user } = useSession();
  const { t } = useI18n();
  const [safeNext, setSafeNext] = useState("/dashboard");
  const [returnTo, setReturnTo] = useState("/dashboard");

  useEffect(() => {
    const requestedNext = new URLSearchParams(window.location.search).get("next");
    const nextPath = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
    setSafeNext(nextPath);
    setReturnTo(`${window.location.origin}${nextPath}`);
  }, []);

  return <main className="grid min-h-screen place-items-center bg-[#F7F4F1] px-5 py-12 text-[#333333]"><section className="w-full max-w-md rounded-[28px] border border-[#333333]/8 bg-white p-7 shadow-[0_20px_60px_rgba(51,51,51,0.06)] sm:p-9"><div className="flex items-center justify-between"><Link href="/" className="text-sm font-semibold">Lucy Seller Copilot</Link><LanguageSwitcher /></div><div className="mt-12"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F74E03]">{t("public.auth.private")}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">{t("public.auth.signInTitle")}</h1><p className="mt-4 text-sm leading-6 text-[#333333]/58">{t("public.auth.signInDescription")}</p>{status === "authenticated" ? <div className="mt-8 rounded-2xl bg-[#ECF7F0] p-4 text-sm text-[#2D8158]">{t("public.auth.signedIn")} {user?.email}. <Link href={safeNext} className="font-semibold underline">{t("public.auth.continue")}</Link></div> : <form action={`${apiBaseUrl()}/customer/login`} method="post" className="mt-8 space-y-4"><input type="hidden" name="return_to" value={returnTo} /><label className="block text-xs font-semibold">{t("public.auth.email")}<input name="email" type="email" required autoComplete="email" className="mt-1.5 h-11 w-full rounded-xl border border-[#333333]/12 px-3 text-sm font-normal outline-none focus:border-[#F74E03]" /></label><label className="block text-xs font-semibold">{t("public.auth.accessCode")}<input name="access_code" required autoComplete="one-time-code" className="mt-1.5 h-11 w-full rounded-xl border border-[#333333]/12 px-3 text-sm font-normal outline-none focus:border-[#F74E03]" /></label><button type="submit" className="w-full rounded-xl bg-[#F74E03] py-3 text-sm font-semibold text-white">{t("public.nav.signIn")}</button></form>}</div><Link href="/" className="mt-8 inline-block text-sm font-semibold text-[#F74E03]">{t("public.auth.back")}</Link></section></main>;
}
