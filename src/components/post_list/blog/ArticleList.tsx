'use client';

import { useRouter } from 'next/navigation';
import { Flame, ThumbsUp } from 'lucide-react';
import type { Post } from '@/config/types';
import ScrollTopLink from '@/components/common/ScrollTopLink';

function ArticleItem({
  post,
  isFirst,
  isRecommended = false,
  isHot = false,
}: {
  post: Post;
  isFirst: boolean;
  isRecommended?: boolean;
  isHot?: boolean;
}) {
  const router = useRouter();
  const href = `/blog/${post.category}/${post.date.toString()}`;

  return (
    <ScrollTopLink
      href={href}
      className={`group grid grid-cols-[1fr_140px] md:grid-cols-[1fr_200px] gap-6 md:gap-8 items-center py-8 ${isFirst ? 'pt-0' : ''}`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isRecommended && (
            <span className="inline-flex items-center text-recommend bg-recommend-soft rounded-md px-2 py-1" aria-label="recommended">
              <ThumbsUp className="h-4 w-4" />
            </span>
          )}
          {isHot && (
            <span className="inline-flex items-center text-hot bg-hot-soft rounded-md px-2 py-1" aria-label="hot">
              <Flame className="h-4 w-4" />
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/blog/${post.category}`);
            }}
            className="inline-block text-sm font-semibold text-brand bg-brand-soft rounded-md px-2.5 py-1 transition-transform duration-200 hover:scale-110"
          >
            {post.category}
          </button>
          <span className="text-sm font-medium text-muted-foreground bg-secondary rounded-md px-2.5 py-1">{post.date.toString()}</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug tracking-tight mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-title-hover">
          {post.title}
        </h3>
        {post.description && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.description}</p>}
      </div>
      <div className="w-full aspect-[1.55/1] rounded-2xl overflow-hidden bg-secondary">
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.12]"
          />
        )}
      </div>
    </ScrollTopLink>
  );
}

export default function ArticleList({
  posts,
  title = '전체 아티클',
  recommendedIds,
  hotIds,
}: {
  posts: Post[];
  title?: string;
  recommendedIds?: Set<number>;
  hotIds?: Set<number>;
}) {
  return (
    <section>
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">{title}</h2>
      <div className="mt-9">
        {posts.map((post, i) => (
          <ArticleItem
            key={post.id}
            post={post}
            isFirst={i === 0}
            isRecommended={recommendedIds?.has(post.id)}
            isHot={hotIds?.has(post.id)}
          />
        ))}
      </div>
    </section>
  );
}
