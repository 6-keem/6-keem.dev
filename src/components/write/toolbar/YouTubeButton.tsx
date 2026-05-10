'use client';

import { Youtube } from 'lucide-react';
import IconToolButton from './IconToolButton';
import { insertAtCursor } from './insertAtCursor';
import { youtubeSnippet } from './snippets';
import { ToolbarButtonProps } from './types';

export default function YouTubeButton({ content, setContent, textareaId }: ToolbarButtonProps) {
  return (
    <IconToolButton
      icon={Youtube}
      label="YouTube"
      onClick={() => {
        insertAtCursor({
          textareaId,
          value: content,
          setValue: setContent,
          mode: { kind: 'insert', text: youtubeSnippet() },
        });
      }}
    />
  );
}
