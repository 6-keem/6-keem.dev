'use client';

import { useMemo, useRef, useState } from 'react';
import type { Post } from '@/config/types';
import ArticleList from './ArticleList';
import Pagination from './Pagination';

const PAGE_SIZE = 5;

export default function PaginatedArticleList({ posts, title }: { posts: Post[]; title?: string }) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [posts, page],
  );

  return (
    <div ref={topRef} className="scroll-mt-20">
      <ArticleList posts={pageItems} title={title} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => {
          setPage(p);
          topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
}
