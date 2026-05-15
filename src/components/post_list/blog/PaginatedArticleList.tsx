import type { Post } from '@/config/types';
import ArticleList from './ArticleList';
import Pagination from './Pagination';

interface Props {
  posts: Post[];
  category?: string;
  currentPage: number;
  totalPages: number;
  basePath: string;
  recommendedIds?: Set<number>;
  hotIds?: Set<number>;
}

export default function PaginatedArticleList({ posts, category, currentPage, totalPages, basePath, recommendedIds, hotIds }: Props) {
  const title = category ?? '전체 아티클';

  return (
    <div id="article-list-top" className="scroll-mt-20">
      <ArticleList posts={posts} title={title} recommendedIds={recommendedIds} hotIds={hotIds} />
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} anchorId="article-list-top" />
    </div>
  );
}
