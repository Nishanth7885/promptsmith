import Link from 'next/link';
import type { Category } from '@/types';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>{category.icon}</span>
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-rose-600">
            {category.name}
          </h3>
          <p className="text-xs text-slate-500">
            {category.subcategories.length} subcategories
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{category.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium" style={{ color: category.color }}>
          {category.totalPrompts.toLocaleString('en-IN')} prompts
        </span>
        <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-rose-600">
          Explore →
        </span>
      </div>
    </Link>
  );
}
