'use client';

import { useMemo, useRef, useState } from 'react';
import type { Post } from '@/config/types';
import ArticleList from './ArticleList';
import Pagination from './Pagination';
import { useRouter } from 'next/router';

const PAGE_SIZE = 5;

export default function PaginatedArticleList({ posts }: { posts: Post[] }) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const pageItems = useMemo(() => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [posts, page]);

  // const router = useRouter();
  // const url = router.pathname;
  // console.log(url);

  return (
    <div ref={topRef} className="scroll-mt-20">
      <ArticleList posts={pageItems} />
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
