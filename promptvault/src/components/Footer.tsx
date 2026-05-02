import Link from 'next/link';
import { BUSINESS } from '@/lib/business';

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{
        borderColor: 'var(--border)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(12, 12, 24, 0.6) 100%)',
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div>
          <div
            className="flex items-center gap-2 text-base font-bold"
            style={{ color: 'var(--text)' }}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold text-white"
              style={{
                background: 'var(--grad-iri)',
                boxShadow: '0 4px 16px -2px rgba(124, 92, 255, 0.6)',
              }}
            >
              PS
            </span>
            Prompt Smith
          </div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-dim)' }}>
            4,000+ copy-paste-ready AI prompts for every profession. Built for ChatGPT,
            Claude, Gemini and any LLM.
          </p>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-mute)' }}>
            Operated by {BUSINESS.legalName}, Coimbatore, Tamil Nadu, India.
          </p>
        </div>
        <FooterCol heading="Explore">
          <FooterLink href="/browse">All categories</FooterLink>
          <FooterLink href="/claude-design">Claude Design — landing pages</FooterLink>
          <FooterLink href="/search">Search prompts</FooterLink>
          <FooterLink href="/preview">Free 348-prompt preview</FooterLink>
          <FooterLink href="/#pricing">Pricing</FooterLink>
        </FooterCol>
        <FooterCol heading="Support">
          <FooterLink href="/#faq">FAQ</FooterLink>
          <FooterLink href="/contact">Contact us</FooterLink>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="block py-1 text-sm transition"
            style={{ color: 'var(--text-dim)' }}
          >
            {BUSINESS.email}
          </a>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="block py-1 text-sm transition"
            style={{ color: 'var(--text-dim)' }}
          >
            {BUSINESS.phone}
          </a>
        </FooterCol>
        <FooterCol heading="Legal">
          <FooterLink href="/about">About us</FooterLink>
          <FooterLink href="/refund">Refund policy</FooterLink>
          <FooterLink href="/return">Return policy</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/terms">Terms of use</FooterLink>
        </FooterCol>
      </div>
      <div
        className="border-t py-5 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--text-mute)' }}
      >
        © {new Date().getFullYear()} Prompt Smith · {BUSINESS.domain}
      </div>
    </footer>
  );
}

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h4
        className="mb-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-mute)' }}
      >
        {heading}
      </h4>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="block py-1 text-sm transition"
        style={{ color: 'var(--text-dim)' }}
      >
        {children}
      </Link>
    </li>
  );
}
