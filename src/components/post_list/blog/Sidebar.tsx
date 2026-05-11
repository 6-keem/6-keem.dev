import Link from 'next/link';
import type { Post } from '@/config/types';

export interface CommentItem {
  href: string;
  username: string;
  avatar?: string;
  avatarBg?: string;
  text: string;
  articleTitle: string;
}

export function PopularArticles({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-muted rounded-[20px] px-6 py-7">
      <h3 className="text-[15px] font-bold text-foreground mb-5 tracking-tight">인기 있는 글</h3>
      <div className="flex flex-col gap-5">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.category}/${post.date.toString()}`}
            className="group flex items-start gap-3"
          >
            <div className="w-[26px] h-[26px] rounded-lg bg-background flex items-center justify-center text-[13px] font-bold text-brand shrink-0">
              {i + 1}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground leading-snug line-clamp-3 mb-1.5 group-hover:text-brand transition-colors">
                {post.title}
              </div>
              <div className="text-xs text-muted-foreground">{post.category}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RecentComments({ items }: { items: CommentItem[] }) {
  return (
    <div className="bg-muted rounded-[20px] px-6 py-7">
      <h3 className="text-[15px] font-bold text-foreground mb-5 tracking-tight">최신 댓글</h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-background rounded-[14px] p-4 transition-transform hover:-translate-y-px"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-base shrink-0 overflow-hidden bg-secondary"
                style={item.avatarBg ? { background: item.avatarBg } : undefined}
              >
                {item.avatar}
              </div>
              <span className="text-[13px] font-semibold text-muted-foreground">{item.username}</span>
            </div>
            <div className="text-sm text-foreground leading-snug font-medium line-clamp-2 mb-2">
              {item.text}
            </div>
            <div className="text-xs text-muted-foreground truncate">{item.articleTitle}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ popular, comments }: { popular: Post[]; comments: CommentItem[] }) {
  return (
    <aside className="flex flex-col gap-5">
      <PopularArticles posts={popular} />
      <RecentComments items={comments} />
    </aside>
  );
}
