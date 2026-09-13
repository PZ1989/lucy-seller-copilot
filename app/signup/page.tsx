"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";

export default function SignupPage() {
  const [notice, setNotice] = useState<string | null>(null);
  const { t } = useI18n();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Registration endpoint pending; do not claim account creation without a backend contract.
    setNotice(t("public.auth.pendingSignup"));
  }

  return <main className="grid min-h-screen place-items-center bg-[#F7F4F1] px-5 py-12 text-[#333333]"><section className="w-full max-w-md rounded-[28px] border border-[#333333]/8 bg-white p-7 shadow-[0_20px_60px_rgba(51,51,51,0.06)] sm:p-9"><div className="flex items-center justify-between"><Link href="/" className="text-sm font-semibold">Lucy Seller Copilot</Link><LanguageSwitcher /></div><div className="mt-10"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F74E03]">{t("public.auth.start")}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">{t("public.auth.signupTitle")}</h1><p className="mt-4 text-sm leading-6 text-[#333333]/58">{t("public.auth.signupDescription")}</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-xs font-semibold">{t("public.auth.name")}<input name="name" required className="mt-1.5 h-11 w-full rounded-xl border border-[#333333]/12 px-3 text-sm font-normal outline-none focus:border-[#F74E03]" /></label><label className="block text-xs font-semibold">{t("public.auth.email")}<input name="email" type="email" required className="mt-1.5 h-11 w-full rounded-xl border border-[#333333]/12 px-3 text-sm font-normal outline-none focus:border-[#F74E03]" /></label><label className="block text-xs font-semibold">{t("public.auth.password")}<input name="password" type="password" required minLength={8} className="mt-1.5 h-11 w-full rounded-xl border border-[#333333]/12 px-3 text-sm font-normal outline-none focus:border-[#F74E03]" /></label><label className="block text-xs font-semibold">{t("public.auth.confirmPassword")}<input name="confirmPassword" type="password" required minLength={8} className="mt-1.5 h-11 w-full rounded-xl border border-[#333333]/12 px-3 text-sm font-normal outline-none focus:border-[#F74E03]" /></label><button type="submit" className="w-full rounded-xl bg-[#F74E03] py-3 text-sm font-semibold text-white">{t("public.auth.create")}</button></form>{notice && <p role="status" className="mt-4 rounded-xl bg-[#FFF8F3] p-3 text-xs leading-5 text-[#333333]/65">{notice}</p>}<p className="mt-7 text-center text-sm text-[#333333]/55">{t("public.auth.already")} <Link href="/login" className="font-semibold text-[#F74E03]">{t("public.auth.signInInstead")}</Link></p></div></section></main>;
}
