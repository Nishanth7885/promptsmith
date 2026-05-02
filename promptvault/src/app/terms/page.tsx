import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'Terms & Conditions — Prompt Smith',
  description:
    'Terms and conditions for using Prompt Smith — operated by Pazhaniswamy Sundhar Ganesh, Coimbatore.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {BUSINESS.policyEffectiveDate}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
          <section>
            <p>
              These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of{' '}
              <strong>{BUSINESS.brand}</strong> ({BUSINESS.domain}), a digital prompt-library
              service operated by <strong>{BUSINESS.legalName}</strong> ({BUSINESS.ownerTitle}),
              with registered address at {BUSINESS.address.line1}, {BUSINESS.address.line2},{' '}
              {BUSINESS.address.city}, {BUSINESS.address.state} – {BUSINESS.address.postal},{' '}
              {BUSINESS.address.country}. By accessing the website, signing up, or completing a
              purchase, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. The service</h2>
            <p className="mt-3">
              Prompt Smith sells a one-time-purchase, lifetime-access licence to a curated
              library of professionally-written AI prompts that work with ChatGPT, Claude,
              Gemini, and any other large language model. The licence grants you the right to
              use the prompts for your personal or business work. You do not receive any
              physical goods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Pricing &amp; payment</h2>
            <p className="mt-3">
              All prices on the website are listed in <strong>Indian Rupees (INR, ₹)</strong>{' '}
              and are inclusive of applicable taxes. Payments are processed by{' '}
              <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-licensed Payment
              Aggregator. We do not store, process, or have access to your card, UPI, or
              net-banking credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Account &amp; access</h2>
            <p className="mt-3">
              To complete a purchase you must create an account using a valid email address and
              verify it via the link we send. You are responsible for keeping your password
              confidential and for all activity under your account. Notify us immediately if
              you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Permitted use</h2>
            <p className="mt-3">You may:</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5">
              <li>Copy any prompt from the library and paste it into any AI tool you use.</li>
              <li>Modify a prompt for your own work.</li>
              <li>Use the AI output for personal or commercial purposes you control.</li>
            </ul>
            <p className="mt-3">You may NOT:</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5">
              <li>Resell, redistribute, or republish the prompt library — in whole or in part.</li>
              <li>Share your account credentials or your downloaded ZIP with others.</li>
              <li>Build a competing prompt-library product using our content as the substrate.</li>
              <li>Scrape the website with automated tools beyond standard crawler etiquette.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Refunds &amp; returns</h2>
            <p className="mt-3">
              All sales are final. Because the product is digital and instantly accessible, we
              do not offer refunds or returns once a payment has been completed. Full terms on
              our{' '}
              <Link href="/refund" className="font-medium text-rose-600 hover:text-rose-700">
                Refund Policy
              </Link>{' '}
              and{' '}
              <Link href="/return" className="font-medium text-rose-600 hover:text-rose-700">
                Return Policy
              </Link>{' '}
              pages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Intellectual property</h2>
            <p className="mt-3">
              The prompt library, the website design, the source code, and all related
              materials are the intellectual property of {BUSINESS.legalName}. We grant you a
              non-exclusive, non-transferable, lifetime licence to use the prompts as described
              in §4 above. We retain all rights not expressly granted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. AI output disclaimer</h2>
            <p className="mt-3">
              We do not generate or own the output that AI tools produce when you run our
              prompts. AI output may contain inaccuracies, biases, or hallucinations. You are
              solely responsible for reviewing, fact-checking, and using AI output
              appropriately — especially in regulated domains (legal, medical, financial,
              compliance). Prompt Smith makes no warranty about the suitability of AI output
              for any specific purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Limitation of liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, {BUSINESS.legalName} shall not be liable
              for any indirect, incidental, consequential, or punitive damages arising out of
              your use of the service. Our total liability for any claim is limited to the
              amount you paid for the product in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Termination</h2>
            <p className="mt-3">
              We may suspend or terminate your account if you breach these Terms — including
              redistribution, scraping, abuse, or fraudulent payments. On termination your
              licence to access the prompt library ends. Sections 4 (permitted use), 6 (IP),
              7 (AI disclaimer), and 8 (liability) survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Changes to these Terms</h2>
            <p className="mt-3">
              We may update these Terms from time to time. We will post the revised version
              with an updated &ldquo;Last updated&rdquo; date and, for material changes, notify
              registered users by email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">11. Governing law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of India. Any dispute arising out of or in
              connection with the service shall be subject to the exclusive jurisdiction of the
              courts at <strong>Coimbatore, Tamil Nadu</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">12. Contact</h2>
            <p className="mt-3">
              Questions about these Terms? Email us at{' '}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.email}
              </a>{' '}
              or visit the{' '}
              <Link href="/contact" className="font-medium text-rose-600 hover:text-rose-700">
                Contact page
              </Link>
              .
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm">
            <p>
              These Terms are issued by <strong>{BUSINESS.legalName}</strong>{' '}
              ({BUSINESS.ownerTitle}), trading as <strong>{BUSINESS.brand}</strong>, registered
              address: {BUSINESS.address.line1}, {BUSINESS.address.line2},{' '}
              {BUSINESS.address.city}, {BUSINESS.address.state} – {BUSINESS.address.postal},{' '}
              {BUSINESS.address.country}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
