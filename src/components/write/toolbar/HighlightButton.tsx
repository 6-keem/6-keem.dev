'use client';

import { Highlighter } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import ColorDot from './ColorDot';
import IconToolButton from './IconToolButton';
import { insertAtCursor } from './insertAtCursor';
import { highlightWrap } from './snippets';
import { HIGHLIGHT_COLORS, HIGHLIGHT_PREVIEW_RGBA, type HighlightColor, type ToolbarButtonProps } from './types';

export default function HighlightButton({ content, setContent, textareaId }: ToolbarButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>
          <IconToolButton icon={Highlighter} label="Highlight" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        {HIGHLIGHT_COLORS.map((color) => (
          <DropdownMenuItem
            key={color}
            onSelect={() => {
              const wrap = highlightWrap(color as HighlightColor);
              insertAtCursor({
                textareaId,
                value: content,
                setValue: setContent,
                mode: {
                  kind: 'wrap',
                  before: wrap.before,
                  after: wrap.after,
                  placeholder: wrap.placeholder,
                },
              });
            }}
          >
            <div className="flex w-full items-center justify-between">
              <span>{color}</span>
              <ColorDot style={{ backgroundColor: HIGHLIGHT_PREVIEW_RGBA[color] }} />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
