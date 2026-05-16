'use client';

import { BookMarked } from 'lucide-react';
import IconToolButton from './IconToolButton';
import { insertAtCursor } from './insertAtCursor';
import { referencesSnippet } from './snippets';
import { ToolbarButtonProps } from './types';

export default function ReferencesButton({ content, setContent, textareaId }: ToolbarButtonProps) {
  return (
    <IconToolButton
      icon={BookMarked}
      label="References"
      onClick={() => {
        insertAtCursor({
          textareaId,
          value: content,
          setValue: setContent,
          mode: { kind: 'insert', text: referencesSnippet() },
        });
      }}
    />
  );
}
