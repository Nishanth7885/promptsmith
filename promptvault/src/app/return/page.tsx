import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'Return Policy — Prompt Smith',
  description:
    'Prompt Smith sells digital, non-tangible AI prompts. Returns are not applicable. All sales are final.',
};

export default function ReturnPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Return Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {BUSINESS.policyEffectiveDate}
        </p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[15px] leading-relaxed text-amber-900">
          <strong>Returns are not applicable.</strong> {BUSINESS.brand} sells digital
          products only. Nothing is shipped, and there is nothing to return.
        </div>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Nature of the product</h2>
            <p className="mt-3">
              Every item sold on {BUSINESS.domain} is a <strong>digital, non-tangible
              good</strong> — a licence to access the {BUSINESS.brand} prompt library
              online and to download a structured ZIP archive of the prompts for offline
              use. No physical goods are despatched and no courier or postal service is
              involved.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. No physical returns</h2>
            <p className="mt-3">
              Because the product is digital, the concept of a “return” does not apply.
              Once access has been granted, the buyer cannot un-download or surrender
              the licence in a way that meaningfully restores the seller&rsquo;s position.
              For this reason, all sales are final.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Delivery of the product</h2>
            <p className="mt-3">
              Access to the prompt library and the offline ZIP is granted instantly the
              moment your payment is captured by Cashfree. The receipt is e-mailed to the
              address used at checkout. There is no shipping fee, no shipping address,
              and no waiting period for delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. If something is wrong</h2>
            <p className="mt-3">
              If you cannot access the library after a successful payment, or the ZIP
              fails to download, please contact us within <strong>7 days</strong> of your
              purchase. We will re-grant access or send the ZIP directly. See our{' '}
              <Link href="/refund" className="font-medium text-rose-600 hover:text-rose-700">
                Refund &amp; Cancellation Policy
              </Link>{' '}
              for the full process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Contact</h2>
            <p className="mt-3">
              Email{' '}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.email}
              </a>{' '}
              or call / WhatsApp{' '}
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.phone}
              </a>
              . More options on the{' '}
              <Link href="/contact" className="font-medium text-rose-600 hover:text-rose-700">
                Contact page
              </Link>
              .
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm">
            <p>
              This policy is issued by <strong>{BUSINESS.legalName}</strong>{' '}
              ({BUSINESS.ownerTitle}), trading as <strong>{BUSINESS.brand}</strong>, with
              registered address: {BUSINESS.address.line1}, {BUSINESS.address.line2},{' '}
              {BUSINESS.address.city}, {BUSINESS.address.state} –{' '}
              {BUSINESS.address.postal}, {BUSINESS.address.country}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
