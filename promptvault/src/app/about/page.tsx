import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'About Us — Prompt Smith',
  description:
    'About Prompt Smith — a digital prompt library run as a sole-proprietorship by Pazhaniswamy Sundhar Ganesh, Coimbatore.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          About Us
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {BUSINESS.policyEffectiveDate}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Who we are</h2>
            <p className="mt-3">
              <strong>{BUSINESS.brand}</strong> ({BUSINESS.domain}) is a digital prompt
              library that sells professionally-written AI prompts for ChatGPT, Claude,
              Gemini, and any other large language model. We focus on India-context
              prompts across 38 professions and 124 sub-categories.
            </p>
            <p className="mt-3">
              {BUSINESS.brand} is operated as a sole proprietorship by{' '}
              <strong>{BUSINESS.legalName}</strong> ({BUSINESS.ownerTitle}), based in
              Coimbatore, Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">What we sell</h2>
            <p className="mt-3">
              A one-time-purchase, lifetime-access library of <strong>4,029 expert
              AI prompts</strong> with free quarterly updates. After payment the buyer
              gets:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1.5">
              <li>Immediate online access to all prompts on {BUSINESS.domain}.</li>
              <li>
                A downloadable ZIP containing JSON, Markdown, and per-subcategory files
                for offline use.
              </li>
              <li>Free additions and refreshes every quarter for the lifetime of the product.</li>
            </ul>
            <p className="mt-3">
              Because every prompt is a digital, instantly-consumable asset, all sales
              are treated as final. See our{' '}
              <Link href="/refund" className="font-medium text-rose-600 hover:text-rose-700">
                Refund Policy
              </Link>{' '}
              and{' '}
              <Link href="/return" className="font-medium text-rose-600 hover:text-rose-700">
                Return Policy
              </Link>{' '}
              for the full terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">How we operate</h2>
            <p className="mt-3">
              Payments are processed by <strong>Cashfree Payments India Pvt. Ltd.</strong>,
              an RBI-licensed Payment Aggregator. We do not store or have access to your
              card, UPI, or net-banking credentials. Receipts are emailed by us via
              Resend. Customer data is handled in line with our Privacy Policy and the
              Digital Personal Data Protection Act, 2023.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Business details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Trading name" value={BUSINESS.brand} />
              <Row label="Legal name" value={`${BUSINESS.legalName} (${BUSINESS.ownerTitle})`} />
              <Row label="Website" value={`https://${BUSINESS.domain}`} />
              <Row label="Email" value={BUSINESS.email} />
              <Row label="Phone / WhatsApp" value={BUSINESS.phone} />
              <Row
                label="Registered address"
                value={`${BUSINESS.address.line1}, ${BUSINESS.address.line2}, ${BUSINESS.address.city}, ${BUSINESS.address.state} – ${BUSINESS.address.postal}, ${BUSINESS.address.country}`}
              />
              <Row label="Support hours" value={BUSINESS.hours} />
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">Get in touch</h2>
            <p className="mt-3">
              Questions, partnerships, or bulk-license enquiries? Visit our{' '}
              <Link href="/contact" className="font-medium text-rose-600 hover:text-rose-700">
                Contact page
              </Link>{' '}
              or email us at{' '}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.email}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr]">
      <dt className="font-medium text-slate-600">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  );
}
