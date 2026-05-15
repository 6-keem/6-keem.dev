import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-foreground tracking-tight">찾으시는 페이지가 없어요</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        주소가 정확한지 확인해 주세요. 글이 비공개로 전환되었거나 이동되었을 수 있어요.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-block rounded-lg bg-brand text-brand-foreground font-semibold text-sm px-5 py-2.5 hover:opacity-90"
        >
          블로그로 가기
        </Link>
      </div>
    </div>
  );
}
