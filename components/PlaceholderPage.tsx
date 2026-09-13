import Link from "next/link";

type PlaceholderPageProps = { title: string; description: string };

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return <div className="min-h-screen px-5 py-10 sm:px-8 lg:px-10"><div className="mx-auto max-w-[900px]"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F74E03]">Lucy Seller Copilot</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#333333]">{title}</h1><div className="mt-8 rounded-[24px] border border-[#333333]/8 bg-white p-6 shadow-[0_14px_35px_rgba(51,51,51,0.035)]"><p className="text-sm leading-6 text-[#333333]/62">{description}</p><p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#333333]/38">In development</p><Link href="/dashboard" className="mt-7 inline-flex rounded-xl bg-[#F74E03] px-4 py-3 text-sm font-semibold text-white">Back to dashboard</Link></div></div></div>;
}
