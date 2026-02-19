'use client';

import { useState } from 'react';
import { MessageSquareWarning } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import ColorDot from './ColorDot';
import IconToolButton from './IconToolButton';
import { insertAtCursor } from './insertAtCursor';
import { calloutSnippet } from './snippets';
import { CALLOUT_PREVIEW_CLASS, CALLOUT_TYPES, type CalloutType, type ToolbarButtonProps } from './types';

export default function CalloutButton({ content, setContent, textareaId }: ToolbarButtonProps) {
  const [type, setType] = useState<CalloutType>('normal');
  const [title, setTitle] = useState('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span>
          <IconToolButton icon={MessageSquareWarning} label="Callout" />
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-2">
          <Label>Type</Label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <ColorDot className={CALLOUT_PREVIEW_CLASS[type]} />
                  <span>{type}</span>
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64">
              {CALLOUT_TYPES.map((t) => (
                <DropdownMenuItem key={t} onSelect={() => setType(t)}>
                  <div className="flex w-full items-center justify-between">
                    <span>{t}</span>
                    <ColorDot className={CALLOUT_PREVIEW_CLASS[t]} />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='예: "주의"' />
        </div>

        <Button
          className="w-full"
          onClick={() => {
            const snippet = calloutSnippet({ type, title });
            insertAtCursor({
              textareaId,
              value: content,
              setValue: setContent,
              mode: { kind: 'insert', text: snippet },
            });
          }}
        >
          Insert
        </Button>
      </PopoverContent>
    </Popover>
  );
}
