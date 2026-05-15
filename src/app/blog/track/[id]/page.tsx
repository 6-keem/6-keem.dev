import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/components/post_list/blog/ArticleList';
import TrackHeader from '@/components/post_list/blog/TrackHeader';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { getHeroPosts, getHotPosts, getTrackDetail, getTrackPosts } from '@/lib/supabase-function';

type Props = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Props }): Promise<Metadata> {
  const { id } = await params;
  const numeric = Number(id);
  const detail = Number.isFinite(numeric) ? await getTrackDetail(numeric) : null;
  const title = detail ? `${detail.trackName} | ${blogName}` : blogName;
  return {
    title,
    openGraph: {
      title,
      url: `${baseDomain}/blog/track/${id}`,
      images: [detail?.thumbnailUrl ?? blogThumbnailURL],
    },
    twitter: {
      title,
      images: [detail?.thumbnailUrl ?? blogThumbnailURL],
    },
  };
}

const TrackPage = async ({ params }: { params: Props }) => {
  const { id } = await params;
  const trackId = Number(id);
  if (!Number.isFinite(trackId)) notFound();

  const [detail, posts, heroPosts, hotPosts] = await Promise.all([
    getTrackDetail(trackId),
    getTrackPosts(trackId),
    getHeroPosts(),
    getHotPosts(5),
  ]);
  if (!detail) notFound();

  const recommendedIds = new Set(heroPosts.map((p) => p.id));
  const hotIds = new Set(hotPosts.map((p) => p.id));
  const orderedPosts = [...posts].sort((a, b) => b.date.toString().localeCompare(a.date.toString()));

  return (
    <>
      <TrackHeader
        trackName={detail.trackName}
        description={detail.description}
        thumbnailUrl={detail.thumbnailUrl ?? '/gallery/japan/2023-7/himeji.jpg'}
        postCount={posts.length}
      />

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1130px] px-4 md:px-12">
        <ArticleList posts={orderedPosts} title="에피소드" recommendedIds={recommendedIds} hotIds={hotIds} />
      </section>
    </>
  );
};

export default TrackPage;
