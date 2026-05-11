'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { Post } from '@/config/types';
import ChevronIcon from './ChevronIcon';

const AUTO_INTERVAL_MS = 10_000;

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const go = useCallback(
    (dir: 'next' | 'prev') => {
      setDirection(dir);
      setIndex((i) =>
        dir === 'next' ? (i + 1) % posts.length : (i - 1 + posts.length) % posts.length,
      );
    },
    [posts.length],
  );

  useEffect(() => {
    if (posts.length <= 1) return;
    const t = setInterval(() => go('next'), AUTO_INTERVAL_MS);
    return () => clearInterval(t);
  }, [go, index, posts.length]);

  if (!posts.length) return null;

  const current = posts[index];
  const slideClass = direction === 'next' ? 'slide-in-from-right-8' : 'slide-in-from-left-8';

  return (
    <section className="mx-auto mt-12 w-full max-w-[1130px] px-4 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center min-h-[260px]">
        <div>
          <Link
            key={index}
            href={`/blog/${current.category}/${current.date.toString()}`}
            className={`group block animate-in fade-in duration-1000 ${slideClass}`}
          >
            <div className="mb-4">
              <span className="text-[13px] font-semibold text-brand bg-brand-soft rounded-md px-2.5 py-1">
                {current.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight mb-5 line-clamp-2 transition-colors duration-200 group-hover:text-title-hover">
              {current.title}
            </h1>
            {current.description && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-2">
                {current.description}
              </p>
            )}
          </Link>
          <div className="flex gap-3 mt-16">
            <button
              type="button"
              onClick={() => go('prev')}
              aria-label="이전"
              className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              <ChevronIcon direction="left" size={16} />
            </button>
            <button
              type="button"
              onClick={() => go('next')}
              aria-label="다음"
              className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              <ChevronIcon direction="right" size={16} />
            </button>
          </div>
        </div>
        <Link
          key={`img-${index}`}
          href={`/blog/${current.category}/${current.date.toString()}`}
          className={`group aspect-[1.6/1] rounded-[20px] overflow-hidden bg-muted block animate-in fade-in duration-1000 ${slideClass}`}
        >
          {current.thumbnail && (
            <img
              src={current.thumbnail}
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
            />
          )}
        </Link>
      </div>
    </section>
  );
}
