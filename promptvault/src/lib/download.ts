'use client';

// Client-side ZIP builder. Bundles all 4,929 prompts into a structured archive
// that the customer can keep offline. Runs entirely in the browser using
// JSZip, so we don't need a server-side download endpoint (which is helpful
// because that lets the static-frontend deploy stay independent if we ever
// move to one).
import JSZip from 'jszip';
import type { Prompt, Category } from '@/types';

const README = `Prompt Smith — 4,000+ AI Prompts
================================

Thank you for buying! This archive contains every prompt you have access to,
organised three ways for offline use:

1. ALL-PROMPTS.json  — single JSON file with the entire library.
2. ALL-PROMPTS.md    — single Markdown file, browsable in any editor.
3. categories/<n>-<category>/<subcategory>.md — one Markdown file per
   subcategory, organised by category.

Use any of them with ChatGPT, Claude, Gemini, Copilot, Perplexity, Grok, or
any LLM. Copy-paste a prompt as-is, fill in the [bracketed inputs] where the
prompt asks you to, and run.

What's inside
-------------
- 37 categories (Students, Doctors, CAs, Software, Marketing, …)
- 178 subcategories
- {COUNT} prompts total

Updates
-------
We refresh the library every quarter. Re-download from your account page on
promptsmith.ink to grab the latest pack — your purchase covers lifetime updates.

Need help? digitalhub.admin@gmail.com · WhatsApp +91 73395 45363
`;

function escapeMd(s: string): string {
  return s.replace(/\|/g, '\\|');
}

function promptToMarkdown(p: Prompt): string {
  const tags = p.tags.map((t) => `\`${t}\``).join(', ');
  return [
    `### ${escapeMd(p.title)}`,
    '',
    `**Difficulty:** ${p.difficulty} · **AI tool:** ${p.aiTool} · **Output:** ${p.outputType}${p.isFree ? ' · **Preview**' : ''}`,
    `**Tags:** ${tags}`,
    '',
    '> ' + p.prompt.replace(/\n/g, '\n> '),
    '',
    '---',
    '',
  ].join('\n');
}

export interface BuildArgs {
  prompts: Prompt[];
  categories: Category[];
  buyerEmail?: string | null;
  orderId?: string | null;
}

export async function buildPromptZip({
  prompts,
  categories,
  buyerEmail,
  orderId,
}: BuildArgs): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder('Prompt-Smith')!;

  // README
  root.file(
    'README.md',
    README.replace('{COUNT}', prompts.length.toLocaleString('en-IN')) +
      (buyerEmail ? `\nLicensed to: ${buyerEmail}\n` : '') +
      (orderId ? `Order: ${orderId}\n` : '') +
      `Generated: ${new Date().toISOString()}\n`,
  );

  // Single JSON
  root.file('ALL-PROMPTS.json', JSON.stringify(prompts, null, 2));

  // Single Markdown
  const allMd = [
    '# Prompt Smith — Complete Library',
    '',
    `Total: ${prompts.length} prompts · ${categories.length} categories.`,
    '',
    ...categories.map((cat) => {
      const inCat = prompts.filter((p) => p.category === cat.slug);
      if (inCat.length === 0) return '';
      const subSections = cat.subcategories
        .map((sc) => {
          const inSub = inCat.filter((p) => p.subcategory === sc.slug);
          if (inSub.length === 0) return '';
          return [
            `## ${cat.icon} ${cat.name} → ${sc.icon} ${sc.name}`,
            '',
            ...inSub.map(promptToMarkdown),
          ].join('\n');
        })
        .filter(Boolean);
      return subSections.join('\n');
    }),
  ].join('\n');
  root.file('ALL-PROMPTS.md', allMd);

  // Per-subcategory files
  const cats = root.folder('categories')!;
  categories.forEach((cat, idx) => {
    const inCat = prompts.filter((p) => p.category === cat.slug);
    if (inCat.length === 0) return;
    const catFolder = cats.folder(`${String(idx + 1).padStart(2, '0')}-${cat.slug}`)!;
    for (const sc of cat.subcategories) {
      const inSub = inCat.filter((p) => p.subcategory === sc.slug);
      if (inSub.length === 0) continue;
      const md = [
        `# ${cat.icon} ${cat.name} — ${sc.icon} ${sc.name}`,
        '',
        sc.description,
        '',
        `**Prompts:** ${inSub.length}`,
        '',
        '---',
        '',
        ...inSub.map(promptToMarkdown),
      ].join('\n');
      catFolder.file(`${sc.slug}.md`, md);
    }
  });

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}

export function triggerBrowserDownload(blob: Blob, filename = 'Prompt-Smith.zip'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
