'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  postId: number;
  className?: string;
};

export default function DeletePostButton({ postId, className }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onConfirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: '삭제 실패' }));
        throw new Error(message ?? '삭제 실패');
      }
      toast.success('글이 삭제되었습니다');
      setOpen(false);
      router.push('/');
      router.refresh();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? '글 삭제 실패');
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="이 글 삭제"
        className={className}
      >
        <Trash2 className="h-4 w-4" />
        <span>삭제</span>
      </button>

      <Dialog open={open} onOpenChange={(v) => !deleting && setOpen(v)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>이 글을 삭제할까요?</DialogTitle>
            <DialogDescription>
              삭제하면 되돌릴 수 없어요. 본문, 조회수 기록, Hero 노출 설정이 모두 함께 사라집니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={deleting}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/70 hover:bg-accent disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-50"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
