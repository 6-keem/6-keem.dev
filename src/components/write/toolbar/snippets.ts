import type { CalloutType, HighlightColor } from './types';

export function calloutSnippet(opts: { type: CalloutType; title?: string; body?: string }) {
  const { type, title, body } = opts;

  const typeAttr = ` type="${type}"`;
  const titleAttr = title?.trim() ? ` title="${escapeAttr(title.trim())}"` : '';

  const inner = (body ?? '내용을 적어주세요.').trim();

  return [`<Callout${typeAttr}${titleAttr}>`, inner, `</Callout>`, ``].join('\n');
}

export function quotationSnippet(body = '인용문을 적어주세요.') {
  return [`<Quotation>`, body.trim(), `</Quotation>`, ``].join('\n');
}

export function highlightWrap(color: HighlightColor) {
  return {
    before: `<Highlight color="${color}">`,
    after: `</Highlight>`,
    placeholder: '강조할 텍스트',
  } as const;
}

export function markdownTable(rows: number, cols: number) {
  const r = clampInt(rows, 2, 30);
  const c = clampInt(cols, 2, 12);

  const header = `| ${Array.from({ length: c }, (_, i) => `헤더${i + 1}`).join(' | ')} |`;
  const sep = `| ${Array.from({ length: c }, () => `---`).join(' | ')} |`;

  const body = Array.from({ length: r - 1 }, () => {
    return `| ${Array.from({ length: c }, (_, i) => `값${i + 1}`).join(' | ')} |`;
  }).join('\n');

  return [header, sep, body, ''].join('\n');
}

function clampInt(n: number, min: number, max: number) {
  const v = Number.isFinite(n) ? Math.floor(n) : min;
  return Math.max(min, Math.min(max, v));
}

function escapeAttr(s: string) {
  return s.replaceAll(`"`, '&quot;');
}
