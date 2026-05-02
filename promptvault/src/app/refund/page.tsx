import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'Refund & Cancellation Policy — Prompt Smith',
  description:
    'All sales are final. Prompt Smith sells digital, instantly-delivered AI prompts and does not offer refunds or cancellations.',
};

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {BUSINESS.policyEffectiveDate}
        </p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[15px] leading-relaxed text-amber-900">
          <strong>All sales are final.</strong> {BUSINESS.brand} is a digital-only product
          and we do <strong>not</strong> offer refunds or cancellations once payment has
          been completed.
        </div>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Why no refunds</h2>
            <p className="mt-3">
              {BUSINESS.brand} delivers a downloadable, instantly-consumable digital
              product — a library of AI prompts plus an offline ZIP archive. Once a
              buyer has been granted access, the prompts can be copied, downloaded, and
              re-used indefinitely. For this reason, and in line with industry practice
              for digital intellectual property, we treat every successful payment as a
              final sale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Cancellation before payment</h2>
            <p className="mt-3">
              You can cancel a checkout at any time before your payment is captured by
              Cashfree. Simply close the checkout window. No charge will be made and no
              order will be created in our system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Failed or duplicate payments</h2>
            <p className="mt-3">
              If your bank shows a debit but you did <strong>not</strong> receive access
              to the prompt library, it is almost always a payment that failed at the
              gateway and will be auto-reversed by your bank or card issuer within{' '}
              <strong>5 – 7 working days</strong>. If the amount is not reversed in that
              window, write to us at{' '}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.email}
              </a>{' '}
              with your bank statement reference and we will help you raise a chargeback
              with Cashfree. The same applies to genuine duplicate charges for the same
              order ID.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Access issues we will fix</h2>
            <p className="mt-3">
              While we do not refund, we are committed to ensuring you actually receive
              what you paid for. Contact us within <strong>7 days</strong> of purchase if:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1.5">
              <li>You completed payment but cannot log in or download the ZIP.</li>
              <li>Your receipt email did not arrive.</li>
              <li>The product page is broken or content is missing on our end.</li>
            </ul>
            <p className="mt-3">
              We will resolve any such issue at no cost — by re-granting access,
              re-issuing the receipt, or sending the ZIP directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Coupons and promotional pricing</h2>
            <p className="mt-3">
              Discounts applied through coupon codes or limited-time offers cannot be
              applied retroactively to a completed order, and the difference is not
              refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. How to reach us</h2>
            <p className="mt-3">
              For any refund-policy enquiry, write to us at{' '}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.email}
              </a>{' '}
              or call / WhatsApp us at{' '}
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.phone}
              </a>
              . Full details are on our{' '}
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
