import Link from 'next/link';
import { ResetRequestForm } from './ResetRequestForm';

export const metadata = { title: 'Reset your password' };

export default function ResetRequestPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="text-sm text-slate-600 mt-1">Enter your email — we'll send a reset link.</p>
      <ResetRequestForm />
      <p className="text-sm text-slate-600 mt-6 text-center">
        <Link href="/login" className="font-medium text-slate-900 underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
