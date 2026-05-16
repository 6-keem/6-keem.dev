'use client';

import { Post } from '@/config/types';
import Image from 'next/image';
import { Flame, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  post: Post;
  isRecommended?: boolean;
  isHot?: boolean;
}

export const PostHeader = ({ post, isRecommended = false, isHot = false }: Props) => {
  const router = useRouter();

  return (
    <header className="my-14 text-center space-y-8">
      <div className="flex flex-wrap justify-center items-center gap-2">
        {post.published === false && (
          <span className="inline-flex items-center text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide">
            Draft
          </span>
        )}
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
          onClick={() => router.push(`/blog/${post.category}`)}
          className="inline-block text-sm font-semibold text-brand bg-brand-soft rounded-md px-2.5 py-1 transition-transform duration-200 hover:scale-110"
        >
          {post.category}
        </button>
        <span className="text-sm font-medium text-muted-foreground bg-secondary rounded-md px-2.5 py-1">{post.date.toString()}</span>
      </div>
      <p className="text-foreground font-medium mb-5 text-5xl">{post.title}</p>
      <div className="text-lg font-light text-foreground">{post.description}</div>
      <div className="w-full py-4">
        <Image src={post.thumbnail} alt={post.title} width={1080} height={400} className="rounded-2xl object-cover" />
      </div>
    </header>
  );
};
