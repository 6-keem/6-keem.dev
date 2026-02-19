'use client';

import { Quote } from 'lucide-react';
import IconToolButton from './IconToolButton';
import { insertAtCursor } from './insertAtCursor';
import { quotationSnippet } from './snippets';
import { ToolbarButtonProps } from './types';

export default function QuotationButton({ content, setContent, textareaId }: ToolbarButtonProps) {
  return (
    <IconToolButton
      icon={Quote}
      label="Quotation"
      onClick={() => {
        insertAtCursor({
          textareaId,
          value: content,
          setValue: setContent,
          mode: { kind: 'insert', text: quotationSnippet() },
        });
      }}
    />
  );
}
