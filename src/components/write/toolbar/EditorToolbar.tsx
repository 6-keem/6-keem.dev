'use client';
import CalloutButton from './CalloutButton';
import HighlightButton from './HighlightButton';
import { ToolbarTooltipProvider } from './IconToolButton';
import QuotationButton from './QuotationButton';
import TableButton from './TableButton';

type EditorToolbarProps = {
  content: string;
  setContent: (v: string) => void;
  textareaId?: string;
};

export default function EditorToolbar({ content, setContent, textareaId = 'post-content-textarea' }: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-30 -mx-8 border-b border-border bg-card/80 backdrop-blur px-8 py-2.5">
      <ToolbarTooltipProvider>
        <div className="flex flex-wrap items-center gap-2">
          <CalloutButton content={content} setContent={setContent} textareaId={textareaId} />
          <QuotationButton content={content} setContent={setContent} textareaId={textareaId} />
          <HighlightButton content={content} setContent={setContent} textareaId={textareaId} />
          <TableButton content={content} setContent={setContent} textareaId={textareaId} />
        </div>
      </ToolbarTooltipProvider>
    </div>
  );
}
