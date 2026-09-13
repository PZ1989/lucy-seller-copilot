import { legalSlugs } from "@/lib/legal/content";
import LegalClient from "./legal-client";

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export default function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  return <LegalClientSlug params={params} />;
}

async function LegalClientSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegalClient slug={slug} />;
}
