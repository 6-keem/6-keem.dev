import ScrollTopLink from '@/components/common/ScrollTopLink';
import { Post } from '@/config/types';

interface Props {
  trackId: number;
  trackName: string;
  description?: string | null;
  slug: string;
  posts: Post[];
}

export default function Track({ trackId, trackName, description, slug, posts }: Props) {
  // oldest first, numbered 01, 02, 03...
  const ordered = [...posts].sort((a, b) => a.date.toString().localeCompare(b.date.toString()));
  const firstPost = ordered[0];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="bg-muted px-6 pt-6 pb-7">
        <h3 className="m-0 text-2xl md:text-[28px] font-extrabold text-foreground leading-tight tracking-tight">{trackName}</h3>
        {description ? <p className="mt-3 mb-0 text-sm text-muted-foreground leading-relaxed">{description}</p> : null}
      </div>

      <ol className="list-none p-0 m-0 px-6 py-6 space-y-5">
        {ordered.map((post, i) => {
          const number = String(i + 1).padStart(2, '0');
          const isCurrent = post.date.toString() === slug;
          return (
            <li key={post.id} className="m-0 p-0 flex items-start gap-3">
              <span className={`shrink-0 text-base font-semibold tabular-nums ${isCurrent ? 'text-title-hover' : 'text-muted-foreground'}`}>
                {number}
              </span>
              <ScrollTopLink
                href={`/blog/${post.category}/${post.date}`}
                className={`text-base leading-relaxed no-underline transition-colors duration-200 ${
                  isCurrent
                    ? 'text-title-hover font-semibold'
                    : 'text-foreground underline underline-offset-4 decoration-foreground/30 hover:text-title-hover hover:decoration-title-hover'
                }`}
              >
                {post.title}
              </ScrollTopLink>
            </li>
          );
        })}
      </ol>

      <div className="flex justify-center gap-2 pb-6">
        {firstPost ? (
          <ScrollTopLink
            href={`/blog/${firstPost.category}/${firstPost.date}`}
            className="inline-block rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm px-5 py-2.5 no-underline hover:opacity-90"
          >
            처음부터 읽기
          </ScrollTopLink>
        ) : null}
        <ScrollTopLink
          href={`/blog/track/${trackId}`}
          className="inline-block rounded-lg bg-brand text-brand-foreground font-semibold text-sm px-5 py-2.5 no-underline hover:opacity-90"
        >
          트랙 둘러보기
        </ScrollTopLink>
      </div>
    </div>
  );
}
