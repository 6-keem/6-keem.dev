'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">500</p>
      <h1 className="mt-3 text-3xl font-extrabold text-foreground tracking-tight">문제가 발생했어요</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        일시적인 오류일 수 있어요. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-brand text-brand-foreground font-semibold text-sm px-5 py-2.5 hover:opacity-90"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm px-5 py-2.5 hover:opacity-90"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
