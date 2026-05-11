import { Post } from '@/config/types';
import { getPosts, getSeriesInfo } from '@/lib/supabase-function';
import HeroSlider from './blog/HeroSlider';
import PaginatedArticleList from './blog/PaginatedArticleList';
import SeriesSection, { SeriesCardData } from './blog/SeriesSection';
import RandomPicks from './blog/RandomPicks';

interface PostListProps {
  category?: string;
}

async function buildSeries(posts: Post[]): Promise<SeriesCardData[]> {
  const groups = new Map<number, Post[]>();
  for (const p of posts) {
    if (!p.series_id) continue;
    const arr = groups.get(p.series_id) ?? [];
    arr.push(p);
    groups.set(p.series_id, arr);
  }

  const entries = await Promise.all(
    Array.from(groups.entries()).map(async ([id, items]) => {
      const sorted = [...items].sort((a, b) => a.date.toString().localeCompare(b.date.toString()));
      const head = sorted[0];
      let name = `Series #${id}`;
      try {
        const info = await getSeriesInfo(id);
        if (info?.series_name) name = info.series_name;
      } catch {}
      return {
        id,
        name,
        description: head.description,
        count: items.length,
        thumbnail: head.thumbnail,
        href: `/blog/${head.category}/${head.date.toString()}`,
      } satisfies SeriesCardData;
    }),
  );

  return entries.sort((a, b) => b.count - a.count);
}

const PostListPage = async ({ category }: PostListProps) => {
  const postList: Post[] = await getPosts(category);

  const isRoot = !category;
  const sortedByDate = [...postList].sort((a, b) =>
    b.date.toString().localeCompare(a.date.toString()),
  );
  const heroPosts = isRoot ? sortedByDate.slice(0, 3) : [];
  const series = isRoot ? await buildSeries(postList) : [];

  return (
    <>
      {isRoot && <HeroSlider posts={heroPosts} />}

      <section className="mx-auto mt-20 md:mt-24 w-full max-w-[1130px] px-4 md:px-12">
        {isRoot ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] gap-10 lg:gap-16 items-start">
            <main className="min-w-0">
              <PaginatedArticleList posts={sortedByDate} />
            </main>
            <aside className="lg:sticky lg:top-24">
              <RandomPicks posts={sortedByDate} count={5} />
            </aside>
          </div>
        ) : (
          <main>
            <PaginatedArticleList posts={sortedByDate} />
          </main>
        )}
      </section>

      {isRoot && <SeriesSection series={series} />}
    </>
  );
};

export default PostListPage;
