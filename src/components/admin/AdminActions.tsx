import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { checkPermission } from '@/lib/auth';
import DeletePostButton from './DeletePostButton';

type Props = {
  postId?: number | null;
};

export default async function AdminActions({ postId }: Props) {
  const isAdmin = await checkPermission();
  if (!isAdmin) return null;

  const buttonBase =
    'group flex w-36 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold no-underline shadow-lg transition-all';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {postId != null && (
        <>
          <DeletePostButton
            postId={postId}
            className={`${buttonBase} border border-red-500/50 bg-background/90 text-red-600 backdrop-blur hover:bg-red-600 hover:text-white dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white`}
          />
          <Link
            href={`/editor?id=${postId}`}
            aria-label="이 글 수정"
            className={`${buttonBase} border border-border bg-background/90 text-foreground backdrop-blur hover:bg-muted`}
          >
            <Pencil className="h-4 w-4" />
            <span>수정</span>
          </Link>
        </>
      )}
      <Link
        href="/editor"
        aria-label="새 글 작성"
        className={`${buttonBase} bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]`}
      >
        <Plus className="h-4 w-4" />
        <span>새 글 작성</span>
      </Link>
    </div>
  );
}
