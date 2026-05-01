import Link from 'next/link';
import type { Prompt } from '@/types';

export default function RelatedPrompts({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-base font-semibold text-slate-900">Related prompts</h2>
      <ul className="mt-4 space-y-2">
        {prompts.map((p) => (
          <li key={p.id}>
            <Link
              href={`/prompt/${p.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-rose-300 hover:bg-rose-50"
            >
              <span className="font-medium text-slate-800">{p.title}</span>
              <span className="shrink-0 text-xs text-slate-500">{p.difficulty}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
