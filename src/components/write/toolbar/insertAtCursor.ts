export type InsertMode = { kind: 'insert'; text: string } | { kind: 'wrap'; before: string; after: string; placeholder?: string };

type Args = {
  textareaId: string;
  value: string;
  setValue: (v: string) => void;
  mode: InsertMode;
  cursor?: 'end' | 'selectInserted';
};

export function insertAtCursor({ textareaId, value, setValue, mode, cursor = 'end' }: Args) {
  const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;

  const makeInserted = (selected: string) => {
    if (mode.kind === 'insert') return mode.text;
    const inner = selected.length > 0 ? selected : (mode.placeholder ?? '');
    return `${mode.before}${inner}${mode.after}`;
  };

  if (!el) {
    const inserted = makeInserted('');
    const prefix = value.length === 0 ? '' : value.endsWith('\n') ? '' : '\n';
    setValue(value + prefix + inserted);
    return;
  }

  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;

  const selected = value.slice(start, end);
  const inserted = makeInserted(selected);

  const next = value.slice(0, start) + inserted + value.slice(end);
  setValue(next);

  requestAnimationFrame(() => {
    el.focus();
    if (cursor === 'selectInserted') {
      el.setSelectionRange(start, start + inserted.length);
      return;
    }
    const pos = start + inserted.length;
    el.setSelectionRange(pos, pos);
  });
}
