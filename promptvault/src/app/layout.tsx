import type { Metadata } from 'next';
import '../styles/globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'Prompt Smith — 4,000+ Expert AI Prompts',
    template: '%s · Prompt Smith',
  },
  description:
    'Copy-paste-ready AI prompts for ChatGPT, Claude, Gemini and any LLM. Built by professionals, for professionals — across 35 industries.',
  keywords: [
    'AI prompts',
    'ChatGPT prompts',
    'Claude prompts',
    'Gemini prompts',
    'prompt library',
    'prompt pack',
  ],
  authors: [{ name: 'Prompt Smith' }],
  openGraph: {
    title: 'Prompt Smith — 4,000+ Expert AI Prompts',
    description:
      'Expert AI prompts for every profession. One-time purchase, lifetime access.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Smith — 4,000+ Expert AI Prompts',
    description:
      'Expert AI prompts for every profession. One-time purchase, lifetime access.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
