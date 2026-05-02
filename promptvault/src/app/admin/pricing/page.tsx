import { auth } from '@/auth';
import { getPricing, setSetting } from '@/lib/settings';
import { revalidatePath } from 'next/cache';

export const metadata = { title: 'Admin · Pricing' };
export const dynamic = 'force-dynamic';

async function updatePricing(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;

  const inr = String(formData.get('price_inr') ?? '').trim();
  const inrCategory = String(formData.get('price_inr_category') ?? '').trim();
  const usd = String(formData.get('price_usd') ?? '').trim();
  const productName = String(formData.get('product_name') ?? '').trim();
  const crossBorder = formData.get('cross_border_enabled') === 'on' ? 'true' : 'false';

  if (inr && !Number.isNaN(Number(inr))) await setSetting('price_inr', inr, session.user.id);
  if (inrCategory && !Number.isNaN(Number(inrCategory)))
    await setSetting('price_inr_category', inrCategory, session.user.id);
  if (usd && !Number.isNaN(Number(usd))) await setSetting('price_usd', usd, session.user.id);
  if (productName) await setSetting('product_name', productName, session.user.id);
  await setSetting('cross_border_enabled', crossBorder, session.user.id);

  revalidatePath('/admin/pricing');
  revalidatePath('/');
  // Category pages snapshot the per-category price at render time.
  revalidatePath('/category/[slug]', 'page');
}

export default async function PricingPage() {
  const pricing = await getPricing();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
      <p className="text-sm text-slate-600">
        These values feed every checkout in real time. Cross-border must stay <strong>off</strong> until your
        Cashfree cross-border approval lands; international visitors see the waitlist instead.
      </p>

      <form action={updatePricing} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">All-access INR (₹)</span>
            <span className="block text-xs text-slate-500">Lifetime, every category.</span>
            <input
              name="price_inr"
              type="number"
              step="1"
              min="0"
              defaultValue={pricing.inr}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Single-category INR (₹)</span>
            <span className="block text-xs text-slate-500">
              Per-category SKU + cart line price (₹ × N).
            </span>
            <input
              name="price_inr_category"
              type="number"
              step="1"
              min="0"
              defaultValue={pricing.inrCategory}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Price USD ($)</span>
            <span className="block text-xs text-slate-500">All-access only (cross-border).</span>
            <input
              name="price_usd"
              type="number"
              step="0.01"
              min="0"
              defaultValue={pricing.usd}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Product name (shown on checkout)</span>
          <input
            name="product_name"
            type="text"
            defaultValue={pricing.productName}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="cross_border_enabled"
            defaultChecked={pricing.crossBorderEnabled}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className="text-sm">
            <span className="font-medium">Cross-border enabled</span>{' '}
            <span className="text-slate-500">
              (turn ON only after Cashfree approves international payments)
            </span>
          </span>
        </label>

        <button
          type="submit"
          className="bg-slate-900 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-slate-800"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
