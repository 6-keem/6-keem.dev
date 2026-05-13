import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Layers } from 'lucide-react';
import ArticleList from '@/components/post_list/blog/ArticleList';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { getHeroPosts, getTrackDetail, getTrackPosts } from '@/lib/supabase-function';

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

  const [detail, posts, heroPosts] = await Promise.all([
    getTrackDetail(trackId),
    getTrackPosts(trackId),
    getHeroPosts(),
  ]);
  if (!detail) notFound();

  const recommendedIds = new Set(heroPosts.map((p) => p.id));
  // newest first for the listing.
  const orderedPosts = [...posts].sort((a, b) => b.date.toString().localeCompare(a.date.toString()));

  return (
    <>
      <section className="mx-auto mt-12 w-full max-w-[1130px] px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden">
          <div className="aspect-square bg-secondary flex items-center justify-center">
            {detail.thumbnailUrl ? (
              <img src={detail.thumbnailUrl} alt={detail.trackName} className="w-full h-full object-cover" />
            ) : (
              <Layers className="w-20 h-20 text-muted-foreground/50" />
            )}
          </div>
          <div className="bg-muted p-8 md:p-10 flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
              <Layers className="w-4 h-4" />
              Track
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
              {detail.trackName}
            </h1>
            <div className="mt-auto pt-8">
              {detail.description && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">{detail.description}</p>
              )}
              <p className="text-sm text-muted-foreground">아티클 {posts.length}개</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1130px] px-4 md:px-12">
        <ArticleList posts={orderedPosts} title="에피소드" recommendedIds={recommendedIds} />
      </section>
    </>
  );
};

export default TrackPage;
