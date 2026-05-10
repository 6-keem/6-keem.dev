'use client';
import CalloutButton from './CalloutButton';
import HighlightButton from './HighlightButton';
import { ToolbarTooltipProvider } from './IconToolButton';
import QuotationButton from './QuotationButton';
import TableButton from './TableButton';
import YouTubeButton from './YouTubeButton';

type EditorToolbarProps = {
  content: string;
  setContent: (v: string) => void;
  textareaId?: string;
};

export default function EditorToolbar({ content, setContent, textareaId = 'post-content-textarea' }: EditorToolbarProps) {
  return (
    <ToolbarTooltipProvider>
      <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-background/60 p-1">
        <CalloutButton content={content} setContent={setContent} textareaId={textareaId} />
        <QuotationButton content={content} setContent={setContent} textareaId={textareaId} />
        <HighlightButton content={content} setContent={setContent} textareaId={textareaId} />
        <TableButton content={content} setContent={setContent} textareaId={textareaId} />
        <YouTubeButton content={content} setContent={setContent} textareaId={textareaId} />
      </div>
    </ToolbarTooltipProvider>
  );
}
