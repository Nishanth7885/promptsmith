import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NICHES, NICHE_KEYS, type NicheKey } from '../_data';
import NicheLandingPage from './NicheLandingPage';

interface Params {
  niche: string;
}

export function generateStaticParams() {
  return NICHE_KEYS.map((key) => ({ niche: key }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const niche = NICHES.find((n) => n.key === params.niche);
  if (!niche) return { title: 'Preview — Claude Design' };
  return {
    title: `${niche.brand} — ${niche.label} preview · Claude Design`,
    description: `A full landing page generated with the Claude Design ${niche.label} pack — ${niche.hero.h1.replace(/\.$/, '')}.`,
  };
}

export default function NichePreviewPage({ params }: { params: Params }) {
  const niche = NICHES.find((n) => n.key === params.niche);
  if (!niche) notFound();
  return <NicheLandingPage niche={niche} themeKey={niche.key as NicheKey} />;
}
