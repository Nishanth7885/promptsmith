import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/business';

export const metadata = {
  title: 'Privacy Policy — Prompt Smith',
  description:
    'How Prompt Smith collects, uses, stores, and protects your personal data — DPDP-aligned.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {BUSINESS.policyEffectiveDate}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
          <section>
            <p>
              This Privacy Policy explains what personal data <strong>{BUSINESS.brand}</strong>{' '}
              ({BUSINESS.domain}) collects, why we collect it, how we use it, and the rights
              you have over it. Prompt Smith is operated by <strong>{BUSINESS.legalName}</strong>{' '}
              ({BUSINESS.ownerTitle}), Coimbatore, Tamil Nadu, India. We act as the{' '}
              <strong>data fiduciary</strong> under India&apos;s Digital Personal Data
              Protection Act, 2023 (DPDP Act).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. What we collect</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5">
              <li>
                <strong>Account data:</strong> name (optional), email address, hashed password,
                phone number (only if you provide one at checkout), email-verification status.
              </li>
              <li>
                <strong>Order data:</strong> order ID, currency (INR), amount, payment method
                (UPI / card / netbanking — what Cashfree returns to us), order status, paid-at
                timestamp. We never see or store your card or UPI credentials.
              </li>
              <li>
                <strong>Coupon usage:</strong> if you applied a coupon, we record the code and
                the redemption.
              </li>
              <li>
                <strong>Auth tokens:</strong> single-use, hashed tokens for email verification
                and password reset.
              </li>
              <li>
                <strong>Usage logs:</strong> page-view timestamps, hashed IP, country, referer,
                user agent. Used for traffic analytics and abuse prevention.
              </li>
              <li>
                <strong>Cookies / sessions:</strong> a session cookie from Auth.js to keep you
                logged in; a localStorage flag for legacy device-bound access.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Why we collect it</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5">
              <li>To create your account and grant access to the prompt library you bought.</li>
              <li>To process payment via Cashfree and email you a receipt.</li>
              <li>To verify your email and recover your account if you lose access.</li>
              <li>To detect abuse, fraud, and breach attempts.</li>
              <li>
                To improve the product (which prompts get used, which categories get traffic).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Who we share it with</h2>
            <p className="mt-3">
              We share the minimum data required, only with these processors:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1.5">
              <li>
                <strong>Cashfree Payments India Pvt. Ltd.</strong> — to process your payment.
                Receives your name, email, phone, order amount, and order ID. Cashfree is an
                RBI-licensed Payment Aggregator and stores your payment-instrument details under
                its own privacy policy and PCI-DSS controls; we never see them.
              </li>
              <li>
                <strong>Resend (Resend Inc., USA)</strong> — to deliver transactional emails
                (verification, password reset, receipts). Receives your email address and the
                email body.
              </li>
              <li>
                <strong>Google LLC</strong> — only if you choose &ldquo;Continue with Google.&rdquo;
                Google sees that you used their account to log in; we receive your email and
                name from Google.
              </li>
              <li>
                <strong>Cloud hosting provider</strong> — our server runs on a Google Cloud VM in
                Mumbai (asia-south1). Database and logs reside on that VM&apos;s SSD.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell or rent your data to third parties. We do not run
              ad networks, retargeting pixels, or third-party analytics scripts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Where we store it</h2>
            <p className="mt-3">
              Account, order, and usage data is stored in a SQLite database on our server in
              India. Backups are encrypted at rest. Cashfree may store payment-related data in
              its own systems in India under its own privacy policy. Resend stores email logs
              in its US infrastructure for up to 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. How long we keep it</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5">
              <li>Account data — for as long as your account is active.</li>
              <li>
                Order data — minimum 8 years from the order date (Indian tax + audit
                requirements under GST and the Companies Act).
              </li>
              <li>Auth tokens — until consumed or 24 hours, whichever comes first.</li>
              <li>Page-view logs — 12 months, then aggregated and the raw rows deleted.</li>
              <li>Email-delivery logs (Resend) — 30 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Your rights (DPDP Act)</h2>
            <p className="mt-3">
              You have the right to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1.5">
              <li>Access a copy of the personal data we hold about you.</li>
              <li>Correct inaccurate data we hold.</li>
              <li>Erase your account and associated personal data — subject to the retention requirements in §5 (e.g. tax records).</li>
              <li>Withdraw consent for any optional processing (such as analytics).</li>
              <li>Nominate a representative to exercise these rights on your behalf in case of incapacity or death.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, write to{' '}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                {BUSINESS.email}
              </a>{' '}
              from the email address on the account. We respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Security</h2>
            <p className="mt-3">
              Passwords are hashed with bcrypt. Auth tokens are hashed before storage. The site
              runs on HTTPS only with a Let&apos;s Encrypt certificate. The server SSH is
              key-only. Database backups are stored encrypted. We do not log Cashfree
              credentials or full card numbers — those never reach our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Children</h2>
            <p className="mt-3">
              Prompt Smith is not directed at children under 18. We do not knowingly collect
              data from minors. If you believe a minor has signed up, write to us and we will
              delete the account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Changes to this Policy</h2>
            <p className="mt-3">
              We may update this Policy as the product evolves or as the law changes. We will
              post the revised version with an updated &ldquo;Last updated&rdquo; date and, for
              material changes affecting how your data is used, notify registered users by
              email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Grievances</h2>
            <p className="mt-3">
              For any privacy or data-protection grievance, contact our grievance officer:
            </p>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div><strong>Grievance Officer:</strong> {BUSINESS.legalName}</div>
              <div><strong>Email:</strong> {BUSINESS.email}</div>
              <div><strong>Phone / WhatsApp:</strong> {BUSINESS.phone}</div>
              <div><strong>Hours:</strong> {BUSINESS.hours}</div>
            </div>
            <p className="mt-3">
              We acknowledge grievances within 48 hours and resolve within 30 days under DPDP
              Act timelines.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm">
            <p>
              This Policy is issued by <strong>{BUSINESS.legalName}</strong>{' '}
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
