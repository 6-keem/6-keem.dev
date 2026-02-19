'use client';

import { useState } from 'react';
import { Table2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import IconToolButton from './IconToolButton';
import { insertAtCursor } from './insertAtCursor';
import { markdownTable } from './snippets';
import type { ToolbarButtonProps } from './types';

export default function TableButton({ content, setContent, textareaId }: ToolbarButtonProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span>
          <IconToolButton icon={Table2} label="Table" />
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-64 space-y-4">
        <div className="space-y-2">
          <Label>Rows</Label>
          <Input type="number" min={2} max={30} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
        </div>

        <div className="space-y-2">
          <Label>Cols</Label>
          <Input type="number" min={2} max={12} value={cols} onChange={(e) => setCols(Number(e.target.value))} />
        </div>

        <Button
          className="w-full"
          onClick={() => {
            insertAtCursor({
              textareaId,
              value: content,
              setValue: setContent,
              mode: { kind: 'insert', text: markdownTable(rows, cols) },
            });
          }}
        >
          Insert
        </Button>
      </PopoverContent>
    </Popover>
  );
}
