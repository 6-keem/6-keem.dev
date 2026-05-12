import {
  getHeroPosts,
  getPostsCount,
  getPostsLazy,
  getRandomPosts,
  getSeriesSummary,
} from '@/lib/supabase-function';
import HeroSlider from './blog/HeroSlider';
import PaginatedArticleList from './blog/PaginatedArticleList';
import SeriesSection, { SeriesCardData } from './blog/SeriesSection';
import RandomPicks from './blog/RandomPicks';

const PAGE_SIZE = 5;

interface PostListProps {
  category?: string;
  page?: number;
}

async function loadSeriesCards(): Promise<SeriesCardData[]> {
  const summary = await getSeriesSummary();
  return summary.map((s) => {
    const date = new Date(s.first_post_date)
      .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replaceAll('/', '-');
    return {
      id: s.id,
      name: s.series_name,
      description: s.description ?? s.first_post_description,
      count: s.post_count,
      thumbnail: s.thumbnail_url ?? s.first_post_thumbnail,
      href: `/blog/${s.first_post_category}/${date}`,
    } satisfies SeriesCardData;
  });
}

const PostListPage = async ({ category, page = 1 }: PostListProps) => {
  const isRoot = !category;
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * PAGE_SIZE;

  const [pagePosts, totalCount, heroPosts, randomPicks, series] = await Promise.all([
    getPostsLazy(category, PAGE_SIZE, offset),
    getPostsCount(category),
    isRoot ? getHeroPosts() : Promise.resolve([]),
    isRoot ? getRandomPosts(5) : Promise.resolve([]),
    isRoot ? loadSeriesCards() : Promise.resolve([]),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const basePath = category ? `/blog/${category}` : '/blog';

  return (
    <>
      {isRoot && <HeroSlider posts={heroPosts} />}

      <section className="mx-auto mt-20 md:mt-24 w-full max-w-[1130px] px-4 md:px-12">
        {isRoot ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] gap-10 lg:gap-16 items-start">
            <main className="min-w-0">
              <PaginatedArticleList
                posts={pagePosts}
                category={category}
                currentPage={safePage}
                totalPages={totalPages}
                basePath={basePath}
              />
            </main>
            <aside className="lg:sticky lg:top-24">
              <RandomPicks posts={randomPicks} />
            </aside>
          </div>
        ) : (
          <main>
            <PaginatedArticleList
              posts={pagePosts}
              category={category}
              currentPage={safePage}
              totalPages={totalPages}
              basePath={basePath}
            />
          </main>
        )}
      </section>

      {isRoot && <SeriesSection series={series} />}
    </>
  );
};

export default PostListPage;
