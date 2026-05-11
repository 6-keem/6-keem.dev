'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Post } from '@/config/types';

function pickRandom<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return [...arr];
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export default function RandomPicks({ posts, count = 3 }: { posts: Post[]; count?: number }) {
  const [picks, setPicks] = useState<Post[] | null>(null);

  useEffect(() => {
    setPicks(pickRandom(posts, count));
  }, [posts, count]);

  return (
    <div className="rounded-[20px] bg-muted px-5 py-7">
      <h3 className="text-[17px] font-bold text-muted-foreground tracking-tight mb-6">이 글 어때요? &nbsp; 🦅</h3>

      <div className="flex flex-col gap-5">
        {(picks ?? Array.from({ length: count })).map((post, i) => {
          if (!post) {
            return (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-[20px] h-[20px] rounded bg-background shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded bg-background w-5/6" />
                  <div className="h-3 rounded bg-background w-2/3" />
                </div>
              </div>
            );
          }
          return (
            <Link key={post.id} href={`/blog/${post.category}/${post.date.toString()}`} className="group flex items-start gap-3">
              <div className="w-[20px] flex items-center justify-center text-[13px] font-bold text-brand shrink-0 pt-0.5">
                {i + 1}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-foreground/75 leading-snug line-clamp-3 mb-2 group-hover:text-foreground transition-colors duration-200">
                  {post.title}
                </div>
                <div className="text-[13px] text-muted-foreground/70">{post.category}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
