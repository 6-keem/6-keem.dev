'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  isUpdate?: boolean;
  loading?: boolean;
};

export default function PublishConfirmDialog({ open, onOpenChange, onConfirm, isUpdate, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? '수정사항을 게시할까요?' : '게시글을 공개할까요?'}</DialogTitle>
          <DialogDescription>
            게시 즉시 모든 방문자에게 글이 공개됩니다. 내용을 한 번 더 확인해 주세요.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-md px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '게시 중…' : isUpdate ? '게시하기' : '공개하기'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
