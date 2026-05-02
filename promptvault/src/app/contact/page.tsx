import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'Contact Us — Prompt Smith',
  description:
    'Reach Prompt Smith by email, phone, or WhatsApp. Operated by Pazhaniswamy Sundhar Ganesh, Coimbatore, Tamil Nadu.',
};

export default function ContactPage() {
  const whatsappLink = `https://wa.me/${BUSINESS.whatsappRaw}?text=${encodeURIComponent(
    'Hi, I have a question about Prompt Smith.',
  )}`;
  const telLink = `tel:${BUSINESS.phoneRaw}`;
  const mailLink = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
    'Prompt Smith — support enquiry',
  )}`;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {BUSINESS.policyEffectiveDate}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-slate-700">
          We typically reply within <strong>24 working hours</strong>. For the fastest
          response, email or WhatsApp us with your order ID (if any) and a clear
          description of the issue.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={mailLink}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
          >
            <div className="text-2xl">✉️</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900 group-hover:text-rose-600">
              {BUSINESS.email}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Best for receipts, refund queries, and anything requiring written follow-up.
            </p>
          </a>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="text-2xl">💬</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              WhatsApp
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900 group-hover:text-emerald-600">
              {BUSINESS.whatsapp}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Quickest channel during business hours. Tap to start a chat.
            </p>
          </a>

          <a
            href={telLink}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
          >
            <div className="text-2xl">📞</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Phone
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900 group-hover:text-rose-600">
              {BUSINESS.phone}
            </div>
            <p className="mt-2 text-sm text-slate-600">{BUSINESS.hours}</p>
          </a>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-2xl">📍</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Registered address
            </div>
            <address className="mt-1 not-italic text-sm leading-relaxed text-slate-900">
              {BUSINESS.legalName}
              <br />
              {BUSINESS.address.line1}
              <br />
              {BUSINESS.address.line2}
              <br />
              {BUSINESS.address.city}, {BUSINESS.address.state} – {BUSINESS.address.postal}
              <br />
              {BUSINESS.address.country}
            </address>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">Before you write to us</h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5">
            <li>
              Got a question about a specific purchase? Please include your{' '}
              <strong>order ID</strong> and the email used at checkout.
            </li>
            <li>
              Looking for our refund / return terms? See the{' '}
              <Link href="/refund" className="font-medium text-rose-600 hover:text-rose-700">
                Refund Policy
              </Link>{' '}
              and{' '}
              <Link href="/return" className="font-medium text-rose-600 hover:text-rose-700">
                Return Policy
              </Link>
              .
            </li>
            <li>
              Want to know who runs the business? See the{' '}
              <Link href="/about" className="font-medium text-rose-600 hover:text-rose-700">
                About page
              </Link>
              .
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
