'use client';

import ChevronIcon from './ChevronIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const baseBtn =
    'w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors';

  return (
    <div className="flex items-center justify-center gap-1 pt-10">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => canPrev && onChange(currentPage - 1)}
        className={`${baseBtn} ${
          canPrev ? 'text-muted-foreground hover:bg-secondary' : 'text-muted-foreground/40 cursor-default'
        }`}
        aria-label="이전 페이지"
      >
        <ChevronIcon direction="left" size={14} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`${baseBtn} ${
            p === currentPage
              ? 'bg-secondary text-foreground font-bold'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={!canNext}
        onClick={() => canNext && onChange(currentPage + 1)}
        className={`${baseBtn} ${
          canNext ? 'text-muted-foreground hover:bg-secondary' : 'text-muted-foreground/40 cursor-default'
        }`}
        aria-label="다음 페이지"
      >
        <ChevronIcon direction="right" size={14} />
      </button>
    </div>
  );
}
