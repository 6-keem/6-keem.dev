import Link from 'next/link';
import type { Post } from '@/config/types';

export default function RandomPicks({ posts }: { posts: Post[] }) {
  return (
    <div className="rounded-[20px] bg-muted px-5 py-7">
      <h3 className="text-[17px] font-bold text-muted-foreground tracking-tight mb-6">이 글은 어때요? &nbsp; 🦅</h3>

      <div className="flex flex-col gap-5">
        {posts.map((post, i) => (
          <Link key={post.id} href={`/blog/${post.category}/${post.date.toString()}`} className="group flex items-start gap-3">
            <div className="w-[20px] flex items-center justify-center text-[13px] font-bold text-brand shrink-0 pt-0.5">{i + 1}</div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-foreground/75 leading-snug line-clamp-3 mb-2 group-hover:text-foreground transition-colors duration-200">
                {post.title}
              </div>
              <div className="text-[13px] text-muted-foreground/70">{post.category}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
