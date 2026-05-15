import { Github } from 'lucide-react';
import Link from 'next/link';
import { signIn } from '@/lib/auth';
import { blogName } from '@/config/const';

export default function SignIn() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-sm">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {blogName}
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              관리자 로그인
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              관리자 권한이 필요한 페이지입니다.
            </p>
          </div>

          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2.5 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.99]"
            >
              <Github className="h-4 w-4" />
              <span>GitHub으로 계속하기</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            허용된 GitHub 계정만 접근할 수 있습니다.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
