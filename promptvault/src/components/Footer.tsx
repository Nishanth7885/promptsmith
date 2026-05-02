import Link from 'next/link';
import { BUSINESS } from '@/lib/business';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-base font-bold">
            <span className="rounded-md bg-gradient-to-br from-orange-500 via-rose-500 to-emerald-600 px-2 py-1 text-white">
              PS
            </span>
            Prompt Smith
          </div>
          <p className="mt-3 text-sm text-slate-600">
            4,000+ copy-paste-ready AI prompts for every profession. Built for ChatGPT,
            Claude, Gemini and any LLM.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Operated by {BUSINESS.legalName}, Coimbatore, Tamil Nadu, India.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/browse" className="hover:text-rose-600">All categories</Link></li>
            <li><Link href="/search" className="hover:text-rose-600">Search prompts</Link></li>
            <li><Link href="/preview" className="hover:text-rose-600">Free 50-prompt preview</Link></li>
            <li><Link href="/#pricing" className="hover:text-rose-600">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/#faq" className="hover:text-rose-600">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-rose-600">Contact us</Link></li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-rose-600">
                {BUSINESS.email}
              </a>
            </li>
            <li>
              <a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-rose-600">
                {BUSINESS.phone}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/about" className="hover:text-rose-600">About us</Link></li>
            <li><Link href="/refund" className="hover:text-rose-600">Refund policy</Link></li>
            <li><Link href="/return" className="hover:text-rose-600">Return policy</Link></li>
            <li><Link href="/privacy" className="hover:text-rose-600">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-rose-600">Terms of use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Prompt Smith · {BUSINESS.domain}
      </div>
    </footer>
  );
}
