'use client';

import { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2,
  Quote, Code, Image as ImageIcon, Eye, PenLine, Table,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Markdown rather than a WYSIWYG, deliberately.
 *
 * A rich-text editor stores whatever HTML it produced, which drifts between
 * versions and is painful to restyle later. Markdown stays portable, renders
 * identically on the server for SEO, diffs cleanly, and survives being moved
 * to another CMS. The toolbar means nobody has to remember the syntax.
 */
export default function MarkdownEditor({
  value, onChange, onRequestImage,
}: {
  value: string;
  onChange: (v: string) => void;
  onRequestImage?: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  /** Wraps the selection, or inserts a placeholder if nothing is selected. */
  function surround(before: string, after = before, placeholder = 'text') {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  }

  /** Prefixes each line of the selection — for lists, quotes and headings. */
  function prefixLines(prefix: string | ((i: number) => string)) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const block = value.slice(lineStart, e) || 'text';
    const next =
      value.slice(0, lineStart) +
      block.split('\n').map((l, i) => (typeof prefix === 'string' ? prefix : prefix(i)) + l).join('\n') +
      value.slice(e);
    onChange(next);
    requestAnimationFrame(() => el.focus());
  }

  const TOOLS = [
    { label: 'Bold',           Icon: Bold,        run: () => surround('**', '**', 'bold text') },
    { label: 'Italic',         Icon: Italic,      run: () => surround('_', '_', 'italic text') },
    { label: 'Heading 2',      Icon: Heading2,    run: () => prefixLines('## ') },
    { label: 'Heading 3',      Icon: Heading3,    run: () => prefixLines('### ') },
    { label: 'Bulleted list',  Icon: List,        run: () => prefixLines('- ') },
    { label: 'Numbered list',  Icon: ListOrdered, run: () => prefixLines((i) => `${i + 1}. `) },
    { label: 'Quote',          Icon: Quote,       run: () => prefixLines('> ') },
    { label: 'Link',           Icon: Link2,       run: () => surround('[', '](https://)', 'link text') },
    { label: 'Code',           Icon: Code,        run: () => surround('`', '`', 'code') },
    { label: 'Table',          Icon: Table,       run: () => onChange(value + '\n\n| Column | Column |\n| --- | --- |\n| Value | Value |\n') },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-100 bg-ink-50 px-2 py-2">
        {TOOLS.map(({ label, Icon, run }) => (
          <button
            key={label} type="button" onClick={run} title={label} aria-label={label}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-white hover:text-gold-700"
          >
            <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </button>
        ))}

        {onRequestImage && (
          <button
            type="button" onClick={onRequestImage} title="Insert image" aria-label="Insert image"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-white hover:text-gold-700"
          >
            <ImageIcon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </button>
        )}

        <div className="ml-auto flex rounded-lg bg-white p-1">
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t} type="button" onClick={() => setTab(t)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[0.8rem] transition-colors',
                tab === t ? 'bg-ink text-white' : 'text-ink-500 hover:text-ink',
              )}
            >
              {t === 'write'
                ? <><PenLine className="h-3.5 w-3.5" aria-hidden /> Write</>
                : <><Eye className="h-3.5 w-3.5" aria-hidden /> Preview</>}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            // Tab should indent, not escape the field mid-sentence.
            if (e.key === 'Tab') {
              e.preventDefault();
              surround('  ', '', '');
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); surround('**', '**', 'bold text'); }
            if ((e.metaKey || e.ctrlKey) && e.key === 'i') { e.preventDefault(); surround('_', '_', 'italic text'); }
          }}
          spellCheck
          placeholder={'Write the article here.\n\n## A heading\n\nA paragraph. **Bold** and _italic_ work as you would expect.\n\n- A list item\n- Another\n\n> A pull quote.'}
          className="min-h-[34rem] w-full resize-y border-0 p-6 font-mono text-[0.9rem] leading-relaxed text-ink focus:outline-none"
        />
      ) : (
        <div className="min-h-[34rem] overflow-y-auto p-6 sm:p-8">
          {value.trim() ? (
            <div className="prose prose-aeprose max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
            </div>
          ) : (
            <p className="py-20 text-center text-ink-400">Nothing to preview yet.</p>
          )}
        </div>
      )}

      <p className="border-t border-ink-100 bg-ink-50 px-4 py-2 text-[0.74rem] text-ink-400">
        Markdown supported · {value.trim().split(/\s+/).filter(Boolean).length} words
      </p>
    </div>
  );
}
