import {
  getHeroPosts,
  getHotPosts,
  getPostsCount,
  getPostsLazy,
  getTrackSummary,
} from '@/lib/supabase-function';
import HeroSlider from './blog/HeroSlider';
import PaginatedArticleList from './blog/PaginatedArticleList';
import TrackSection, { TrackCardData } from './blog/TrackSection';
import HotPicks from './blog/HotPicks';

const PAGE_SIZE = 5;

interface PostListProps {
  category?: string;
  page?: number;
}

async function loadTrackCards(): Promise<TrackCardData[]> {
  const summary = await getTrackSummary();
  return summary.map((t) => ({
    id: t.id,
    name: t.trackName,
    description: t.description ?? t.firstPostDescription,
    count: t.postCount,
    thumbnail: t.thumbnailUrl ?? t.firstPostThumbnail,
    href: `/blog/track/${t.id}`,
  } satisfies TrackCardData));
}

const PostListPage = async ({ category, page = 1 }: PostListProps) => {
  const isRoot = !category;
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * PAGE_SIZE;

  const [pagePosts, totalCount, heroPosts, hotPicks, tracks] = await Promise.all([
    getPostsLazy(category, PAGE_SIZE, offset),
    getPostsCount(category),
    getHeroPosts(),
    getHotPosts(5),
    isRoot ? loadTrackCards() : Promise.resolve([]),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const basePath = category ? `/blog/${category}` : '/blog';
  const recommendedIds = new Set(heroPosts.map((p) => p.id));
  const hotIds = new Set(hotPicks.map((p) => p.id));

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
                recommendedIds={recommendedIds}
                hotIds={hotIds}
              />
            </main>
            <aside className="lg:sticky lg:top-24">
              <HotPicks posts={hotPicks} />
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
              recommendedIds={recommendedIds}
              hotIds={hotIds}
            />
          </main>
        )}
      </section>

      {isRoot && <TrackSection tracks={tracks} />}
    </>
  );
};

export default PostListPage;
